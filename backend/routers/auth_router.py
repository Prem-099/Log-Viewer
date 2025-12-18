from fastapi import HTTPException,APIRouter,Depends
from utils.create_jwtToken import create_access_token
from controllers.auth_controller import authenticate_user,register_user
from db.database import get_db
from sqlalchemy.ext.asyncio import AsyncSession
from schemas.RegisterUser import RegisterUser
from schemas.LoginUser import LoginUser

router = APIRouter(prefix="/auth/user")

@router.post("/register")
async def register(user:RegisterUser, db:AsyncSession = Depends(get_db)):
    new_user = await register_user(db, user.username,user.email,user.password)
    return {"message" : f"{new_user.username} registered successfully"}

@router.post("/login")
async def login(user: LoginUser,db:AsyncSession = Depends(get_db)):
    user = await authenticate_user(db,user.username,user.password)
    if not user:
        raise HTTPException(status_code=401,detail="Invalid Credentials")
    token = create_access_token({
        "sub": user.username,
        "user_id": user.id
    })
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "username": user.username
    }

  