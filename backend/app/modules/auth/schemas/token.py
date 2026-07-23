from pydantic import BaseModel
from uuid import UUID

class TokenData(BaseModel):
    sub: UUID
    name: str
    role: str