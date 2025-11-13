from datetime import datetime,timedelta
from db.database import Base
from sqlalchemy import Column,String,Integer,ForeignKey,DateTime
from sqlalchemy.orm import relationship

class Source(Base):

    __tablename__ = "sources"

    id = Column(Integer, primary_key=True ,index=True)
    name = Column(String(50),nullable=False)
    api_key_hash = Column(String(128),nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"),nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="sources")
    logs = relationship("Log", back_populates="source_rel", cascade="all, delete")
