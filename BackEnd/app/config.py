import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv(dotenv_path=os.path.join(os.path.dirname(os.path.abspath(__file__)), "../../.env"))

# Основные переменные используемые в FastAPI
class Settings:
    SECRET_KEY: str = os.getenv("SECRET_KEY")
    DATABASE_URL: str = os.getenv("DATABASE_URL")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60))
    IS_TESTING: bool = os.getenv("IS_TESTING", "false").lower() == "true"



print(f"🔍 Loaded DATABASE_URL: {os.getenv('DATABASE_URL')}")
settings = Settings()
