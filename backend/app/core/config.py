from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Flowery API"
    SECRET_KEY: str = "your-super-secret-key-change-me" 
    ALGORITHM: str = "HS256"
    
    # Настройки токенов
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # ЕДИНАЯ СТРОКА ПОДКЛЮЧЕНИЯ К БД (с большой буквы)
    DATABASE_URL: str

    # Разрешаем Pydantic игнорировать любые другие переменные в .env
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # MinIO
    MINIO_ENDPOINT: str = "localhost:9000"
    MINIO_ACCESS_KEY: str = "minioadmin"
    MINIO_SECRET_KEY: str = "minioadmin"
    MINIO_BUCKET_NAME: str = "flowery-images"
    MINIO_SECURE: bool = False

settings = Settings()