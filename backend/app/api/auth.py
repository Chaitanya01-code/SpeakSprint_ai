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
    email: Optional[str] = None
    mobile: Optional[str] = None
    password: str
    confirm_password: Optional[str] = None


@router.post("/register")
async def register(credentials: AuthRequest, db: Session = Depends(get_db)):
    if len(credentials.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")

    email = credentials.email.strip().lower() if credentials.email else None
    mobile = credentials.mobile.strip() if credentials.mobile else None

    if not email and not mobile:
        raise HTTPException(status_code=400, detail="Email or mobile number is required")

    if credentials.confirm_password is not None and credentials.confirm_password != credentials.password:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    if email and mobile:
        existing_user = db.scalar(
            select(User).where(or_(User.email == email, User.mobile == mobile))
        )
    else:
        existing_user = db.scalar(
            select(User).where(
                (User.email == email) if email else (User.mobile == mobile)
            )
        )

    if existing_user:
        raise HTTPException(status_code=409, detail="Email or mobile number is already registered")

    password_hash = bcrypt.hashpw(credentials.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
    user = User(email=email, mobile=mobile, password_hash=password_hash)
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=409, detail="Email or mobile number is already registered")
    return {"message": "Registration successful"}


@router.post("/login")
async def login(credentials: AuthRequest, db: Session = Depends(get_db)):
    if len(credentials.password) < 6:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    email = credentials.email.strip().lower() if credentials.email else None
    mobile = credentials.mobile.strip() if credentials.mobile else None

    if not email and not mobile:
        raise HTTPException(status_code=401, detail="Email or mobile number is required")

    field = User.email if email else User.mobile
    identifier = email if email else mobile
    user = db.scalar(select(User).where(field == identifier, User.is_active.is_(True)))

    password_matches = bool(user) and bcrypt.checkpw(
        credentials.password.encode("utf-8"),
        user.password_hash.encode("utf-8"),
    )

    if not password_matches:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Signed in successfully"}

