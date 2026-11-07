# backend/app/core/minio_client.py
import json
from minio import Minio
from app.core.config import settings

minio_client = Minio(
    endpoint=settings.MINIO_ENDPOINT,
    access_key=settings.MINIO_ACCESS_KEY,
    secret_key=settings.MINIO_SECRET_KEY,
    secure=settings.MINIO_SECURE,
)

def init_minio():
    """Создает бакет и ставит публичную политику (если их нет)."""
    bucket_name = settings.MINIO_BUCKET_NAME
    
    if not minio_client.bucket_exists(bucket_name):
        minio_client.make_bucket(bucket_name)
        print(f"✅ Бакет '{bucket_name}' создан.")
        
        # Разрешаем всем читать файлы (иначе картинки не загрузятся на сайте)
        policy = {
            "Version": "2012-10-17",
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {"AWS": "*"},
                    "Action": ["s3:GetObject"],
                    "Resource": [f"arn:aws:s3:::{bucket_name}/*"],
                }
            ],
        }
        minio_client.set_bucket_policy(bucket_name, json.dumps(policy))
        print(f"✅ Публичный доступ к '{bucket_name}' настроен.")