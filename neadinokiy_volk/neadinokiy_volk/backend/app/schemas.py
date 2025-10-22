from pydantic import BaseModel, EmailStr
from typing import List, Optional

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ProfileBase(BaseModel):
    display_name: Optional[str] = None
    bio: Optional[str] = None
    interests: Optional[List[str]] = []

class ProfileOut(ProfileBase):
    id: int
    avatar_url: Optional[str] = None

    class Config:
        orm_mode = True

class MessageCreate(BaseModel):
    to_profile_id: int
    text: str

class MessageSend(BaseModel):
    text: str  

class MessageOut(BaseModel):
    id: int
    chat_id: str
    from_profile: int
    to_profile: int
    text: str
    created_at: str

    class Config:
        orm_mode = True

class UserOut(BaseModel):
    id: int
    username: str
    email: str
    
    class Config:
        orm_mode = True

class UserLogin(BaseModel):
    username: str
    password: str