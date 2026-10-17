from app.database.base import Base
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy import ForeignKey, Uuid, String
from uuid import uuid4, UUID

class Passenger(Base):
    __tablename__ = "passengers"

    id: Mapped[UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    reservation_id: Mapped[UUID] = mapped_column(ForeignKey("reservations.id"), nullable=False)
    first_name: Mapped[str] = mapped_column(String, nullable=False)
    last_name: Mapped[str] = mapped_column(String, nullable=False)
    identification: Mapped[int] = mapped_column(nullable=False)
    # Relationship
    reservation: Mapped["Reservation"] = relationship(back_populates="passengers")
