# airport.py
import uuid
from uuid import uuid4

from sqlalchemy import ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base


class Airport(Base):
    __tablename__ = "airports"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    iata_code: Mapped[str] = mapped_column(String(3),nullable=False,unique=True,)
    icao_code: Mapped[str] = mapped_column(String(4),nullable=False,unique=True,)
    city_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("cities.id"),nullable=False,)
    city: Mapped["City"] = relationship(back_populates="airports")