from pydantic import BaseModel
from datetime import datetime

class PlantBase(BaseModel):
    name: str
    description: str
    watering_interval_days: int

class PlantResponse(PlantBase):
    id: int

    class Config:
        from_attributes = True

class UserPlantCreate(BaseModel):
    plant_id: int
    custom_name: str | None = None

class UserPlantResponse(BaseModel):
    id: int
    custom_name: str | None
    last_watered_at: datetime
    next_watering_at: datetime
    plant: PlantResponse

    class Config:
        from_attributes = True