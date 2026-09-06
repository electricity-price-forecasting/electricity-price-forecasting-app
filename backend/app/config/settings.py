from typing import ClassVar

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):

    entsoe_api_key: str = Field(validation_alias="ENTSOE_API_KEY")
    country: str = Field(default="PL", validation_alias="COUNTRY")

    PROJECT_NAME: str = "Electricity Price Forecasting"
    BASE_DIR: ClassVar[Path] = Path(__file__).resolve().parents[2]

    ENV_FILE: ClassVar[Path] = BASE_DIR / ".env"

    data_dir: Path = BASE_DIR / "data"
    forecast_dir: Path = data_dir / "forecast"
    raw_file: Path = data_dir / "raw" / "raw_dataset.csv"
    cache_dir: Path = data_dir / "cache"
    model_dir: Path = data_dir / "model"


    load_model_pkl: Path = model_dir / "load.pkl"
    wind_model_pkl: Path = model_dir / "wind.pkl"
    solar_model_pkl: Path = model_dir / "solar.pkl"
    price_model_pkl: Path = model_dir / "price.pkl"

    forecast_file: Path = forecast_dir / "forecast_dataset.csv"

    LATITUDE: float = Field(default=52.1, validation_alias="LATITUDE")
    LONGITUDE: float = Field(default=21.0, validation_alias="LONGITUDE")
    month_period: ClassVar[int] = 2880



    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


settings: Settings = Settings()  # type: ignore[call-arg]
