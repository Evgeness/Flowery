from pydantic import BaseModel, EmailStr

# Общие поля
class UserBase(BaseModel):
    email: EmailStr
    name: str

# Схема для регистрации (что присылает фронтенд)
class UserCreate(UserBase):
    password: str

# Схема для ответа (что мы отдаем фронтенду)
class UserResponse(UserBase):
    id: int
    telegram_id: int | None = None

    class Config:
        from_attributes = True # Позволяет Pydantic читать данные из SQLAlchemy моделей