from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.modules.auth.routers import user_router
from app.modules.location.routers import country_router

from app.modules.location.models import country
from app.modules.location.models import city
from app.modules.location.models import airport

app = FastAPI(title="Flight System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router.router)
app.include_router(country_router.router)