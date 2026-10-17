from fastapi import Request
from fastapi.responses import JSONResponse

from app.modules.reservation.exceptions.reservation_exception import (
    ReservationNotFoundException,
    ReservationOwnershipException,
    ReservationCancellationNotAllowedException,
)


async def reservation_not_found_handler(
    request: Request, exc: ReservationNotFoundException
):
    return JSONResponse(
        status_code=404,
        content={"detail": "Reservation not found"}
    )


async def reservation_ownership_handler(
    request: Request, exc: ReservationOwnershipException
):
    return JSONResponse(
        status_code=403,
        content={"detail": "You do not have permission to access this reservation"}
    )


async def reservation_cancellation_not_allowed_handler(
    request: Request, exc: ReservationCancellationNotAllowedException
):
    return JSONResponse(
        status_code=409,
        content={"detail": "Reservation cannot be cancelled in its current status"}
    )