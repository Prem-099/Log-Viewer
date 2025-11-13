import os
import asyncio
from dotenv import load_dotenv
from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_async_engine(DATABASE_URL)

async def drop():
    async with engine.begin() as conn :
        await conn.execute(text("DROP TABLE IF EXISTS UserTable CASCADE;"))
        print("users table deleted")

asyncio.run(drop())