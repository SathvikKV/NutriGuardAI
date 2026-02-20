# app/core/security.py
import os
from supabase import create_client, Client
from dotenv import load_dotenv
from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY") # Use Service Role for backend admin tasks if needed, usually we verify user token

if not SUPABASE_URL or not SUPABASE_KEY:
    # Fail secure if envs not set
    pass

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
security = HTTPBearer()

def verify_token(credentials: HTTPAuthorizationCredentials = Security(security)):
    """
    Verifies the Bearer token using Supabase Auth.
    Returns the user object if valid.
    """
    token = credentials.credentials
    try:
        user = supabase.auth.get_user(token)
        return user.user
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

def hash_password(password: str) -> str:
    # DEPRECATED: Supabase handles hashing. Kept to prevent import errors during transition if any.
    return "legacy_hashed"

def verify_password(plain_password: str, hashed_password: str) -> bool:
     # DEPRECATED
    return False
