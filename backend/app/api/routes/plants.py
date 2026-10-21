from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from datetime import datetime, timedelta

from app.db.session import get_db
# Добавляем зависимость для проверки прав админа
from app.api.deps import get_current_user, get_current_admin 
from app.schemas.plant import (
    PlantResponse, 
    PlantCreate, 
    PlantUpdate, 
    UserPlantCreate, 
    UserPlantResponse
)
from app.crud import plant as crud_plant
from app.models.user import User

router = APIRouter()

# ==========================================
# ПУБЛИЧНЫЕ МАРШРУТЫ (Доступны всем)
# ==========================================

@router.get("/plants", response_model=List[PlantResponse])
async def get_all_plants(db: AsyncSession = Depends(get_db)):
    """Получить каталог всех доступных растений."""
    plants = await crud_plant.get_plants(db)
    return plants

# ==========================================
# МАРШРУТЫ ПОЛЬЗОВАТЕЛЯ (Требуют авторизации)
# ==========================================

@router.post("/my-plants", response_model=UserPlantResponse, status_code=status.HTTP_201_CREATED)
async def add_my_plant(
    plant_data: UserPlantCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Добавить растение из каталога в свой личный список."""
    new_plant = await crud_plant.add_plant_to_user(
        db,
        user_id=current_user.id,
        plant_id=plant_data.plant_id,
        custom_name=plant_data.custom_name
    )
    if not new_plant:
        raise HTTPException(status_code=404, detail="Растение не найдено в справочнике")
    return new_plant

@router.get("/my-plants", response_model=List[UserPlantResponse])
async def get_my_plants(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Получить список своих растений."""
    plants = await crud_plant.get_user_plants(db, user_id=current_user.id)
    return plants

@router.delete("/my-plants/{user_plant_id}")
async def delete_my_plant(
    user_plant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Удалить растение из своего списка."""
    deleted = await crud_plant.delete_user_plant(db, user_id=current_user.id, user_plant_id=user_plant_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Растение не найдено или не принадлежит вам")
    return {"message": "Растение успешно удалено"}

@router.post("/my-plants/{user_plant_id}/water", response_model=UserPlantResponse)
async def water_my_plant(
    user_plant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Отметить растение как политое. 
    Обновляет last_watered_at и рассчитывает новую дату next_watering_at.
    """
    # Здесь мы вызываем CRUD-функцию, которая найдет растение пользователя,
    # обновит дату полива и прибавит интервал.
    updated_plant = await crud_plant.water_user_plant(
        db, 
        user_id=current_user.id, 
        user_plant_id=user_plant_id
    )
    if not updated_plant:
        raise HTTPException(status_code=404, detail="Растение не найдено")
    return updated_plant


# ==========================================
# МАРШРУТЫ АДМИНИСТРАТОРА (Требуют роль ADMIN)
# ==========================================

@router.post("/plants", response_model=PlantResponse, status_code=status.HTTP_201_CREATED)
async def create_plant(
    plant_in: PlantCreate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin) # <-- Защита!
):
    """Добавить новое растение в общий каталог (Только Админ)."""
    # Проверяем, нет ли уже растения с таким именем
    existing_plant = await crud_plant.get_plant_by_name(db, name=plant_in.name)
    if existing_plant:
        raise HTTPException(status_code=400, detail="Растение с таким названием уже существует")
    
    new_plant = await crud_plant.create_plant(db, plant_in)
    return new_plant

@router.put("/plants/{plant_id}", response_model=PlantResponse)
async def update_plant(
    plant_id: int,
    plant_in: PlantUpdate,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Редактировать растение в каталоге (Только Админ)."""
    updated_plant = await crud_plant.update_plant(db, plant_id=plant_id, plant_in=plant_in)
    if not updated_plant:
        raise HTTPException(status_code=404, detail="Растение не найдено")
    return updated_plant

@router.delete("/plants/{plant_id}")
async def delete_plant(
    plant_id: int,
    db: AsyncSession = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Удалить растение из каталога (Только Админ)."""
    deleted = await crud_plant.delete_plant(db, plant_id=plant_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Растение не найдено")
    return {"message": "Растение удалено из каталога"}