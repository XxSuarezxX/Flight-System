from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.modules.location.schemas.country import CountryRequest, CountryResponse
from app.modules.location.repositories.country_repository import CountryRepository
from app.modules.location.services.country_service import CountryService
from uuid import UUID

router = APIRouter(prefix="/locations", tags=["countries"])

@router.post("/create_country", response_model=CountryResponse)
async def create_country(country: CountryRequest, db: AsyncSession= Depends(get_db)):
    repository = CountryRepository(db)
    service = CountryService(repository)

    new_country = await service.create_country(country)
    return new_country

@router.get("/read_country")
async def read_countries(db: AsyncSession= Depends(get_db)):
    repository = CountryRepository(db)
    service = CountryService(repository)

    return await service.read_country()


@router.put("/update_country/{country_id}", response_model=CountryResponse)
async def update_country(country_id: UUID, country: CountryRequest, db: AsyncSession = Depends(get_db)):
    repository = CountryRepository(db)
    service = CountryService(repository)

    country_to_update = await service.update_country(country_id, country)
    return country_to_update

@router.delete("/delete_country")
async def delete_country(country_id: UUID, db: AsyncSession = Depends(get_db)):
    repository = CountryRepository(db)
    service = CountryService(repository)

    return await service.delete_country(country_id)

