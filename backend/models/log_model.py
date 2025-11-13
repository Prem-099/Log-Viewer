from sqlalchemy import Column, String, Integer, DateTime, func, ForeignKey
from db.database import Base
from sqlalchemy.orm import relationship

class Log(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index = True)
    source = Column(String, nullable=False)
    level = Column(String, nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())

    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    source_id = Column(Integer, ForeignKey("sources.id", ondelete="CASCADE"), nullable=False)

    # ORM relationships
    user = relationship("User", back_populates="logs")
    source_rel = relationship("Source", back_populates="logs")