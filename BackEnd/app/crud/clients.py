from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.exc import IntegrityError
from fastapi import HTTPException
from app.models import *
from app.schemas import *
from app.utils.id import generate_unique_id
from typing import List
from app.utils.logger import logger

# Создает нового клиента и сохраняет в базе данных
async def create_client(db: AsyncSession, client_data: ClientCreate):
    logger.info(f"Попытка создания нового клиента: {client_data.name}")

    new_client = Client(
        id=await generate_unique_id(db, "clients"),
        name=client_data.name,
        telegram_group_id=client_data.telegram_group_id,
        initial_balance=client_data.initial_balance,
        referrer=client_data.referrer,
        region=client_data.region,
        phone=client_data.phone,
        telegram_owner=client_data.telegram_owner
    )

    try:
        db.add(new_client)
        await db.commit()
        await db.refresh(new_client)

        logger.info(f"Клиент успешно создан: ID {new_client.id}, Имя: {new_client.name}")
        return new_client
    except IntegrityError:
        await db.rollback()

        logger.warning(f"Ошибка создания клиента: Telegram ID уже существует ({client_data.telegram_group_id})")
        raise ValueError("Клиент с таким Telegram ID уже существует.")

# Возвращает список клиентов с учетом пагинации
async def get_clients(db: AsyncSession, skip: int = 0, limit: int = 20):
    result = await db.execute(select(Client).offset(skip).limit(limit))
    return result.scalars().all()

# Получает одного клиента по ID
async def get_client_by_id(db: AsyncSession, client_id: str):
    return await db.get(Client, client_id)

# Обновляет данные клиента
async def update_client(db: AsyncSession, client_id: str, client_data: ClientUpdate):
    logger.info(f"Попытка обновления клиента с ID: {client_id}")

    client = await get_client_by_id(db, client_id)
    if not client:
        logger.warning(f"Обновление не выполнено: клиент с ID {client_id} не найден")
        return None

    update_data = client_data.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(client, key, value)

    await db.commit()
    await db.refresh(client)

    logger.info(f"Клиент обновлен: ID {client_id}, измененные поля: {list(update_data.keys())}")
    return client