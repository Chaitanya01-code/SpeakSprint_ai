"""Persisted speech-to-text transcripts."""
import json
from datetime import datetime
from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy import Column, DateTime, ForeignKey, Integer, Text, inspect, select, text
from sqlalchemy.orm import Session

from ..core.database import Base, SessionLocal, engine, get_db
from ..core.security import get_current_user, require_admin, require_user_or_admin
from ..core.speechdb import TextModel
from ..core.topicdb import Topic
from ..core.userdb import User
from ..ai_analysis.service import analyze_transcript


class SpeechTranscript(Base):
    __tablename__ = "speech_transcripts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, index=True)
    transcript = Column(Text, nullable=False)
    duration_seconds = Column(Integer, nullable=False, default=0)
    topic = Column(Text, nullable=True)
    analysis_json = Column(Text, nullable=True)
    evaluation_json = Column(Text, nullable=True)
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
    analysis: Optional[dict] = None
    evaluation: Optional[dict] = None
    learner: Optional[str] = None

    class Config:
        from_attributes = True


def ensure_transcript_analysis_columns():
    """Add analysis columns to databases created before AI results existed."""
    columns = {column["name"] for column in inspect(engine).get_columns("speech_transcripts")}
    with engine.begin() as connection:
        if "analysis_json" not in columns:
            connection.execute(text("ALTER TABLE speech_transcripts ADD COLUMN analysis_json TEXT"))
        if "evaluation_json" not in columns:
            connection.execute(text("ALTER TABLE speech_transcripts ADD COLUMN evaluation_json TEXT"))


def _response(transcript: SpeechTranscript, learner: Optional[str] = None) -> TranscriptResponse:
    return TranscriptResponse(
        id=transcript.id,
        user_id=transcript.user_id,
        transcript=transcript.transcript,
        duration_seconds=transcript.duration_seconds,
        topic=transcript.topic,
        created_at=transcript.created_at,
        analysis=json.loads(transcript.analysis_json) if transcript.analysis_json else None,
        evaluation=json.loads(transcript.evaluation_json) if transcript.evaluation_json else None,
        learner=learner,
    )


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
async def create_transcript(
    payload: TranscriptCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_user_or_admin(payload.user_id, current_user)

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
    topic_record = None
    if transcript.topic:
        topic_record = db.scalar(select(Topic).where(Topic.topic_name == transcript.topic))
    db.commit()
    db.refresh(transcript)

    # Analyze the committed row so the report always belongs to this stored user record.
    analysis, evaluation = analyze_transcript(
        transcript.transcript,
        transcript.duration_seconds,
        transcript.topic,
    )
    transcript.analysis_json = json.dumps(analysis)
    transcript.evaluation_json = json.dumps(evaluation.model_dump() if hasattr(evaluation, "model_dump") else evaluation.dict())
    db.add(Attempt(
        user_id=transcript.user_id,
        topic_id=topic_record.id if topic_record else None,
        score=evaluation.overall_score,
        duration_seconds=max(transcript.duration_seconds, 1),
    ))
    db.commit()
    db.refresh(transcript)
    return _response(transcript)


@router.get("", response_model=List[TranscriptResponse])
async def get_transcripts(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    require_user_or_admin(user_id, current_user)
    user = db.scalar(select(User.id).where(User.id == user_id, User.is_active.is_(True)))
    if user is None:
        raise HTTPException(status_code=404, detail="Active user not found")

    transcripts = db.scalars(
        select(SpeechTranscript)
        .where(SpeechTranscript.user_id == user_id)
        .order_by(SpeechTranscript.created_at.desc())
    ).all()
    return [_response(item) for item in transcripts]


@router.get("/admin", response_model=List[TranscriptResponse])
async def get_all_transcripts_for_admin(
    db: Session = Depends(get_db),
    _admin: User = Depends(require_admin),
):
    """Return every user's transcript and stored AI report for administration."""
    rows = db.execute(
        select(SpeechTranscript, User.username, User.email)
        .join(User, User.id == SpeechTranscript.user_id)
        .order_by(SpeechTranscript.created_at.desc())
    ).all()
    return [_response(item, username or email) for item, username, email in rows]
