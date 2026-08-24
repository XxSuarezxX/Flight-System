from pydantic import BaseModel
import uuid

class CityRequest(BaseModel):
    name: str
    country_id: uuid.UUID

class CityResponse(BaseModel):
    id: uuid.UUID
    name: str
    country_id: uuid.UUID
        