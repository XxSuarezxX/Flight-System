from fastapi import Request
from fastapi.responses import JSONResponse

from app.modules.auth.exceptions.auth_exceptions import (
    UserAlreadyExistException,
    InvalidCredentialsException,
    UnauthorizedException,
    UserNotFoundException,
    EmailAlreadyExistException,)


async def user_already_exist_handler(request: Request, exc: UserAlreadyExistException):
    return JSONResponse(
        status_code=409,
        content={"detail": "User already exists"},)

async def invalid_credentials_handler(request: Request, exc: InvalidCredentialsException):
    return JSONResponse(
        status_code=401,
        content={"detail": "Invalid credentials"},)

async def unauthorized_handler(request: Request, exc: UnauthorizedException):
    return JSONResponse(
        status_code=401,
        content={"detail": "Unauthorized"},)

async def user_not_found_handler(request: Request, exc: UserNotFoundException):
    return JSONResponse(
        status_code=404,
        content={"detail": "User not found"},)

async def email_already_exist_handler(request: Request, exc: EmailAlreadyExistException):
    return JSONResponse(
        status_code=409,
        content={"detail": "Email already exists"},)