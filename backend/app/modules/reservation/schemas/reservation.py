
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime
from decimal import Decimal
from uuid import UUID

class PassengerRequest(BaseModel):
    first_name: str = Field(min_length=1)
    last_name: str = Field(min_length=1)
    identification: int = Field(gt=0)

class ReservationRequest(BaseModel):
    flight_id: UUID
    passengers: list[PassengerRequest] = Field(min_length=1)


class PassengerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    first_name: str
    last_name: str
    identification: int


class FlightDetailsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    flight_number: str
    origin_airport_id: UUID
    destination_airport_id: UUID
    departure_at: datetime
    arrival_at: datetime
    price: Decimal


class ReservationDetailsResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    flight_id: UUID
    price: Decimal
    status: str
    created_at: datetime
    updated_at: datetime
    passengers: list[PassengerResponse]
    flight: FlightDetailsResponse
