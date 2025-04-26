# app/schemas/user.py

from pydantic import BaseModel, EmailStr

# Base shared by create/response
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Request: Register user
class UserCreate(UserBase):
    password: str

# Response: Return user info (hide password)
class UserResponse(UserBase):
    id: int


    class Config:
        orm_mode = True
