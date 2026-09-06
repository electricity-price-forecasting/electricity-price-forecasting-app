from dataclasses import dataclass
from pathlib import Path

from app.src.config.settings import settings
from app.models.base_model import BaseModel
from app.models.load_model import LoadModel
from app.models.wind_model import WindModel
from app.models.solar_model import SolarModel
from app.models.price_model import PriceModel

@dataclass(frozen=True)
class ModelConfig:
    model_class: type[BaseModel]
    raw_dataset: str
    model_path: Path

MODEL_REGISTRY = {
    "load": ModelConfig(
        LoadModel,
        settings.raw_file,
        settings.load_model_pkl,
    ),
    "wind": ModelConfig(
        WindModel,
        settings.raw_file,
        settings.wind_model_pkl
    ),
    "solar": ModelConfig(
        SolarModel,
        settings.raw_file,
        settings.solar_model_pkl
    ),
    "price": ModelConfig(
        PriceModel,
        settings.raw_file,
        settings.price_model_pkl
    ),
}