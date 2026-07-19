# Flight System

## Description

Flight System is a backend application for managing flight reservations. The project is being developed as part of a backend portfolio using FastAPI and follows a modular architecture.

## Technologies

* Python 3.13
* FastAPI
* PostgreSQL
* SQLAlchemy 2.0
* Alembic
* Pydantic
* JWT Authentication
* Passlib (bcrypt)

## Requirements

* Python 3.13 or later
* PostgreSQL
* Git

## Installation

1. Clone the repository.
2. Create a virtual environment.
3. Install the dependencies:

```bash
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file in the project root and configure the required environment variables.

Example:

```env
DATABASE_URL=
SECRET_KEY=
ALGORITHM=HS256
SESSION_TIMEOUT=3600
```

## Run the Project

Start the development server:

```bash
uvicorn app.main:app --reload
```

The API documentation will be available at:

```
http://127.0.0.1:8000/docs
```

## Project Status

🚧 Currently under development.
