import logging

import pandas as pd

from app.utils.time_utils import is_nonworking_day
from app.utils.solar import sun_elevation

logger = logging.getLogger(__name__)


class Features:
    """
    Feature engineering for 15-minute energy data.

    Lag definitions:
        1   = 15 minutes
        2   = 30 minutes
        4   = 1 hour
        8   = 2 hours
        24  = 6 hours
        48  = 12 hours
        96  = 24 hours
        192 = 48 hours
        672 = 7 days
    """

    PRICE_LAGS = [1, 2, 4, 8, 24, 48, 96, 192, 672]
    SOLAR_LAGS = [96, 672]
    LOAD_LAGS = [1, 4, 96, 672]
    WIND_LAGS = [1, 96, 672]

    REQUIRED_COLUMNS = {"price", "load", "wind", "solar"}

    def _validate_input(self, df: pd.DataFrame) -> None:
        if not isinstance(df.index, pd.DatetimeIndex):
            raise TypeError("DataFrame must have a DatetimeIndex.")

        missing = self.REQUIRED_COLUMNS - set(df.columns)
        if missing:
            raise ValueError(f"Missing required columns: {sorted(missing)}")

    def add_time_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df["minute"] = df.index.minute
        df["hour"] = df.index.hour
        df["dayofweek"] = df.index.dayofweek
        df["month"] = df.index.month
        df["dayofyear"] = df.index.dayofyear
        return df

    def add_holiday_feature(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df["is_nonworking_day"] = df.index.map(is_nonworking_day).astype("int8")
        return df

    def add_sun_features(self, df: pd.DataFrame) -> pd.DataFrame:
        df = df.copy()
        df["sun_elevation"] = [sun_elevation(ts) for ts in df.index]
        return df

    def add_lags(self, df: pd.DataFrame, column: str, lags: list[int]) -> pd.DataFrame:
        df = df.copy()

        if column not in df.columns:
            raise ValueError(f"Column '{column}' not found in DataFrame.")

        for lag in lags:
            if lag <= 0:
                raise ValueError(f"Lag must be positive, got {lag}.")
            df[f"{column}_lag_{lag}"] = df[column].shift(lag)

        return df

    def transform_all(self, df: pd.DataFrame) -> pd.DataFrame:
        self._validate_input(df)
        df = self.add_time_features(df)
        df = self.add_holiday_feature(df)
        df = self.add_sun_features(df)

        for column, lags in [
            ("load", self.LOAD_LAGS),
            ("wind", self.WIND_LAGS),
            ("solar", self.SOLAR_LAGS),
            ("price", self.PRICE_LAGS),
        ]:
            df = self.add_lags(df, column, lags)

        df = df.dropna()

        logger.info(
            "Feature engineering completed: %d rows, %d columns",
            len(df),
            len(df.columns),
        )
        return df
