# 🌿 Flowery Backend

Серверная часть приложения Flowery. Представляет собой асинхронный REST API на FastAPI с работой с базой данных PostgreSQL и объектным хранилищем MinIO.

## 📂 Структура проекта
```text
backend/
├── alembic/                # Файлы миграций базы данных
├── app/
│   ├── api/                # Слой API
│   │   ├── routes/         # Эндпоинты (auth.py, plants.py)
│   │   └── deps.py         # Зависимости (проверка JWT, ролей Админа/Юзера)
│   ├── core/               # Настройки и безопасность
│   │   ├── config.py       # Чтение .env (Pydantic Settings)
│   │   ├── security.py     # Хеширование паролей (bcrypt), создание JWT
│   │   └── minio_client.py # Клиент для работы с хранилищем MinIO
│   ├── crud/               # Асинхронные операции с БД (SQLAlchemy 2.0)
│   │   ├── user.py
│   │   └── plant.py
│   ├── db/                 # Подключение к PostgreSQL
│   │   ├── base.py         # Базовый класс Base
│   │   └── session.py      # Асинхронный движок и сессии (asyncpg)
│   ├── models/             # Модели SQLAlchemy (таблицы Users, Plants, UserPlants)
│   ├── schemas/            # Pydantic-схемы (валидация данных)
│   └── main.py             # Точка входа (FastAPI app, CORS, запуск MinIO)
├── db_init/
│   └── seed.sql            # Начальные данные (справочник растений)
├── alembic.ini             # Конфигурация Alembic
├── .env                    # Переменные окружения (не коммитится в Git)
└── requirements.txt        # Зависимости