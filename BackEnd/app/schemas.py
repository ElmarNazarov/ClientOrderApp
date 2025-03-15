from pydantic import BaseModel, EmailStr, ConfigDict, Field
from datetime import datetime
from enum import Enum
from typing import Optional, List
from datetime import datetime

# USERS
class UserCreate(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: str
    email: EmailStr

    model_config = ConfigDict(from_attributes=True)

# CLIENTS
class ClientBase(BaseModel):
    """Базовая схема клиента (общие поля)"""
    name: str = Field(..., min_length=1, max_length=25, description="Название магазина (от 1 до 25 символов)")
    telegram_group_id: int = Field(..., description="ID группы Telegram (только цифры)")
    initial_balance: int = Field(..., description="Входящий баланс (начальный баланс при создании клиента, только цифры)")
    referrer: Optional[str] = Field(None, max_length=25, description="Кто привел клиента (необязательное поле)")
    region: Optional[str] = Field(None, max_length=25, description="Регион (необязательное поле)")
    phone: Optional[str] = Field(None, max_length=25, description="Телефон клиента (необязательное поле)")
    telegram_owner: Optional[str] = Field(None, max_length=25, description="Telegram владельца (необязательное поле)")

class ClientCreate(ClientBase):
    """Схема для создания нового клиента"""
    pass  # Использует все поля из ClientBase

class ClientUpdate(BaseModel):
    """Схема для обновления данных клиента (без изменяемых полей)"""
    name: Optional[str] = Field(None, min_length=1, max_length=25, description="Название магазина (от 1 до 25 символов)")
    referrer: Optional[str] = Field(None, max_length=25, description="Кто привел клиента (необязательное поле)")
    region: Optional[str] = Field(None, max_length=25, description="Регион (необязательное поле)")
    phone: Optional[str] = Field(None, max_length=25, description="Телефон клиента (необязательное поле)")
    telegram_owner: Optional[str] = Field(None, max_length=25, description="Telegram владельца (необязательное поле)")

class ClientResponse(ClientBase):
    """Схема для ответа API с данными клиента"""
    id: str = Field(..., description="Уникальный ID клиента")
    created_at: datetime = Field(..., description="Дата и время создания клиента")

    model_config = ConfigDict(from_attributes=True)


# ORDERS
class OrderItemCreate(BaseModel):
    supplier: str
    client_id: str
    product_name: str
    country: str
    quantity: int
    price: float

class OrderCreate(BaseModel):
    client_id: str
    items: List[OrderItemCreate]

class OrderUpdate(BaseModel):
    client_id: str
    status: str
    items: List[OrderItemCreate]

class OrderItemResponse(BaseModel):
    id: str
    supplier: str
    product_name: str
    country: str
    quantity: int
    price: float

class OrderResponse(BaseModel):
    id: str 
    order_number: int
    order_date: datetime
    status: str
    client_id: str
    items_count: int
    total_price: float
    items: Optional[List[OrderItemResponse]] = None