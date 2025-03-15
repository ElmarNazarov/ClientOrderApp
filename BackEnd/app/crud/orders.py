from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import joinedload
from app.models import Order, OrderItem
from app.utils.id import generate_unique_number_id, generate_unique_id
from app.schemas import OrderCreate, OrderUpdate
from fastapi import HTTPException
from sqlalchemy import delete
from app.utils.logger import logger

# Создает новый заказ
async def create_order(db: AsyncSession, order_data: OrderCreate):
    logger.info(f"Попытка создания нового заказа для клиента: {order_data.client_id}")

    order_id = await generate_unique_id(db, "orders")  # Создает ID
    order_number = await generate_unique_number_id(db, "orders")  # Создает численный номер заказа

    new_order = Order(
        id=order_id,
        order_number=order_number,
        client_id=order_data.client_id,
        items_count=len(order_data.items),
        total_price=sum(item.price * item.quantity for item in order_data.items),
    )

    db.add(new_order)
    await db.commit()
    await db.refresh(new_order)

    logger.info(f"Заказ {new_order.order_number} создан успешно (ID: {new_order.id})")

    for item in order_data.items:
        item_id = await generate_unique_id(db, "order_items") # Генерация ID товара
        new_item = OrderItem(
            id=item_id,
            order_id=new_order.id,
            supplier=item.supplier,
            client_id=item.client_id,
            product_name=item.product_name,
            country=item.country,
            quantity=item.quantity,
            price=item.price,
        )
        db.add(new_item)

    await db.commit()
    logger.info(f"Товары для заказа {new_order.order_number} добавлены")

    return {
        "id": new_order.id,
        "order_number": new_order.order_number,
        "order_date": new_order.order_date.isoformat(),
        "status": new_order.status,
        "client_id": new_order.client_id,
        "items_count": new_order.items_count,
        "total_price": new_order.total_price,
    }

# Получает список заказов
async def get_orders(db: AsyncSession, skip: int = 0, limit: int = 50):
    logger.info(f"Запрос на получение заказов: offset={skip}, limit={limit}")

    result = await db.execute(
        select(Order)
        .options(joinedload(Order.items))
        .offset(skip)
        .limit(limit)
    )
    orders = result.unique().scalars().all()

    logger.info(f"Получено заказов: {len(orders)}")

    return [
        {
            **order.__dict__, 
            "order_date": order.order_date.isoformat()
        }
        for order in orders
    ]

# Получает заказ по ID
async def get_order_by_id(db: AsyncSession, order_id: int):
    logger.info(f"Запрос на получение заказа с ID: {order_id}")

    result = await db.execute(
        select(Order)
        .options(joinedload(Order.items))
        .filter(Order.id == order_id)
    )
    order = result.unique().scalars().first()

    if not order:
        logger.warning(f"Заказ с ID {order_id} не найден")
        raise HTTPException(status_code=404, detail="Order not found")

    return {
        **order.__dict__,
        "order_date": order.order_date.isoformat()
    }

# Обновляет существующий заказ
async def update_order(db: AsyncSession, order_id: str, order_data: OrderUpdate):
    logger.info(f"Попытка обновления заказа с ID: {order_id}")

    result = await db.execute(select(Order).filter(Order.id == order_id).options(joinedload(Order.items)))
    order = result.scalars().first()

    if not order:
        logger.warning(f"Обновление не выполнено: заказ с ID {order_id} не найден")
        raise HTTPException(status_code=404, detail="Order not found")

    order.client_id = order_data.client_id
    order.status = order_data.status
    order.items_count = len(order_data.items)
    order.total_price = sum(item.price * item.quantity for item in order_data.items)

    # Удаление существующих товаров в заказе
    await db.execute(delete(OrderItem).where(OrderItem.order_id == order.id))

    logger.info(f"Заказ {order.order_number} (ID: {order.id}) успешно обновлен")

    # Добавление новых товаров
    for item in order_data.items:
        item_id = await generate_unique_id(db, "order_items")
        new_item = OrderItem(
            id=item_id,
            order_id=order.id,
            supplier=item.supplier,
            client_id=order_data.client_id,
            product_name=item.product_name,
            country=item.country,
            quantity=item.quantity,
            price=item.price,
        )
        db.add(new_item)

    await db.commit()
    await db.refresh(order)
    return order