"""Persisted speech-to-text transcripts."""
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text, select
from sqlalchemy.orm import Session

from ..core.database import Base, SessionLocal, get_db
from ..core.speechdb import TextModel


class SpeechTranscript(Base):
    __tablename__ = "speech_transcripts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    transcript = Column(Text, nullable=False)
    duration_seconds = Column(Integer, nullable=False, default=0)
    topic = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)


router = APIRouter(prefix="/api/v1/transcripts", tags=["transcripts"])


class TranscriptCreate(BaseModel):
    user_id: int
    transcript: str = Field(min_length=1)
    duration_seconds: int = Field(default=0, ge=0)
    topic: Optional[str] = None


class TranscriptResponse(BaseModel):
    id: int
    user_id: int
    transcript: str
    duration_seconds: int
    topic: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


def sync_transcripts_to_attempts():
    """Create basic attempt records for transcripts saved before attempt tracking."""
    from .attempt import Attempt

    db = SessionLocal()
    try:
        if db.scalar(select(Attempt.id)) is not None:
            return
        for item in db.scalars(select(SpeechTranscript)).all():
            db.add(Attempt(user_id=item.user_id, duration_seconds=max(item.duration_seconds, 1)))
        db.commit()
    finally:
        db.close()


@router.post("", response_model=TranscriptResponse, status_code=201)
async def create_transcript(payload: TranscriptCreate, db: Session = Depends(get_db)):
    from ..core.userdb import User

    user = db.scalar(select(User).where(User.id == payload.user_id, User.is_active.is_(True)))
    if not user:
        raise HTTPException(status_code=404, detail="Active user not found")

    transcript = SpeechTranscript(
        user_id=user.id,
        transcript=payload.transcript.strip(),
        duration_seconds=payload.duration_seconds,
        topic=payload.topic.strip() if payload.topic else None,
    )
    if not transcript.transcript:
        raise HTTPException(status_code=400, detail="Transcript cannot be empty")

    db.add(transcript)
    db.add(
        TextModel(
            title=transcript.topic or "Speaking transcript",
            content=transcript.transcript,
        )
    )
    from .attempt import Attempt
    db.add(Attempt(user_id=user.id, duration_seconds=max(payload.duration_seconds, 1)))
    db.commit()
    db.refresh(transcript)
    return transcript


@router.get("", response_model=List[TranscriptResponse])
async def get_transcripts(user_id: int, db: Session = Depends(get_db)):
    from ..core.userdb import User

    user = db.scalar(select(User.id).where(User.id == user_id, User.is_active.is_(True)))
    if user is None:
        raise HTTPException(status_code=404, detail="Active user not found")

    return db.scalars(
        select(SpeechTranscript)
        .where(SpeechTranscript.user_id == user_id)
        .order_by(SpeechTranscript.created_at.desc())
    ).all()
