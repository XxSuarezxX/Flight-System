from fastapi import FastAPI
from app.modules.auth.routers import user_router

app = FastAPI(title="Flight System")

app.include_router(user_router.router)