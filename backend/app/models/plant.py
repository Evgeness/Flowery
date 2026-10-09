from sqlalchemy import String, Integer, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
from app.db.base import Base

class Plant(Base):
    __tablename__ = "plants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True)
    description: Mapped[str] = mapped_column(String)
    watering_interval_days: Mapped[int] = mapped_column(Integer)

class UserPlant(Base):
    __tablename__ = "user_plants"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    plant_id: Mapped[int] = mapped_column(ForeignKey("plants.id"))
    custom_name: Mapped[str] = mapped_column(String(100), nullable=True)
    last_watered_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    next_watering_at: Mapped[datetime] = mapped_column(DateTime)

    # Связь с растением (нужна для ответа API)
    plant: Mapped["Plant"] = relationship()