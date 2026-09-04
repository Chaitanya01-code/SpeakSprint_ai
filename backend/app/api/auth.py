from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
import bcrypt
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core import User, get_db

router = APIRouter()


class AuthRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    password: str
    confirm_password: Optional[str] = None


@router.post("/register")
async def register(credentials: AuthRequest, db: Session = Depends(get_db)):
    """Register a new user with email"""
    if len(credentials.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    if not credentials.email:
        raise HTTPException(status_code=400, detail="Email is required")

    email = credentials.email.strip().lower()

    if credentials.confirm_password is not None and credentials.confirm_password != credentials.password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check if user already exists
    existing_user = db.scalar(select(User).where(User.email == email))

    if existing_user:
        raise HTTPException(status_code=409, detail="Email is already registered")

    password_hash = bcrypt.hashpw(credentials.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(email=email, password_hash=password_hash, is_admin=False)
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email is already registered")
    return {"message": "Registration successful", "user_id": user.id}


@router.post("/login")
async def login(credentials: AuthRequest, db: Session = Depends(get_db)):
    """Login user with email or admin with username"""
    if len(credentials.password) < 6:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    # Admin login using username
    if credentials.username:
        user = db.scalar(select(User).where(User.username == credentials.username))
        if not user or not user.is_admin:
            raise HTTPException(status_code=401, detail="Invalid admin credentials")
        
        password_matches = bcrypt.checkpw(
            credentials.password.encode("utf-8"),
            user.password_hash.encode("utf-8"),
        )
        if not password_matches:
            raise HTTPException(status_code=401, detail="Invalid admin credentials")
        
        return {
            "message": "Admin signed in successfully",
            "user_id": user.id,
            "is_admin": True,
            "username": user.username
        }

    # Regular user login using email
    if not credentials.email:
        raise HTTPException(status_code=401, detail="Email is required")

    email = credentials.email.strip().lower()
    user = db.scalar(select(User).where(User.email == email, User.is_active.is_(True)))

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    password_matches = bcrypt.checkpw(
        credentials.password.encode("utf-8"),
        user.password_hash.encode("utf-8"),
    )

    if not password_matches:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    return {
        "message": "Signed in successfully",
        "user_id": user.id,
        "is_admin": False,
        "email": user.email
    }

