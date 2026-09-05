"""Database model and API routes for speaking attempts."""
from datetime import datetime
import json
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime, Float, ForeignKey, Integer, select
from sqlalchemy.orm import Session

from ..core.database import Base, get_db
from ..core.security import get_current_user, require_admin, require_user_or_admin
from .transcript import SpeechTranscript
from ..core.topicdb import Topic
from ..core.userdb import User


class Attempt(Base):
    """A completed speaking attempt submitted by a user."""

    __tablename__ = "attempts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    topic_id = Column(Integer, ForeignKey("topics.id"), nullable=True, index=True)
    score = Column(Float, nullable=True)
    duration_seconds = Column(Integer, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False, index=True)


router = APIRouter(prefix="/api/v1/attempts", tags=["attempts"])


class AttemptCreate(BaseModel):
    user_id: int
    topic_id: Optional[int] = None
    score: Optional[float] = Field(default=None, ge=0, le=100)
    duration_seconds: int = Field(gt=0)


class AttemptResponse(BaseModel):
    id: int
    learner: str
    challenge: str
    score: Optional[float]
    duration: str
    date: datetime

    class Config:
        from_attributes = True


def _format_attempt(attempt, learner: Optional[str], challenge: Optional[str]) -> AttemptResponse:
    return AttemptResponse(
        id=attempt.id,
        learner=learner or "Unknown user",
        challenge=challenge or "Unassigned challenge",
        score=attempt.score,
        duration=f"{attempt.duration_seconds} sec",
        date=attempt.created_at,
    )


@router.get("", response_model=List[AttemptResponse])
async def get_attempts(db: Session = Depends(get_db), _admin: User = Depends(require_admin)):
    """Return completed attempts for the admin Attempts table."""
    rows = db.execute(
        select(Attempt, User.username, User.email, Topic.topic_name)
        .join(User, User.id == Attempt.user_id)
        .outerjoin(Topic, Topic.id == Attempt.topic_id)
        .order_by(Attempt.created_at.desc())
    ).all()

    return [
        _format_attempt(attempt, username or email, topic_name)
        for attempt, username, email, topic_name in rows
    ]


@router.get("/leaderboard", response_model=List[AttemptResponse])
async def get_leaderboard(db: Session = Depends(get_db), _user: User = Depends(get_current_user)):
    """Return all evaluated user sessions for the shared leaderboard."""
    rows = db.execute(
        select(SpeechTranscript, User.username, User.email)
        .join(User, User.id == SpeechTranscript.user_id)
        .where(SpeechTranscript.evaluation_json.is_not(None))
        .order_by(SpeechTranscript.created_at.desc())
    ).all()
    results = []
    for transcript, username, email in rows:
        evaluation = json.loads(transcript.evaluation_json)
        results.append(AttemptResponse(
            id=transcript.id,
            learner=username or email,
            challenge=transcript.topic or "Speaking practice",
            score=evaluation.get("overall_score"),
            duration=f"{transcript.duration_seconds} sec",
            date=transcript.created_at,
        ))
    return results


@router.post("", response_model=AttemptResponse, status_code=201)
async def create_attempt(
    payload: AttemptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    """Create a completed speaking attempt."""
    require_user_or_admin(payload.user_id, current_user)

    user = db.scalar(select(User).where(User.id == payload.user_id, User.is_active.is_(True)))
    if not user:
        raise HTTPException(status_code=404, detail="Active user not found")

    topic = None
    if payload.topic_id is not None:
        topic = db.scalar(select(Topic).where(Topic.id == payload.topic_id))
        if not topic:
            raise HTTPException(status_code=404, detail="Topic not found")

    attempt = Attempt(
        user_id=payload.user_id,
        topic_id=payload.topic_id,
        score=payload.score,
        duration_seconds=payload.duration_seconds,
    )
    db.add(attempt)
    db.commit()
    db.refresh(attempt)

    return _format_attempt(attempt, user.username or user.email, topic.topic_name if topic else None)
