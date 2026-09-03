"""Administrator user management routes."""
from datetime import datetime
from typing import List, Optional

import bcrypt
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..core.userdb import User


router = APIRouter(prefix="/api/v1/users", tags=["users"])


class UserCreate(BaseModel):
	name: str
	domain: Optional[str] = None
	email: str
	password: str
	confirm_password: str


class UserResponse(BaseModel):
	id: int
	username: Optional[str]
	email: str
	domain: Optional[str]
	is_active: bool
	is_admin: bool
	role: str
	created_at: datetime

	class Config:
		from_attributes = True


@router.get("", response_model=List[UserResponse])
async def get_users(db: Session = Depends(get_db)):
	return db.scalars(select(User).order_by(User.created_at.desc())).all()


@router.post("", response_model=UserResponse, status_code=201)
async def create_user(new_user: UserCreate, db: Session = Depends(get_db)):
	name = new_user.name.strip()
	email = new_user.email.strip().lower()
	domain = new_user.domain.strip() if new_user.domain else None

	if not name or not email:
		raise HTTPException(status_code=400, detail="Name and email are required")
	if len(new_user.password) < 8:
		raise HTTPException(status_code=400, detail="Password must be at least 8 characters long")
	if new_user.password != new_user.confirm_password:
		raise HTTPException(status_code=400, detail="Passwords do not match")

	user = User(
		username=name,
		email=email,
		domain=domain,
		password_hash=bcrypt.hashpw(new_user.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8"),
		is_active=True,
		is_admin=False,
		role="user",
	)
	db.add(user)
	try:
		db.commit()
		db.refresh(user)
	except IntegrityError:
		db.rollback()
		raise HTTPException(status_code=409, detail="Email or username already exists")
	return user


@router.delete("/{user_id}", status_code=204)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
	user = db.scalar(select(User).where(User.id == user_id))
	if not user:
		raise HTTPException(status_code=404, detail="User not found")
	if user.is_admin:
		raise HTTPException(status_code=400, detail="Admin users cannot be deleted here")

	db.delete(user)
	db.commit()
	return None
