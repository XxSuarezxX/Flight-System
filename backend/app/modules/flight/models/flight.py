from app.modules.flight.enums.flight_status import FlightStatus
import uuid
from uuid import uuid4
from sqlalchemy import ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from sqlalchemy import TIMESTAMP
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Numeric
from sqlalchemy import Enum

class Flight(Base):
    __tablename__ = "flights"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key= True, default=uuid4)
    flight_number : Mapped[str] = mapped_column(String, nullable=False, unique=True)
    origin_airport_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("airports.id"), nullable=False)
    destination_airport_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("airports.id"), nullable=False)
    departure_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    arrival_at: Mapped[datetime] = mapped_column(TIMESTAMP(timezone=True), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(precision=12, scale=2), nullable=False)
    status: Mapped[FlightStatus] = mapped_column(Enum(FlightStatus), nullable=False)

    origin: Mapped["Airport"] = relationship(foreign_keys=[origin_airport_id],back_populates="departing_flights")
    destination: Mapped["Airport"] = relationship(foreign_keys=[destination_airport_id],back_populates="arriving_flights")