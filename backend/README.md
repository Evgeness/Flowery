## Структура проекта
```text
backend/
├── alembic/                # Файлы миграций базы данных
├── app/
│   ├── api/                # Слой API
│   │   ├── routes/         # Эндпоинты (auth.py, plants.py)
│   │   └── deps.py         # Зависимости (проверка JWT, ролей Админа/Юзера)
│   ├── core/               # Настройки и безопасность
│   │   ├── config.py       # Чтение .env (Pydantic Settings)
│   │   └── security.py     # Хеширование паролей (bcrypt), создание JWT
│   ├── crud/               # Асинхронные операции с БД (SQLAlchemy 2.0)
│   │   ├── user.py
│   │   └── plant.py
│   ├── db/                 # Подключение к PostgreSQL
│   │   ├── base.py         # Базовый класс Base
│   │   └── session.py      # Асинхронный движок и сессии (asyncpg)
│   ├── models/             # Модели SQLAlchemy (таблицы Users, Plants, UserPlants)
│   ├── schemas/            # Pydantic-схемы (валидация данных)
│   └── main.py             # Точка входа (FastAPI app)
├── db_init/
│   └── seed.sql            # Начальные данные (справочник растений)
├── alembic.ini             # Конфигурация Alembic
├── .env                    # Переменные окружения (не коммитится в Git)
└── requirements.txt        # Зависимости
```
### Запуск
1. Установить зависимости pip install -r requirements.txt
2. Создать пустую базу с именем flowery_db
3. Запустить сервер py -m uvicorn app.main:app --reload --port 8000
4. Наполнить справочник растений
  В проекте есть файл db_init/seed.sql со стартовым набором растений
  Шаги:
  1. Откройте терминал
  2. Перейдите в папку backend
  3. Выполните команду: psql -U postgres -d flowery_db -f db_init/seed.sql
  4. Введите пароль от пользователя
5. Проверка в Swagger
Открыть в браузере: http://127.0.0.1:8000/docs

Порядок действий:
1. Регистрация — POST /api/auth/register
Нажать Try it out → ввести JSON:
json
{
  "email": "test@example.com",
  "name": "Иван",
  "password": "secret123"
}
Нажать Execute. Ожидаемый результат: 200 OK и данные пользователя (без пароля).
2. Логин — POST /api/auth/login
Нажать Try it out → заполнить:
username: test@example.com
password: secret123
Нажать Execute. Скопировать полученный access_token (длинная строка, начинающаяся с eyJ...).
3. Авторизация в Swagger
Нажать зелёную кнопку Authorize (справа сверху страницы).
Вставить токен в поле Value → Authorize → Close.
Теперь все защищённые эндпоинты будут автоматически использовать ваш токен.
4. Справочник растений — GET /api/plants
Нажать Try it out → Execute.
Должен вернуться список растений из seed.sql. Запомнить id нужного растения (например, 1 для Монстеры).
5. Добавить растение себе — POST /api/my-plants
Нажать Try it out → ввести JSON:
json
{
  "plant_id": 1,
  "custom_name": "Моя Монстера"
}
Нажать Execute.
Ожидаемый результат: 200 OK и объект с датами:
last_watered_at — сегодня
next_watering_at — сегодня + N дней (интервал из справочника)
6. Мои растения — GET /api/my-plants
Нажать Try it out → Execute.
Должен вернуться список отслеживаемых растений (главный экран приложения).
7. Удалить растение — DELETE /api/my-plants/{user_plant_id}
Ввести id растения пользователя (из шага 5).
Execute. Ожидаемый результат: сообщение об успешном удалении.
