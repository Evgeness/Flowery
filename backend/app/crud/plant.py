from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from datetime import datetime, timedelta
from app.models.plant import Plant, UserPlant


# ==========================================
# CRUD для справочника растений (Plant)
# ==========================================

async def get_plants(db: AsyncSession, skip: int = 0, limit: int = 100):
    """Получить список всех доступных растений для выбора"""
    result = await db.execute(select(Plant).offset(skip).limit(limit))
    return result.scalars().all()


async def get_plant(db: AsyncSession, plant_id: int):
    """Получить информацию о конкретном растении из справочника"""
    result = await db.execute(select(Plant).where(Plant.id == plant_id))
    return result.scalar_one_or_none()


# ==========================================
# CRUD для растений пользователя (UserPlant)
# ==========================================

async def add_plant_to_user(db: AsyncSession, user_id: int, plant_id: int, custom_name: str = None):
    """Добавить растение пользователю и рассчитать дату следующего полива"""
    plant = await get_plant(db, plant_id)
    if not plant:
        return None

    now = datetime.utcnow()
    next_watering = now + timedelta(days=plant.watering_interval_days)

    new_user_plant = UserPlant(
        user_id=user_id,
        plant_id=plant_id,
        custom_name=custom_name or plant.name,
        last_watered_at=now,
        next_watering_at=next_watering
    )

    db.add(new_user_plant)
    await db.commit()
    await db.refresh(new_user_plant)

    # Явно подгружаем связь с растением, чтобы Pydantic мог её отдать
    stmt = (
        select(UserPlant)
        .options(selectinload(UserPlant.plant))
        .where(UserPlant.id == new_user_plant.id)
    )
    result = await db.execute(stmt)
    return result.scalar_one_or_none()


async def get_user_plants(db: AsyncSession, user_id: int):
    """Получить список всех растений, которые отслеживает пользователь"""
    result = await db.execute(
        select(UserPlant)
        .options(selectinload(UserPlant.plant))
        .where(UserPlant.user_id == user_id)
    )
    return result.scalars().all()


async def get_user_plant(db: AsyncSession, user_id: int, user_plant_id: int):
    """Получить конкретное растение пользователя (с проверкой владельца)"""
    result = await db.execute(
        select(UserPlant)
        .options(selectinload(UserPlant.plant))
        .where(
            UserPlant.id == user_plant_id,
            UserPlant.user_id == user_id
        )
    )
    return result.scalar_one_or_none()


async def delete_user_plant(db: AsyncSession, user_id: int, user_plant_id: int):
    """Удалить растение из отслеживания пользователя"""
    plant = await get_user_plant(db, user_id, user_plant_id)
    if plant:
        await db.delete(plant)
        await db.commit()
    return plant