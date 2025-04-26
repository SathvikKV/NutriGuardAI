from fastapi import APIRouter, Depends, HTTPException
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_password
from app.core.jwt import create_access_token
from app.crud import user_crud
from app.schemas.user import UserCreate, UserLogin
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import user_crud

router = APIRouter(tags=["Users"])

@router.post("/register")
def register_user(payload: UserCreate, db: Session = Depends(get_db)):
    existing_user = user_crud.get_user_by_email(db, payload.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    user = user_crud.create_user(db, payload.username, payload.email, payload.password)
    return {"message": "User created successfully", "user_id": user.id}

@router.post("/login")
def login_user(payload: UserLogin, db: Session = Depends(get_db)):
    user = user_crud.get_user_by_email(db, payload.email)
    if not user or not verify_password(payload.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token({"sub": str(user.id)})
    return {"access_token": token, "token_type": "bearer", "user_id": user.id}