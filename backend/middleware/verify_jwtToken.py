import os
from dotenv import load_dotenv
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import OAuth2PasswordBearer
from datetime import datetime, timezone

load_dotenv()

ALGORITHM = os.getenv("ALGORITHM", "HS256")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/user/login")

async def verify_jwt(token: str = Depends(oauth2_scheme)):
    """
    Verify JWT token (works for both user and SDK).
    Returns the entire payload instead of only user_id.
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        exp = payload.get("exp")
        user_id = payload.get("user_id")
        if not user_id:
            raise HTTPException(status_code=401, detail="Missing user ID in token")
        if not exp:
            raise HTTPException(status_code=401, detail="Missing exp in token")

        if datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Token has expired")

        print("decoded payload : " , payload)
        return payload

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

async def verify(token: str):
    """
    Used for only regeneration route
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])

        exp = payload.get("exp")
        user_id = payload.get("user_id")
        name = payload.get("sub")

        if not user_id or not exp or not name:
            raise HTTPException(status_code=401, detail="Token Malformed!")
        if datetime.fromtimestamp(exp, tz=timezone.utc) < datetime.now(timezone.utc):
            raise HTTPException(status_code=401, detail="Token has expired")

        
        print("decoded payload : " , payload)
        return payload

    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    