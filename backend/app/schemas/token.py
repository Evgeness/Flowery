from pydantic import BaseModel

class Token(BaseModel):
    """Схема ответа при успешной авторизации."""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenRefreshRequest(BaseModel):
    """Схема запроса для обновления access токена."""
    refresh_token: str