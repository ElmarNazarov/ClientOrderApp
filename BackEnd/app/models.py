import datetime
import enum

from app.database import Base
from app.utils.id import generate_unique_id
from sqlalchemy import Column, Integer, String, DateTime, func, Enum, ForeignKey, Float
from sqlalchemy.orm import Session, relationship
from sqlalchemy.ext.asyncio import AsyncSession


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    @classmethod
    async def create(cls, db: Session, email: str, hashed_password: str):
        new_user = cls(
            id=await generate_unique_id(db, "users"),
            email=email,
            hashed_password=hashed_password,
            created_at=datetime.datetime.utcnow(),
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

class Client(Base):
    __tablename__ = "clients"

    id = Column(String(25), primary_key=True, unique=True, index=True)
    name = Column(String(25), nullable=False)
    telegram_group_id = Column(Integer, nullable=False, unique=True)
    initial_balance = Column(Integer, nullable=False)
    referrer = Column(String(25), nullable=True)
    region = Column(String(25), nullable=True)
    phone = Column(String(25), nullable=True)
    telegram_owner = Column(String(25), nullable=True)
    created_at = Column(DateTime, default=func.now())

    @classmethod
    async def create(cls, db: Session, name: str, telegram_group_id: int, initial_balance: int, referrer: str = None, region: str = None, phone: str = None, telegram_owner: str = None):
        new_client = cls(
            id=await generate_unique_id(db, "clients"),
            name=name,
            telegram_group_id=telegram_group_id,
            initial_balance=initial_balance,
            referrer=referrer,
            region=region,
            phone=phone,
            telegram_owner=telegram_owner
        )
        db.add(new_client)
        db.commit()
        db.refresh(new_client)
        return new_client
    

# ЗАКАЗЫ
class OrderStatus(enum.Enum):
    not_collected = "not_collected"
    ready_for_pickup = "ready_for_pickup"
    shipped = "shipped"

class Order(Base):
    __tablename__ = "orders"

    id = Column(String, primary_key=True, unique=True, index=True)
    order_number = Column(String, unique=True, index=True)
    order_date = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(Enum(OrderStatus, name="orderstatus_enum"), default=OrderStatus.not_collected)
    client_id = Column(String, ForeignKey("clients.id"))
    items_count = Column(Integer)
    total_price = Column(Float)

    items = relationship("OrderItem", back_populates="order")

class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(String, primary_key=True, unique=True, index=True)
    order_id = Column(String, ForeignKey("orders.id"))
    supplier = Column(String, nullable=True)
    client_id = Column(String, ForeignKey("clients.id"))
    product_name = Column(String, nullable=False)
    country = Column(Enum("EU", "US", "CN", "RU", name="orderitem_country_enum"), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Float, nullable=False)

    order = relationship("Order", back_populates="items")