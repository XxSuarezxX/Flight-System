from pydantic import BaseModel
import uuid

class AirportRequest(BaseModel):
    name: str
    iata_code: str
    icao_code: str
    city_id: uuid.UUID

class AirportResponse(BaseModel):
    id: uuid.UUID
    name: str
    iata_code: str
    icao_code: str
    city_id: uuid.UUID