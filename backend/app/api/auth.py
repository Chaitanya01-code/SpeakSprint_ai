from typing import Optional

from fastapi import APIRouter, Depends, HTTPException
import bcrypt
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.core import User, get_db
from app.core.security import create_access_token, get_current_user

router = APIRouter()


class AuthRequest(BaseModel):
    username: Optional[str] = None
    name: Optional[str] = None
    email: Optional[str] = None
    domain: Optional[str] = None
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
    domain = credentials.domain.strip() if credentials.domain else None
    if credentials.domain is not None and not domain:
        raise HTTPException(status_code=400, detail="Domain cannot be empty")

    if credentials.confirm_password is not None and credentials.confirm_password != credentials.password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check if user already exists
    existing_user = db.scalar(select(User).where(User.email == email))

    if existing_user:
        raise HTTPException(status_code=409, detail="Email is already registered")

    password_hash = bcrypt.hashpw(credentials.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    username = credentials.name.strip() if credentials.name else None
    user = User(
        username=username,
        email=email,
        password_hash=password_hash,
        domain=domain,
        is_admin=False,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email is already registered")
    return {"message": "Registration successful", "user_id": user.id, "domain": user.domain}


@router.post("/login")
async def login(credentials: AuthRequest, db: Session = Depends(get_db)):
    """Login an active user by email or username."""
    if len(credentials.password) < 6:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if credentials.email:
        user = db.scalar(
            select(User).where(
                User.email == credentials.email.strip().lower(),
                User.is_active.is_(True),
            )
        )
    elif credentials.username:
        username = credentials.username.strip().lower()
        user = db.scalar(
            select(User).where(
                func.lower(User.username) == username,
                User.is_active.is_(True),
            )
        )
    else:
        raise HTTPException(status_code=401, detail="Email or username is required")

    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    password_matches = bcrypt.checkpw(
        credentials.password.encode("utf-8"),
        user.password_hash.encode("utf-8"),
    )

    if not password_matches:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    user.presence_status = "active"
    db.commit()

    return {
        "access_token": create_access_token(user),
        "token_type": "bearer",
        "message": "Admin signed in successfully" if user.is_admin else "Signed in successfully",
        "user_id": user.id,
        "is_admin": user.is_admin,
        "username": user.username,
        "email": user.email,
        "domain": user.domain,
        "presence_status": user.presence_status,
    }


@router.post("/logout")
async def logout(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    current_user.presence_status = "logged_out"
    db.commit()
    return {"message": "Logged out"}

