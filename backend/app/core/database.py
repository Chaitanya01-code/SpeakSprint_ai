from datetime import datetime
import os
from pathlib import Path
from dotenv import load_dotenv

from sqlalchemy import Boolean, Column, DateTime, Integer, String, create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

# Load environment variables from .env file in the backend folder
env_path = Path(__file__).parent.parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
DATABASE_URL = os.getenv("DB_URL", "sqlite:///./speaksprint.db")

# Configure engine based on database type
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    engine = create_engine(DATABASE_URL)


class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, nullable=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    is_admin = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    role = Column(String(50), default="user", nullable=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base.metadata.create_all(bind=engine)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def initialize_admin_user():
    """Create default admin user if it doesn't exist"""
    import bcrypt
    db = SessionLocal()
    try:
        # Check if admin user already exists
        admin_user = db.query(User).filter(User.username == "admin123").first()
        if not admin_user:
            password_hash = bcrypt.hashpw(b"admin 123", bcrypt.gensalt()).decode("utf-8")
            admin_user = User(
                username="admin123",
                email="admin@speaksprint.com",
                password_hash=password_hash,
                is_admin=True,
                is_active=True,
                role="admin"
            )
            db.add(admin_user)
            db.commit()
            print("Admin user created with username: admin123 and password: admin 123")
    finally:
        db.close()
