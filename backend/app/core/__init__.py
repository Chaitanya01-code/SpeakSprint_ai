"""Core application package."""
from .database import Base, get_db, SessionLocal, create_all_tables
from .userdb import User, initialize_admin_user
from .topicdb import Topic
from .speechdb import TextModel
from .settingsdb import (
    AppSetting,
    DEFAULT_SESSION_DURATION_SECONDS,
    SESSION_DURATION_KEY,
    get_session_duration_seconds,
    initialize_default_settings,
    set_session_duration_seconds,
)

__all__ = [
    "Base",
    "get_db",
    "SessionLocal",
    "create_all_tables",
    "User",
    "initialize_admin_user",
    "Topic",
    "TextModel",
    "AppSetting",
    "DEFAULT_SESSION_DURATION_SECONDS",
    "SESSION_DURATION_KEY",
    "get_session_duration_seconds",
    "initialize_default_settings",
    "set_session_duration_seconds",
]

