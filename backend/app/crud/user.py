from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException

from app.models.user import User
from app.schemas.user import UserCreate
from app.core.security import get_password_hash, verify_password

async def get_user_by_id(db: AsyncSession, user_id: str) -> User | None:
    """Получить пользователя по его UUID."""
    # Примечание: если в БД колонка UUID, SQLAlchemy сама преобразует строку
    result = await db.execute(select(User).where(User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    """Получить пользователя по email."""
    result = await db.execute(select(User).where(User.email == email))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    """Создать нового пользователя."""
    # 1. Хешируем пароль
    hashed_password = get_password_hash(user_in.password)
    
    # 2. Создаем объект модели
    db_user = User(
        email=user_in.email,
        hashed_password=hashed_password,
        name=user_in.name,
        role="user" # или UserRole.USER, если импортировали Enum
    )
    
    # 3. Сохраняем в БД
    db.add(db_user)
    try:
        await db.commit()
        await db.refresh(db_user)
        return db_user
    except IntegrityError:
        # Ловим ошибку, если email уже существует (на всякий случай, если проверка в роутере не сработала)
        await db.rollback()
        raise HTTPException(status_code=400, detail="Пользователь с таким email уже существует")

async def authenticate(db: AsyncSession, email: str, password: str) -> User | None:
    """Проверить email и пароль при входе."""
    user = await get_user_by_email(db, email=email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user