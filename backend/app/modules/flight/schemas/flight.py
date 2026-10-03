from app.modules.flight.enums.flight_status import FlightStatus

from pydantic import BaseModel
import uuid
from datetime import datetime, date
from decimal import Decimal


class SearchFlights(BaseModel):
    origin_airport_id: uuid.UUID 
    destination_airport_id: uuid.UUID
    departure_at: date

class FlightRequest(BaseModel):
    flight_number : str
    origin_airport_id: uuid.UUID
    destination_airport_id: uuid.UUID
    departure_at: datetime
    arrival_at: datetime
    price : Decimal

class FlightResponse(BaseModel):
    id : uuid.UUID
    flight_number: str
    origin_airport_id: uuid.UUID
    destination_airport_id: uuid.UUID
    departure_at: datetime
    arrival_at: datetime
    price: Decimal
    status: FlightStatus