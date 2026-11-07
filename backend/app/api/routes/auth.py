from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from jose import jwt, JWTError

from app.db.session import get_db
from app.core import security
from app.core.config import settings
from app.crud import user as crud_user
from app.schemas.token import Token, TokenRefreshRequest
from app.schemas.user import UserCreate, UserResponse, UserLogin
from app.api import deps
from app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await crud_user.create_user(db, user_in)

# 1. ЭНДПОИНТ (JSON)
@router.post("/login", response_model=Token)
async def login_json(
    user_in: UserLogin, 
    db: AsyncSession = Depends(get_db)
):
    user = await crud_user.authenticate(db, email=user_in.email, password=user_in.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    elif not user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    
    return {
        "access_token": security.create_access_token(user.id),
        "refresh_token": security.create_refresh_token(user.id),
        "token_type": "bearer",
    }

# 2. ПУНКТ 3: ОБНОВЛЕНИЕ ACCESS-ТОКЕНА
@router.post("/refresh", response_model=Token)
async def refresh_access_token(
    token_in: TokenRefreshRequest,
    db: AsyncSession = Depends(get_db)
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate refresh token",
    )
    try:
        # Расшифровываем Refresh-токен
        payload = jwt.decode(
            token_in.refresh_token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        # Проверяем, что это именно refresh-токен, а не access
        if payload.get("type") != "refresh":
            raise credentials_exception
        
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
    except JWTError:
        raise credentials_exception

    # Ищем пользователя в БД
    user = await crud_user.get_user_by_id(db, user_id=user_id)
    if user is None:
        raise credentials_exception

    # Выдаем новые токены
    return {
        "access_token": security.create_access_token(user.id),
        "refresh_token": security.create_refresh_token(user.id),
        "token_type": "bearer",
    }

# 3. ПУНКТ 4: ПОЛУЧЕНИЕ ТЕКУЩЕГО ПОЛЬЗОВАТЕЛЯ (Защищенный маршрут)
@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(deps.get_current_user)):
    """
    Возвращает данные текущего пользователя.
    Благодаря зависимости get_current_user, этот роут доступен только с валидным Access-токеном.
    """
    return current_user

# 4. ПУНКТ 5: ВЫХОД ИЗ СИСТЕМЫ
@router.post("/logout")
async def logout():
    """
    Выход из системы.
    Так как мы используем JWT (stateless), серверу не нужно удалять сессию.
    Клиент (React) должен сам удалить токены из localStorage.
    """
    return {"message": "Successfully logged out. Please clear tokens on client side."}