from dataclasses import dataclass

import pandas as pd

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

    def recursive_forecast(self, df: pd.DataFrame, periods: int) -> pd.DataFrame:

        if periods <= 0:
            raise ValueError("periods must be > 0")

        history, predictions = df.copy().sort_index(), []

        for _ in range(periods):
            timestamp = next_timestamp(history)
            generation = self.predict_generation(history)
            price = self.predict_price(history, generation)
            predictions.append(
                {
                "timestamp": timestamp,
                "load": generation.load,
                "wind": generation.wind,
                "solar": generation.solar,
                "price": price
                }
            )
            new_row = pd.DataFrame(
                {
                    "load": [generation.load],
                    "wind": [generation.wind],
                    "solar": [generation.solar],
                    "price": [price]},
                index=pd.DatetimeIndex(
                    [timestamp],
                    name=history.index.name
                ),
            )

            history = pd.concat([history, new_row])
        return pd.DataFrame(predictions)