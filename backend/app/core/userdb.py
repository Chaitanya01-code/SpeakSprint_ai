from datetime import datetime
import os
from sqlalchemy import Boolean, Column, DateTime, Integer, String, inspect, or_, text
from .database import Base, SessionLocal, engine


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    domain = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    presence_status = Column(String(20), default="logged_out", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    role = Column(String(50), default="user", nullable=False)


# Import all models to ensure they are registered with Base before creating tables
from .topicdb import Topic
from .speechdb import TextModel
from ..models.attempt import Attempt
from ..models.transcript import SpeechTranscript

def ensure_domain_column():
    """Add the domain column for databases created before domain was introduced."""
    columns = {column["name"] for column in inspect(engine).get_columns("users")}
    if "domain" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN domain VARCHAR(255)"))

    columns = {column["name"] for column in inspect(engine).get_columns("users")}
    if "presence_status" not in columns:
        with engine.begin() as connection:
            connection.execute(text("ALTER TABLE users ADD COLUMN presence_status VARCHAR(20) DEFAULT 'logged_out' NOT NULL"))


ensure_domain_column()


def initialize_admin_user():
    """Create the initial admin user in the database if it does not exist."""
    from .database import get_db
    import bcrypt

    admin_username = os.getenv("ADMIN_USERNAME", "admin123").strip()
    admin_email = os.getenv("ADMIN_EMAIL", "admin@speaksprint.com").strip().lower()
    admin_password = os.getenv("ADMIN_PASSWORD", "admin123")

    db = SessionLocal()
    try:
        admin_user = db.query(User).filter(
            or_(User.username == admin_username, User.email == admin_email)
        ).first()
        if not admin_user:
            password_hash = bcrypt.hashpw(
                admin_password.encode("utf-8"), bcrypt.gensalt()
            ).decode("utf-8")
            admin_user = User(
                username=admin_username,
                email=admin_email,
                password_hash=password_hash,
                is_admin=True,
                is_active=True,
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print(f"Admin user created: {admin_email}")
    finally:
        db.close()
