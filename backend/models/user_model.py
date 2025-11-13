from db.database import Base
from sqlalchemy import Column,String,Integer,DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship

class User(Base):
    __tablename__ = "users"

    id = Column(Integer,primary_key=True,index=True)
    username = Column(String,unique=True,index=True,nullable=False)
    hashedPassword = Column(String,nullable=False)
    email = Column(String,unique=True,nullable=False)
    createdAt = Column(DateTime(timezone=True),server_default=func.now())

    sources = relationship("Source", back_populates="user")
    logs = relationship("Log", back_populates="user", cascade="all, delete")
    api_key_logs = relationship("APIKeyLog", back_populates="user")
