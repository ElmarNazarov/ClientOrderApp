from loguru import logger
import os

LOG_DIR = "LOGS"
if not os.path.exists(LOG_DIR):
    os.makedirs(LOG_DIR)

logger.remove()
logger.add(os.path.join(LOG_DIR, "info.log"),
            level="INFO",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message}",
            rotation="10 MB",
            compression="zip",
            enqueue=True
        )

logger.add(os.path.join(LOG_DIR, "error.log"),
            level="ERROR",
            format="{time:YYYY-MM-DD HH:mm:ss} | {level} | {message} | {exception}",
            rotation="10 MB",
            compression="zip",
            enqueue=True
        )

def log_info(message: str):
    logger.info(message)

def log_error(message: str):
    logger.error(message)
