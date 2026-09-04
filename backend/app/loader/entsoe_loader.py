from entsoe import EntsoePandasClient
from entsoe.exceptions import NoMatchingDataError

from app.src.config.settings import settings
import pandas as pd


class EntsoeLoader:

    def __init__(self, country=settings.country) -> None:
        self.client = EntsoePandasClient(api_key=settings.entsoe_api_key)
        self.country = country

    @staticmethod
    def _prepare_dataframe(df: pd.DataFrame | pd.Series) -> pd.DataFrame:
        if isinstance(df, pd.Series):
            df = df.to_frame()

        df.index = pd.to_datetime(df.index, utc=True)
        return df.sort_index()

    def get_prices(self, start: pd.Timestamp, end: pd.Timestamp) -> pd.DataFrame:
        try:
            prices = self.client.query_day_ahead_prices(
                country_code=self.country, start=start, end=end
            ).to_frame(name="price")
            return self._prepare_dataframe(prices)
        except NoMatchingDataError:
            return pd.DataFrame(columns=["price"])

    def get_load(self, start: pd.Timestamp, end: pd.Timestamp) -> pd.DataFrame:

        try:
            loads = self.client.query_load(
                country_code=self.country, start=start, end=end
            ).rename(columns={"Actual Load": "load"})

            return self._prepare_dataframe(loads)

        except NoMatchingDataError:
            return pd.DataFrame(columns=["load"])

    def get_wind_solar(self, start: pd.Timestamp, end: pd.Timestamp) -> pd.DataFrame:
        try:
            generation = self._prepare_dataframe(
                self.client.query_generation(
                    country_code=self.country, start=start, end=end
                )
            )
            renewable = pd.DataFrame(index=generation.index)
            if "Wind Onshore" in generation.columns:
                renewable["wind"] = generation["Wind Onshore"]
            if "Solar" in generation.columns:
                renewable["solar"] = generation["Solar"]
            return renewable
        except NoMatchingDataError:
            return pd.DataFrame(columns=["wind", "solar"])
