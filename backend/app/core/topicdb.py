from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime
from .database import Base


class Topic(Base):
    __tablename__ = "topics"

    id = Column(Integer, primary_key=True, index=True)
    topic_name = Column(String(255), unique=True, nullable=False, index=True)
    description = Column(String(1000), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<Topic(id={self.id}, topic_name={self.topic_name})>"
