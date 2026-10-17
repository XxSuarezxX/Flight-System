from pydantic import BaseModel, EmailStr, ConfigDict
import uuid

class CustomerProfile(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id : uuid.UUID
    first_name: str
    last_name: str
    email: EmailStr
    phone_number: str

class CustomerProfileUpdate(BaseModel):
    first_name: str
    last_name: str
    phone_number: str