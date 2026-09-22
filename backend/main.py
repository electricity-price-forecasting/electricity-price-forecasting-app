from pathlib import Path
import logging

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from app.api.routers import forecasts, drivers
from app.config.settings import settings

app = FastAPI(
    title="Voltio Energy Forecast API",
    description="API for energy data, dashboards, and forecasts",
    version="1.0.0",
)

logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory=Path(__file__).parent / "app" / "templates")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(forecasts.router)
app.include_router(drivers.router)


@app.get("/")
def home(request: Request):
    return {"status": "ok", "message": "Voltio Energy Forecast API is running"}

