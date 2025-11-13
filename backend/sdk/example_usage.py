from distributed_logger import DistributedLogger
from dotenv import load_dotenv
import os

load_dotenv()

SOURCE_NAME = "EXAMPLE"
API_KEY = os.getenv("API_KEY") or "your-api-key-here"

logger = DistributedLogger(api_key=API_KEY, source_name=SOURCE_NAME)

# Example usage
logger.info("Application started successfully.")
logger.warning("Cache miss detected.")
logger.error("Database timeout.")
logger.debug("Debug log message here.")
