from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.schemas import OrderCreate, OrderResponse, OrderUpdate
from app.crud.orders import create_order, get_orders, get_order_by_id, update_order

router = APIRouter()

# Создает новый заказ
@router.post("/", response_model=OrderResponse)
async def create_new_order(order_data: OrderCreate, db: AsyncSession = Depends(get_db)):
    return await create_order(db, order_data)

# Возвращает список заказов с учетом пагинации
@router.get("/", response_model=list[OrderResponse])
async def list_orders(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_db)):
    return await get_orders(db, skip, limit)

# Обновляет существующий заказ по его ID
@router.put("/{order_id}", response_model=OrderResponse)
async def modify_order(order_id: str , order_data: OrderUpdate, db: AsyncSession = Depends(get_db)):
    return await update_order(db, order_id, order_data)