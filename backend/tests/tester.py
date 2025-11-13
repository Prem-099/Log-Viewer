import os
from jose import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta

load_dotenv()

SECRET = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

payload = {
        "sub": "job-sniper-backend",
        "user_id" : 50,
        "source_id": 1,
        "type" : "sdk",
        "exp": datetime.utcnow() + timedelta(days=365)
    }

token = jwt.encode(payload, SECRET, algorithm=ALGORITHM)
print(token)