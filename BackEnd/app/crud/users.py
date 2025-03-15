from sqlalchemy.ext.asyncio import AsyncSession
from app.models import User
from sqlalchemy.future import select

# Получить пользователя по ID (асинхронно)
async def get_user_by_id(db: AsyncSession, user_id: str):
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalars().first()
