from pydantic import BaseModel

class APIKeyRequest(BaseModel):
    api_key : str

class LoginToken(BaseModel):
    token : str
    username: str

class JWTtoken(BaseModel):
    token: str

class RegenerateAPIKeyRequest(BaseModel):
    token: str
    source_id: int