from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.endpoints import auth, clients, orders
from app.database import engine, Base
from app.utils.logger import logger
from fastapi.responses import JSONResponse


app = FastAPI()

# Создание таблиц перед запуском
async def create_tables():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.exception_handler(HTTPException)

# Обработчик всех HTTP ошибок (400, 422, 404 ...)
async def http_exception_handler(request: Request, exc: HTTPException):
    logger.warning(f"HTTP Ошибка: {exc.status_code} | {exc.detail} | URL: {request.url} | Метод: {request.method}")

    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

# Обработчик ошибок 500
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Ошибка: {str(exc)} | URL: {request.url} | Метод: {request.method}")

    return JSONResponse(
        status_code=500,
        content={"detail": "Произошла внутренняя ошибка сервера. Попробуйте позже."},
    )

@app.on_event("startup")
async def startup():
    await create_tables()
    logger.info("FastAPI Запущен")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("FastAPI Остановлен")

# СORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ветки Эндпоинтов
app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(clients.router, prefix="/clients", tags=["clients"])
app.include_router(orders.router, prefix="/orders", tags=["orders"])

@app.get("/")
def read_root():
    return {"message": "To Do API"}
