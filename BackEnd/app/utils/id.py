import uuid, random
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.sql import text

# Создание уникальных ID для баз данных
async def generate_unique_id(db: AsyncSession, table_name: str, id_length: int = 10) -> str:
    while True:
        new_id = uuid.uuid4().hex[:id_length]
        query = text(f"SELECT id FROM {table_name} WHERE id = :id")
        result = await db.execute(query, {"id": new_id})
        existing_id = result.scalar()

        if not existing_id:
            return new_id
        
async def generate_unique_number_id(db, table_name: str):
    while True:
        unique_id = str(random.randint(10000000, 99999999))
        query = text(f"SELECT 1 FROM {table_name} WHERE order_number = '{unique_id}'")
        result = await db.execute(query)
        if not result.fetchone():
            return unique_id