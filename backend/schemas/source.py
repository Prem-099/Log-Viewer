from pydantic import BaseModel
from datetime import datetime

class SourceCreate(BaseModel):
    name:str
    token:str

class SourceOut(BaseModel):
    id:int
    name:str
    created_at : datetime

    class Config:
        orm_mode = True

class SourceDelete(BaseModel):
    source_id : int
    token: str