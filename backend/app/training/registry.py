from dataclasses import dataclass
from pathlib import Path

from config.settings import settings
from app.src.model.base import BaseModel
from app.src.model.load import LoadModel
from app.src.model.price import PriceModel
from app.src.model.solar import SolarModel
from app.src.model.wind import WindModel

@dataclass(frozen=True)
class ModelConfig:
    model_class: type[BaseModel]
    raw_dataset: str
    processed_dataset: Path
    model_path: Path

MODEL_REGISTRY = {
    "load": ModelConfig(
        LoadModel,
        settings.raw_file,
        settings.processed_file,
        settings.load_model_pkl,
    ),
    "wind": ModelConfig(
        WindModel,
        settings.raw_file,
        settings.processed_file,
        settings.wind_model_pkl
    ),
    "solar": ModelConfig(
        SolarModel,
        settings.raw_file,
        settings.processed_file,
        settings.solar_model_pkl
    ),
    "price": ModelConfig(
        PriceModel,
        settings.raw_file,
        settings.processed_file,
        settings.price_model_pkl
    ),
}