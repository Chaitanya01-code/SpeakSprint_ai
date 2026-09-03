from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.settingsdb import AppSetting, get_session_duration_seconds, set_session_duration_seconds

router = APIRouter(prefix="/api/v1/settings", tags=["settings"])


class SessionDurationRequest(BaseModel):
    session_duration_seconds: int


class SessionDurationResponse(BaseModel):
    session_duration_seconds: int

    class Config:
        from_attributes = True


@router.get("/session-duration", response_model=SessionDurationResponse)
async def get_session_duration(db: Session = Depends(get_db)):
    return {"session_duration_seconds": get_session_duration_seconds()}


@router.put("/session-duration", response_model=SessionDurationResponse)
async def update_session_duration(payload: SessionDurationRequest, db: Session = Depends(get_db)):
    if payload.session_duration_seconds <= 0:
        raise HTTPException(status_code=400, detail="Timer must be greater than zero")
    value = set_session_duration_seconds(payload.session_duration_seconds)
    return {"session_duration_seconds": value}
