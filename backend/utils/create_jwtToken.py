from passlib.context import CryptContext
from datetime import datetime,timedelta
from dotenv import load_dotenv
from jose import jwt 
import os

load_dotenv()

ALGORITHM = os.getenv("ALGORITHM")
SECRET_KEY  = os.getenv("SECRET_KEY", "super_key")

pwd_context = CryptContext(schemes=["bcrypt"], deprecated = "auto")

def create_access_token(data:dict,expires:int = 30):
    """
    For login purpose.
    Create a JWT access token.
    data: a dict containing 'sub' : username (hardcoded at routers/auth_router)
    expires: minutes until the token expires (default: 30 minutes)
    """
    to_encode = data.copy()
    expire = datetime.utcnow()+timedelta(minutes=expires)
    to_encode.update({"exp" : expire }) #{"sub": username,"user_id":user_id,"exp": expires}
    token = jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)

    return token

def create_sdk_token(user_id:int, source_id: int, source_name: str, expire_hours: int = 1):
    """
    Creating a short lived JWT for SDK use
    """
    payload = {
        "sub": source_name,
        "user_id" : user_id,
        "source_id": source_id,
        "type" : "sdk"
    }
    expire_time = datetime.utcnow() + timedelta(hours=expire_hours)
    payload.update({"exp":expire_time})
    return jwt.encode(payload, SECRET_KEY,algorithm=ALGORITHM)




