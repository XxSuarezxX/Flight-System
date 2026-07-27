from pydantic import BaseModel
import uuid

class CountryRequest(BaseModel):
        name: str
        iso_code: str

class CountryResponse(BaseModel):
        id: uuid.UUID
        name: str
        iso_code: str