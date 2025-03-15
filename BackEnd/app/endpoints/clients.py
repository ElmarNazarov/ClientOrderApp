from fastapi import APIRouter, Depends, HTTPException
from app.database import get_db
from sqlalchemy.orm import Session
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.clients import create_client, get_clients, get_client_by_id, update_client
from app.schemas import ClientCreate, ClientUpdate, ClientResponse
from typing import List

router = APIRouter()

# Создает нового клиента
@router.post("/", response_model=ClientResponse)
async def create_new_client(client_data: ClientCreate, db: AsyncSession = Depends(get_db)):
    try:
        client = await create_client(db, client_data)
        return client
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

# Возвращает список клиентов с учетом пагинации
@router.get("/", response_model=List[ClientResponse])
async def list_clients(skip: int = 0, limit: int = 20, db: AsyncSession = Depends(get_db)):
    return await get_clients(db, skip, limit)

# Получает одного клиента по ID
@router.get("/{client_id}", response_model=ClientResponse)
async def get_client(client_id: str, db: AsyncSession = Depends(get_db)):
    client = await get_client_by_id(db, client_id)
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    return client

# Обновляет данные клиента
@router.put("/{client_id}", response_model=ClientResponse)
async def update_existing_client(client_id: str, client_data: ClientUpdate, db: AsyncSession = Depends(get_db)):
    client = await update_client(db, client_id, client_data)
    if not client:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    return client