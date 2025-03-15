from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

# Используйте PostgreSQL, если не проводите тестирование, в противном случае используйте SQLite
if settings.IS_TESTING:
    DATABASE_URL = "sqlite+aiosqlite:///./test.db"  # SQLite
else:
    DATABASE_URL = settings.DATABASE_URL  # PostgreSQL

engine = create_async_engine(DATABASE_URL, echo=True)

AsyncSessionLocal = sessionmaker(
    bind=engine, class_=AsyncSession, expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
