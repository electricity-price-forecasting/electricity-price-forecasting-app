import logging

import pandas as pd

from app.models.features import LAGS
from app.utils.time_utils import is_nonworking_day
from app.utils.solar import sun_elevation

logger = logging.getLogger(__name__)


class Features:

    REQUIRED_COLUMNS = {"load", "wind", "solar", "price"}

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

    def add_lags(self, df: pd.DataFrame, name: str, lags: list[int]) -> pd.DataFrame:
        df = df.copy()

        if name not in df.columns:
            raise ValueError(f"Column '{name}' not found.")

        for lag in lags:
            if lag <= 0:
                raise ValueError(f"Lag must be positive, got {lag}.")
            df[f"{name}_lag_{lag}"] = df[name].shift(lag)

        return df

    def transform_all(self, df: pd.DataFrame) -> pd.DataFrame:
        self._validate_input(df)

        df = self.add_time_features(df)
        df = self.add_holiday_feature(df)
        df = self.add_sun_features(df)

        for name, lags in LAGS.items():
            df = self.add_lags(df, name, lags)

        df = df.dropna()
        logger.info("Feature engineering completed: %d rows, %d columns",len(df), len(df.columns))

        return df