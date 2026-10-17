from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.exception_handlers import register_exception_handlers
from app.modules.auth.routers import user_router
from app.modules.location.routers import (country_router, city_router, airport_router,)
from app.modules.flight.routers import flight_router
from app.modules.auth.customer.routers import customer_router
from app.modules.reservation.routers import reservation_router

app = FastAPI(title="Flight System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],)

register_exception_handlers(app)

app.include_router(user_router.router)
app.include_router(country_router.router)
app.include_router(city_router.router)
app.include_router(airport_router.router)
app.include_router(flight_router.router)
app.include_router(customer_router.router)
app.include_router(reservation_router.router)   