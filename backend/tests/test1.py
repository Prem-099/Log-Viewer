import os 
import sys
import asyncio
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from backend.sdk.config.logger import DistributedLogger


 
SDK_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJqb2Itc25pcGVyLWJhY2tlbmQiLCJ1c2VyX2lkIjo1MCwic291cmNlX2lkIjoxLCJ0eXBlIjoic2RrIiwiZXhwIjoxNzkzNjg2MzQ1fQ.0yqZ1XcjujOv_m160jTP9G38_i6t1qiZs2TtWkZxswE"  # fake example
SOURCE_NAME = "job-sniper-backend"            # your app/microservice name
WS_URL = "ws://127.0.0.1:8000/logs/ws"        # your FastAPI WebSocket endpoint


async def main():
    logger = DistributedLogger(
        sdk_token=SDK_TOKEN,
        source_name=SOURCE_NAME,
        ws_url=WS_URL
    )

    logger.info("Server started successfully.")
    logger.debug("Fetching data from API...")
    logger.warn("Response time is high (2.3s)")
    logger.error("Database connection failed!")

    await asyncio.sleep(6)
    await logger.close()

if __name__ == "__main__":
    asyncio.run(main())
