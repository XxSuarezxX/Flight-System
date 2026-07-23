from pydantic import BaseModel, EmailStr, ConfigDict
from datetime import datetime
from app.modules.auth.enums.role import Roles
import uuid

class UserCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    password: str
    phone_number: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str
    role: Roles
    is_active: bool
    is_verified: bool
    created_at: datetime

class UserLogin(BaseModel):
    email: EmailStr
    password: str

