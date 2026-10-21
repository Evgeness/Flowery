from pydantic import BaseModel, EmailStr
from uuid import UUID
from app.models.user import UserRole

class UserBase(BaseModel):
    email: EmailStr
    name: str

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: UUID  # <-- Изменено на UUID
    role: UserRole # <-- Добавлена роль
    telegram_id: int | None = None

    class Config:
        from_attributes = True

# НОВОЕ: Схема для выдачи токенов
class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenRefreshRequest(BaseModel):
    refresh_token: str