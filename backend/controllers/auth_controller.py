from sqlalchemy import select 
from fastapi import HTTPException
from models.user_model import User
from passlib.context import CryptContext
from sqlalchemy.ext.asyncio import AsyncSession

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

def getHashedPassword(password:str):
    return pwd_context.hash(password)

def verifyHashedPassword(plain_password,hashed_password):
    return pwd_context.verify(plain_password,hashed_password)

async def register_user(db:AsyncSession,username:str,email:str,password:str):
    result = await  db.execute(select(User).where(User.username == username))
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400,detail="User already exists!")
    hashed_password = getHashedPassword(password)
    user = User(username=username,email=email,hashedPassword=hashed_password)
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user

async def authenticate_user(db: AsyncSession, username: str, password: str):
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalars().first() # fetches first matched user from table
    if not user:
        return False
    if not verifyHashedPassword(password,user.hashedPassword):
        return False
    return user
