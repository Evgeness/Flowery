from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import get_db
from app.core import security
from app.crud import user as crud_user
from app.schemas.token import Token
from app.schemas.user import UserCreate, UserResponse, UserLogin

router = APIRouter()

@router.post("/register", response_model=UserResponse)
async def register(user_in: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await crud_user.get_user_by_email(db, email=user_in.email)
    if user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return await crud_user.create_user(db, user_in)

# 1.ЭНДПОИНТ (JSON)
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
