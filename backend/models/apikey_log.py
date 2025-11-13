from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from db.database import Base
from datetime import datetime

class APIKeyLog(Base):
    __tablename__ = "api_key_logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    timestamp = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="api_key_logs")