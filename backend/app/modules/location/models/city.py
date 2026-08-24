# city.py
import uuid
from uuid import uuid4
from sqlalchemy import ForeignKey, String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class City(Base):
    __tablename__ = "cities"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False)
    country_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("countries.id"),nullable=False,)
    country: Mapped["Country"] = relationship(back_populates="cities")
    airports: Mapped[list["Airport"]] = relationship(back_populates="city")

    print("City importado")