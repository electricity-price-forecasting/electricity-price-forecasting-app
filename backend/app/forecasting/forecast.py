from dataclasses import dataclass
from functools import lru_cache

import pandas as pd

from app.config.settings import settings
from app.models.load_model import LoadModel
from app.models.wind_model import WindModel
from app.models.solar_model import SolarModel
from app.models.price_model import PriceModel
from app.utils.time_utils import next_timestamp


@dataclass
class GenerationForecast:
    load: float
    wind: float
    solar: float


class Forecast:
    def __init__(
        self,
        load_model: LoadModel,
        wind_model: WindModel,
        solar_model: SolarModel,
        price_model: PriceModel,
    ) -> None:
        self.load_model = load_model
        self.wind_model = wind_model
        self.solar_model = solar_model
        self.price_model = price_model

    def _load_processed_data(self) -> pd.DataFrame:
        """Load processed data once and keep it in memory."""
        processed_path = settings.processed_file

        df = pd.read_csv(processed_path)

        df["timestamp"] = pd.to_datetime(
            df["timestamp"],
            utc=True,
        )

        return df

    def predict_generation(self, df: pd.DataFrame) -> GenerationForecast:
        return GenerationForecast(
            load=self.load_model.predict_next(df),
            wind=self.wind_model.predict_next(df),
            solar=self.solar_model.predict_next(df),
        )

    def predict_price(
        self,
        df: pd.DataFrame,
        generation: GenerationForecast,
    ) -> float:
        return self.price_model.predict_next(df, generation)

    def recursive_forecast(self, periods: int) -> pd.DataFrame:

        if periods <= 0:
            raise ValueError("periods must be > 0")

        processed_df = self._load_processed_data()

        latest_timestamp = str(
            processed_df["timestamp"].iloc[-1]
        )

        return self._recursive_forecast_cached(
            periods,
            latest_timestamp,
        ).copy()


    def _recursive_forecast_cached(
            self,
            periods: int,
            latest_timestamp: str,
    ) -> pd.DataFrame:
        """Expensive recursive forecast calculation."""

        history = self._load_processed_data().copy()

        predictions = []

        for _ in range(periods):
            timestamp = next_timestamp(history)

            generation = self.predict_generation(history)

            price = self.predict_price(
                history,
                generation,
            )

            row = {
                "timestamp": timestamp,
                "load": generation.load,
                "wind": generation.wind,
                "solar": generation.solar,
                "price": price,
            }

            predictions.append(row)

            # Avoid creating a DataFrame + pd.concat()
            history.loc[len(history)] = row

        return pd.DataFrame(predictions)
