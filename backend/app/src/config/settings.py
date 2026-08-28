from typing import ClassVar

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from pathlib import Path


class Settings(BaseSettings):
    entsoe_api_key: str = Field(validation_alias="ENTSOE_API_KEY")
    country: str = Field(default="PL", validation_alias="COUNTRY")
    timezone: str = Field(default="Europe/Warsaw", validation_alias="TIMEZONE")

    PROJECT_NAME: str = "Electricity Price Forecasting"
    BASE_DIR: ClassVar[Path] = Path(__file__).resolve().parents[2]

    data_dir: Path = BASE_DIR / "data"
    processed_dir: Path = data_dir / "processed"
    raw_file: Path = data_dir / "raw" / "historical_dataset.csv"
    cache_dir: Path = data_dir / "cache"
    model_dir: Path = data_dir / "model"

    processed_file: Path = processed_dir / "processed_historical_dataset.csv"

    load_model_pkl: Path = model_dir / "load.pkl"
    wind_model_pkl: Path = model_dir / "wind.pkl"
    solar_model_pkl: Path = model_dir / "solar.pkl"
    price_model_pkl: Path = model_dir / "price.pkl"

    LATITUDE: float = Field(default=52.1, validation_alias="LATITUDE")
    LONGITUDE: float = Field(default=21.0, validation_alias="LONGITUDE")

    # @property
    # def database_url(self) -> str:
    #     return f"postgresql+asyncpg://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@{self.POSTGRES_HOST}:{self.POSTGRES_PORT}/{self.POSTGRES_DB}"
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).resolve().parents[2] / ".env"),
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings: Settings = Settings()  # type: ignore[call-arg]
