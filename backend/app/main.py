from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import auth, plants
from app.db.base import Base
from app.db.session import engine

from app.models.user import User
from app.models.plant import Plant, UserPlant
from app.core.minio_client import init_minio

app = FastAPI(title=settings.PROJECT_NAME)

# --- НАСТРОЙКА CORS (ОЧЕНЬ ВАЖНО!) ---
# Разрешаем фронтенду делать запросы к бэкенду
origins = [
    "http://localhost",
    "http://localhost:80",
    "http://localhost:5173", # Для локальной разработки без Docker (npm run dev)
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,       # Разрешаем этим адресам
    allow_credentials=True,      # Разрешаем передавать куки и заголовки авторизации
    allow_methods=["*"],         # Разрешаем любые HTTP-методы (GET, POST, PUT, DELETE)
    allow_headers=["*"],         # Разрешаем любые заголовки (включая Authorization)
)
# --------------------------------------

@app.on_event("startup")
async def startup():
    # Примечание: Если вы используете Alembic (в Dockerfile), эта строчка не обязательна.
    # Но она не помешает, если таблиц еще нет.
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        init_minio()

# Подключаем роутеры
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])
app.include_router(plants.router, prefix="/api", tags=["Plants"])

@app.get("/")
def read_root():
    return {"message": f"Добро пожаловать в {settings.PROJECT_NAME} API!"}