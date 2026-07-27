# country.py
import uuid
from uuid import uuid4
from sqlalchemy import String, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Country(Base):
    __tablename__ = "countries"

    id: Mapped[uuid.UUID] = mapped_column(Uuid, primary_key=True, default=uuid4)
    name: Mapped[str] = mapped_column(String, nullable=False, unique=True)
    iso_code: Mapped[str] = mapped_column(String(2), nullable=False, unique=True)
    cities: Mapped[list["City"]] = relationship(back_populates="country")