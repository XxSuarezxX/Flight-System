from app.database.base import Base
from app.modules.reservation.enums.reservation_status import ReservationStatus
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Uuid, func, Numeric, Enum
from uuid import uuid4, UUID
from decimal import Decimal
from datetime import datetime

class Reservation(Base):
    __tablename__ = "reservations"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id"), nullable=False)
    flight_id: Mapped[UUID] = mapped_column(ForeignKey("flights.id"), nullable=False)
    price: Mapped[Decimal] = mapped_column(Numeric(precision=12, scale=2), nullable=False)
    status: Mapped[ReservationStatus] = mapped_column(Enum(ReservationStatus), nullable=False)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(server_default=func.now())
    # Relationships
    flight: Mapped["Flight"] = relationship(back_populates="reservations")
    passengers: Mapped[list["Passenger"]] = relationship(back_populates="reservation",cascade="all, delete-orphan")
