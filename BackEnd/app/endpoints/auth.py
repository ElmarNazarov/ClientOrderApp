from fastapi import APIRouter, Depends, status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.crud.auth import *
from app.schemas import UserCreate, UserResponse
from app.utils.security import get_current_user
from app.crud.users import get_user_by_id
from typing import List

router = APIRouter()

# Эндпоинт для регистрации пользователя (асинхронно)
@router.post("/register")
async def register(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    user = await register_user(db, user_data.email, user_data.password)
    access_token = await create_access_token({"id": user.id, "sub": user.email})
    return {"access_token": access_token, "user": user}

# Эндпоинт для логина пользователя (асинхронно)
@router.post("/login")
async def login(user_data: UserCreate, db: AsyncSession = Depends(get_db)):
    return await login_user(db, user_data.email, user_data.password)

# Получение всех пользователей (асинхронно)
@router.get("/users", response_model=List[UserResponse])
async def get_users(db: AsyncSession = Depends(get_db)):
    return await get_all_users(db)

# Получение информации о пользователе, если он залогинен
@router.get("/if_user", response_model=UserResponse)
async def get_user_info(current_user: dict = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user = await get_user_by_id(db, current_user["id"])
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Пользователь не найден")
    return user