import asyncio
from sqlalchemy import select
from backend.db.database import AsyncSessionLocal
from backend.models.log_model import Log

async def test():
    async with AsyncSessionLocal() as db:
        query = await db.execute(select(Log).where(Log.user_id == 1))
        res = query.scalars().all()
        print("Logs:", res)

if __name__ == "__main__":
    asyncio.run(test())