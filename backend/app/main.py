from fastapi import FastAPI
from app.core.config import settings
from app.api.routes import auth, plants  # <-- ОБЯЗАТЕЛЬНО импортируем plants
from app.db.base import Base
from app.db.session import engine

from app.models.user import User
from app.models.plant import Plant, UserPlant

app = FastAPI(title=settings.PROJECT_NAME)

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

# Подключаем роутеры
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(plants.router, prefix="/api", tags=["Plants"]) # <-- ЭТА СТРОКА ДОЛЖНА БЫТЬ

@app.get("/")
def read_root():
    return {"message": f"Добро пожаловать в {settings.PROJECT_NAME} API!"}