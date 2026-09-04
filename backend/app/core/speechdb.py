"""Text model for database."""
from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Text
from .database import Base


class TextModel(Base):
    """Text/Content model."""
    __tablename__ = "texts"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False, index=True)
    content = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<TextModel(id={self.id}, title={self.title})>"
