from astral import Observer
from astral.sun import elevation
from app.config.settings import settings

observer = Observer(latitude=settings.LATITUDE, longitude=settings.LONGITUDE)

def sun_elevation(timestamp) -> float:
    return elevation(observer,timestamp)