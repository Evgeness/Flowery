# backend/app/crud/plant.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from sqlalchemy import delete
from datetime import datetime, timedelta
from fastapi import HTTPException

from app.models.plant import Plant, UserPlant
from app.schemas.plant import PlantCreate, PlantUpdate

# ==========================================
# ФУНКЦИИ ДЛЯ ОБЩЕГО КАТАЛОГА (PLANT)
# ==========================================

async def get_plants(db: AsyncSession) -> list[Plant]:
    """Получить список всех доступных растений."""
    result = await db.execute(select(Plant))
    return list(result.scalars().all())

async def get_plant_by_name(db: AsyncSession, name: str) -> Plant | None:
    """Найти растение по названию (для проверки дубликатов)."""
    result = await db.execute(select(Plant).where(Plant.name == name))
    return result.scalar_one_or_none()

async def create_plant(db: AsyncSession, plant_in: PlantCreate) -> Plant:
    """Добавить новое растение в каталог (Админ)."""
    db_plant = Plant(
        name=plant_in.name,
        description=plant_in.description,
        watering_interval_days=plant_in.watering_interval_days,
        image_url=plant_in.image_url  
    )
    db.add(db_plant)
    await db.commit()
    await db.refresh(db_plant)
    return db_plant

async def update_plant(db: AsyncSession, plant_id: int, plant_in: PlantUpdate) -> Plant | None:
    """Обновить информацию о растении в каталоге (Админ)."""
    result = await db.execute(select(Plant).where(Plant.id == plant_id))
    db_plant = result.scalar_one_or_none()
    
    if not db_plant:
        return None
        
    update_data = plant_in.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_plant, key, value)
        
    await db.commit()
    await db.refresh(db_plant)
    return db_plant

async def delete_plant(db: AsyncSession, plant_id: int) -> bool:
    """Удалить растение из каталога (Админ)."""
    result = await db.execute(select(Plant).where(Plant.id == plant_id))
    db_plant = result.scalar_one_or_none()
    
    if not db_plant:
        return False
        
    await db.delete(db_plant)
    await db.commit()
    return True

# ==========================================
# ФУНКЦИИ ДЛЯ РАСТЕНИЙ ПОЛЬЗОВАТЕЛЯ (USERPLANT)
# ==========================================

async def add_plant_to_user(db: AsyncSession, user_id: str, plant_id: int, custom_name: str | None) -> UserPlant | None:
    """Добавить растение из каталога в личный список пользователя."""
    # 1. Проверяем, существует ли такое растение в каталоге
    result = await db.execute(select(Plant).where(Plant.id == plant_id))
    plant = result.scalar_one_or_none()
    if not plant:
        return None
        
    # 2. Рассчитываем даты полива
    now = datetime.utcnow()
    next_watering = now + timedelta(days=plant.watering_interval_days)
    
    # 3. Создаем запись
    db_user_plant = UserPlant(
        user_id=user_id,
        plant_id=plant_id,
        custom_name=custom_name,
        last_watered_at=now,
        next_watering_at=next_watering
    )
    db.add(db_user_plant)
    await db.commit()
    
    # 4. Загружаем объект вместе со связанным растением, чтобы вернуть в API
    result = await db.execute(
        select(UserPlant)
        .options(selectinload(UserPlant.plant))
        .where(UserPlant.id == db_user_plant.id)
    )
    return result.scalar_one()

async def get_user_plants(db: AsyncSession, user_id: str) -> list[UserPlant]:
    """Получить все растения конкретного пользователя."""
    result = await db.execute(
        select(UserPlant)
        .options(selectinload(UserPlant.plant)) # Загружаем сразу данные каталога
        .where(UserPlant.user_id == user_id)
    )
    return list(result.scalars().all())

async def delete_user_plant(db: AsyncSession, user_id: str, user_plant_id: int) -> bool:
    """Удалить растение из личного списка пользователя."""
    result = await db.execute(
        select(UserPlant).where(
            UserPlant.id == user_plant_id, 
            UserPlant.user_id == user_id # Проверка, что юзер удаляет своё
        )
    )
    db_user_plant = result.scalar_one_or_none()
    
    if not db_user_plant:
        return False
        
    await db.delete(db_user_plant)
    await db.commit()
    return True

async def water_user_plant(db: AsyncSession, user_id: str, user_plant_id: int) -> UserPlant | None:
    """Отметить растение как политое и пересчитать следующую дату."""
    result = await db.execute(
        select(UserPlant)
        .options(selectinload(UserPlant.plant)) # Нам нужен интервал из каталога
        .where(UserPlant.id == user_plant_id, UserPlant.user_id == user_id)
    )
    db_user_plant = result.scalar_one_or_none()
    
    if not db_user_plant:
        return None
        
    # Обновляем даты
    now = datetime.utcnow()
    db_user_plant.last_watered_at = now
    db_user_plant.next_watering_at = now + timedelta(days=db_user_plant.plant.watering_interval_days)
    
    await db.commit()
    await db.refresh(db_user_plant)
    return db_user_plant