from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, select

from .database import Base, SessionLocal, create_all_tables


class AppSetting(Base):
    __tablename__ = "app_settings"

    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(100), unique=True, nullable=False, index=True)
    value = Column(Integer, nullable=False, default=120)
    updated_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    def __repr__(self):
        return f"<AppSetting(key={self.key}, value={self.value})>"


DEFAULT_SESSION_DURATION_SECONDS = 120
SESSION_DURATION_KEY = "session_duration_seconds"


def initialize_default_settings():
    """Ensure the default app settings exist."""
    db = SessionLocal()
    try:
        existing = db.scalar(select(AppSetting).where(AppSetting.key == SESSION_DURATION_KEY))
        if existing is None:
            db.add(
                AppSetting(
                    key=SESSION_DURATION_KEY,
                    value=DEFAULT_SESSION_DURATION_SECONDS,
                )
            )
            db.commit()
        elif existing.value == 60:
            existing.value = DEFAULT_SESSION_DURATION_SECONDS
            existing.updated_at = datetime.utcnow()
            db.commit()
    finally:
        db.close()


def get_session_duration_seconds() -> int:
    """Return the current speaking timer length in seconds."""
    db = SessionLocal()
    try:
        setting = db.scalar(select(AppSetting).where(AppSetting.key == SESSION_DURATION_KEY))
        if setting is None:
            return DEFAULT_SESSION_DURATION_SECONDS
        return int(setting.value)
    finally:
        db.close()


def set_session_duration_seconds(duration_seconds: int) -> int:
    """Persist the speaking timer length in seconds."""
    if isinstance(duration_seconds, bool) or not isinstance(duration_seconds, int):
        raise ValueError("Duration must be a positive integer")
    if duration_seconds <= 0:
        raise ValueError("Duration must be greater than zero")

    db = SessionLocal()
    try:
        setting = db.scalar(select(AppSetting).where(AppSetting.key == SESSION_DURATION_KEY))
        if setting is None:
            setting = AppSetting(key=SESSION_DURATION_KEY, value=duration_seconds)
            db.add(setting)
        else:
            setting.value = duration_seconds
            setting.updated_at = datetime.utcnow()
        db.commit()
        db.refresh(setting)
        return int(setting.value)
    finally:
        db.close()


create_all_tables()
initialize_default_settings()
