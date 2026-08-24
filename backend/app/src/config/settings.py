from typing import ClassVar

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    entsoe_api_key: str = Field(validation_alias="ENTSOE_API_KEY")
    country: str = Field(default="PL", validation_alias="COUNTRY")

    PROJECT_NAME: str = "Electricity Price Forecasting"
    BASE_DIR: ClassVar[Path] = Path(__file__).resolve().parents[1]

    data_dir = BASE_DIR / "data"
    processed_dir = data_dir / "processed"
    raw_file: Path = data_dir / "raw" / "historical_dataset.csv"
    cache_dir: Path = data_dir / "cache"
    model_dir: Path = data_dir / "model"

    load_processed_file = processed_dir / "load.csv"
    wind_processed_file = processed_dir / "wind.csv"
    solar_processed_file = processed_dir / "solar.csv"
    price_processed_file = processed_dir / "price.csv"

    load_model_pkl = model_dir / "load.pkl"
    wind_model_pkl = model_dir / "wind.pkl"
    solar_model_pkl = model_dir / "solar.pkl"
    price_model_pkl = model_dir / "price.pkl"

    LATITUDE: ClassVar[float] = 52.1
    LONGITUDE: ClassVar[float] = 19.5

    @property
    def database_url(self) -> str:
        return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings: Settings = Settings()  # type: ignore[call-arg]
