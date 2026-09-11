from pathlib import Path
import logging

from fastapi import FastAPI, Request
from fastapi.templating import Jinja2Templates

from app.api.routers import forecasts, drivers

app = FastAPI(
    title="Voltio Energy Forecast API",
    description="API for energy data, dashboards, and forecasts",
    version="1.0.0",
)

logger = logging.getLogger(__name__)
templates = Jinja2Templates(directory=Path(__file__).parent / "app" / "templates")

app.include_router(forecasts.router)
app.include_router(drivers.router)

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
    )