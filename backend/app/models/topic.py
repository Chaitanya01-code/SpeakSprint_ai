from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session
from datetime import datetime
from typing import Optional, List

# Import database components
from ..core.topicdb import Topic
from ..core.database import get_db

# Create router
router = APIRouter(prefix="/api/v1", tags=["topics"])


# Pydantic schemas
class TopicBase(BaseModel):
    topic_name: str
    description: Optional[str] = None


class TopicCreate(TopicBase):
    pass


class TopicResponse(TopicBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True


# API Routes
@router.get("/topics", response_model=List[TopicResponse])
async def get_topics(db: Session = Depends(get_db)):
    """Get all topics"""
    topics = db.scalars(select(Topic)).all()
    return topics


@router.get("/topics/{topic_id}", response_model=TopicResponse)
async def get_topic(topic_id: int, db: Session = Depends(get_db)):
    """Get a specific topic by ID"""
    topic = db.scalar(select(Topic).where(Topic.id == topic_id))
    if not topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    return topic


@router.post("/topics", response_model=TopicResponse)
async def create_topic(new_topic: TopicCreate, db: Session = Depends(get_db)):
    """Create a new topic"""
    db_topic = Topic(topic_name=new_topic.topic_name, description=new_topic.description)
    db.add(db_topic)
    try:
        db.commit()
        db.refresh(db_topic)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Topic already exists")
    return db_topic


@router.put("/topics/{topic_id}", response_model=TopicResponse)
async def update_topic(topic_id: int, updated_topic: TopicCreate, db: Session = Depends(get_db)):
    """Update an existing topic"""
    db_topic = db.scalar(select(Topic).where(Topic.id == topic_id))
    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    db_topic.topic_name = updated_topic.topic_name
    db_topic.description = updated_topic.description
    
    try:
        db.commit()
        db.refresh(db_topic)
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Topic name already exists")
    return db_topic


@router.delete("/topics/{topic_id}", status_code=204)
async def delete_topic(topic_id: int, db: Session = Depends(get_db)):
    """Delete a topic"""
    db_topic = db.scalar(select(Topic).where(Topic.id == topic_id))
    if not db_topic:
        raise HTTPException(status_code=404, detail="Topic not found")
    
    db.delete(db_topic)
    db.commit()
    return None