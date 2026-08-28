import pandas as pd

from models.base_model import BaseModel
from utils.time_utils import is_nonworking_day


class LoadModel(BaseModel):
    """
    Forecasting model for energy load prediction.
    """
    TARGET = "load"

    FEATURES = [
        "minute",
        "hour",
        "dayofweek",
        "month",
        "is_nonworking_day",
        "load_lag_1",
        "load_lag_4",
        "load_lag_96",
        "load_lag_672"
    ]

    def make_features(self, df:pd.DataFrame) -> pd.DataFrame:
        """
        Extracts specific time and lag features for load forecasting.
        """
        if len(df) < 672:
            raise ValueError(f"Insufficient history. Required: 672, got: {len(df)}")

        last_timestamp = df.index[-1]
        next_timestamp = last_timestamp + pd.Timedelta(minutes=15)

        features_dict = {
            "hour": next_timestamp.hour,
            "minute": next_timestamp.minute,
            "dayofweek": next_timestamp.dayofweek,
            "month": next_timestamp.month,
            "is_nonworking_day": int(is_nonworking_day(next_timestamp)),
            "load_lag_1": df["load"].iloc[-1],
            "load_lag_4": df["load"].iloc[-4],
            "load_lag_96": df["load"].iloc[-96],
            "load_lag_672": df["load"].iloc[-672]
        }

        return pd.DataFrame([features_dict], index=[next_timestamp], columns=self.FEATURES)

    def predict_next(self, df: pd.DataFrame) -> float:
        """
        Implements the Load forecasting API for the next timestep.
        """

        X = self.make_features(df)

        prediction = self.predict(X)

        return float(prediction[0])