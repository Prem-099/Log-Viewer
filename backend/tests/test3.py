import os 
from dotenv import load_dotenv
from jose import jwt

load_dotenv()

ALGORITHM = os.getenv("ALGORITHM", "HS256")
SECRET_KEY = os.getenv("SECRET_KEY", "supersecret")

# Example token

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJzZGtfdGVzdF91c2VyIiwidXNlcl9pZCI6MSwiZXhwIjoxNzY2MTYwNjMxfQ.6-UyGzU-HyDzYsWIuFG-Yp2-rUyz-EyCw-VWyez4ZGc"
payload = jwt.decode(token,SECRET_KEY, algorithms=[ALGORITHM])
print("Decoded token: ", payload)