from sqlalchemy.ext.asyncio import AsyncSession
from fastapi import HTTPException
from app.models import User
from app.utils.security import get_password_hash, verify_password, create_access_token
from typing import List
from sqlalchemy.future import select
from app.utils.id import generate_unique_id
from app.utils.logger import logger

# Регистрация пользователя
async def register_user(db: AsyncSession, email: str, password: str) -> User:
    logger.info(f"Попытка регистрации пользователя с email: {email}")

    result = await db.execute(select(User).filter(User.email == email))
    existing_user = result.scalars().first()

    if existing_user:
        logger.warning(f"Регистрация не удалась: Email уже зарегистрирован ({email})")
        raise HTTPException(status_code=400, detail="Адрес электронной почты уже зарегистрирован")

    hashed_password = await get_password_hash(password)
    new_user = User(
        id=await generate_unique_id(db, "users"),
        email=email,
        hashed_password=hashed_password
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    logger.info(f"Пользователь успешно зарегистрирован (ID: {new_user.id})")
    return new_user

# Логин пользователя
async def login_user(db: AsyncSession, email: str, password: str) -> dict:
    logger.info(f"Попытка входа пользователя: {email}")

    result = await db.execute(select(User).filter(User.email == email))
    user = result.scalars().first()

    if not user or not await verify_password(password, user.hashed_password):
        logger.warning(f"Неудачная попытка входа для email: {email}")
        raise HTTPException(status_code=400, detail="Неверные учетные данные")

    access_token = await create_access_token({"id": user.id, "sub": user.email})

    logger.info(f"Пользователь успешно вошел в систему: {email}")
    return {"access_token": access_token, "token_type": "bearer"}


# Получить всех пользователей из базы данных
async def get_all_users(db: AsyncSession) -> List[User]:
    result = await db.execute(select(User))
    return result.scalars().all()