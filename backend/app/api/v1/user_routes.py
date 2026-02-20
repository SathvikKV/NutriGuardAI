from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.core.security import verify_token
# from app.crud import user_crud # Deprecated
# from app.schemas.user import UserCreate, UserLogin # Deprecated

router = APIRouter(tags=["Users"])

# Note: Register and Login are now handled entirely on the Frontend via Supabase SDK.
# The backend only needs to verify the Token passed in headers for protected routes.

@router.get("/me")
def get_current_user_profile(user = Depends(verify_token)):
    """
    Protected route example. 
    Verifies the Supabase JWT and returns user info.
    """
    return {
        "id": user.id,
        "email": user.email,
        "message": "You are authenticated via Supabase!"
    }

# Removed /register and /login endpoints as they are no longer needed in the backend.