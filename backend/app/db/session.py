from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from app.core.config import settings

# Создаем движок (echo=True будет выводить SQL-запросы в консоль, полезно для отладки)
engine = create_async_engine(settings.DATABASE_URL, echo=True)

# Фабрика сессий
AsyncSessionLocal = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Зависимость для FastAPI (будет выдавать сессию на время одного запроса)
async def get_db():
    async with AsyncSessionLocal() as session:
        yield session