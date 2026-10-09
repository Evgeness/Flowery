from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.plant import PlantResponse, UserPlantCreate, UserPlantResponse
from app.crud import plant as crud_plant
from app.models.user import User

router = APIRouter()

@router.get("/plants", response_model=List[PlantResponse])
async def get_all_plants(db: AsyncSession = Depends(get_db)):
    plants = await crud_plant.get_plants(db)
    return plants

@router.post("/my-plants", response_model=UserPlantResponse)
async def add_my_plant(
    plant_data: UserPlantCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
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
    plants = await crud_plant.get_user_plants(db, user_id=current_user.id)
    return plants

@router.delete("/my-plants/{user_plant_id}")
async def delete_my_plant(
    user_plant_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = await crud_plant.delete_user_plant(db, user_id=current_user.id, user_plant_id=user_plant_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Растение не найдено")
    return {"message": "Растение успешно удалено"}