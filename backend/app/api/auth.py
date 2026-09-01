from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
import bcrypt
from pydantic import BaseModel
from sqlalchemy import or_, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core.database import User, get_db

router = APIRouter()


class AuthRequest(BaseModel):
    username: Optional[str] = None
    email: Optional[str] = None
    mobile: Optional[str] = None
    password: str
    confirm_password: Optional[str] = None


@router.post("/register")
async def register(credentials: AuthRequest, db: Session = Depends(get_db)):
    """Register a new user with email or mobile"""
    if len(credentials.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    email = credentials.email.strip().lower() if credentials.email else None
    mobile = credentials.mobile.strip() if credentials.mobile else None

    if not email and not mobile:
        raise HTTPException(status_code=400, detail="Email or mobile number is required")

    if credentials.confirm_password is not None and credentials.confirm_password != credentials.password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check if user already exists
    existing_user = db.scalar(
        select(User).where(or_(User.email == email, User.mobile == mobile))
    )

    if existing_user:
        raise HTTPException(status_code=409, detail="Email or mobile number is already registered")

    password_hash = bcrypt.hashpw(credentials.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(email=email, mobile=mobile, password_hash=password_hash, is_admin=False)
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email or mobile number is already registered")
    return {"message": "Registration successful", "user_id": user.id}


@router.post("/login")
async def login(credentials: AuthRequest, db: Session = Depends(get_db)):
    """Login user with email/mobile or admin with username"""
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

    # Regular user login using email or mobile
    email = credentials.email.strip().lower() if credentials.email else None
    mobile = credentials.mobile.strip() if credentials.mobile else None

    if not email and not mobile:
        raise HTTPException(status_code=401, detail="Email or mobile number is required")

    field = User.email if email else User.mobile
    identifier = email if email else mobile
    user = db.scalar(select(User).where(field == identifier, User.is_active.is_(True)))

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email/mobile or password")

    password_matches = bcrypt.checkpw(
        credentials.password.encode("utf-8"),
        user.password_hash.encode("utf-8"),
    )

    if not password_matches:
        raise HTTPException(status_code=401, detail="Invalid email/mobile or password")
    
    return {
        "message": "Signed in successfully",
        "user_id": user.id,
        "is_admin": False,
        "email": user.email,
        "mobile": user.mobile
    }

