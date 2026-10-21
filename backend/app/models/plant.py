from sqlalchemy import String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

class Plant(Base):
    __tablename__ = "plants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(Text) # Лучше Text, если описание длинное
    watering_interval_days: Mapped[int] = mapped_column(Integer)

    # Связь: одно растение из каталога может быть у многих пользователей
    user_plants: Mapped[list["UserPlant"]] = relationship(back_populates="plant")


class UserPlant(Base):
    __tablename__ = "user_plants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    
    # Внешние ключи
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"))
    plant_id: Mapped[int] = mapped_column(ForeignKey("plants.id", ondelete="CASCADE"))
    
    custom_name: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_watered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    next_watering_at: Mapped[datetime] = mapped_column(DateTime)

    # Двусторонние связи (back_populates)
    user: Mapped["User"] = relationship(back_populates="user_plants")
    plant: Mapped["Plant"] = relationship(back_populates="user_plants")