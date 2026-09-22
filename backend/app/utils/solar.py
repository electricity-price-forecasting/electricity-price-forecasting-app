from datetime import datetime

from astral import Observer
from astral.sun import elevation

from app.config.settings import settings


def get_observer() -> Observer:
    return Observer(
        latitude=float(settings.LATITUDE),
        longitude=float(settings.LONGITUDE),
    )


def sun_elevation(timestamp: datetime) -> float:
    observer = get_observer()
    return elevation(observer, timestamp)
