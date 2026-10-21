from sqlalchemy import String, BigInteger, Enum, Boolean # <-- Добавьте Boolean в импорт
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
import uuid
import enum
from app.db.base import Base

class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"

class User(Base):
    __tablename__ = "users"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    name: Mapped[str] = mapped_column(String(100))
    role: Mapped[UserRole] = mapped_column(Enum(UserRole), default=UserRole.USER)
    
    # НОВОЕ ПОЛЕ:
    is_active: Mapped[bool] = mapped_column(Boolean, default=True) 
    
    telegram_id: Mapped[int | None] = mapped_column(BigInteger, unique=True, nullable=True)

    user_plants: Mapped[list["UserPlant"]] = relationship(back_populates="user", cascade="all, delete-orphan")