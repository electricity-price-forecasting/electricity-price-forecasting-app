import logging
from pathlib import Path

import pandas as pd
from narwhals import DataFrame

from app.src.features.features import Features
from app.src.config.settings import settings


logger = logging.getLogger(__name__)

class FeatureBuilder:

    def __init__(self) -> None:
        self.features = Features()

    def build_processed_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Transform raw data into the processed feature dataset."""

        df = df.copy()
        df.columns = df.columns.astype(str).str.strip()

        # Convert timestamp column to datetime
        df["timestamp"] = pd.to_datetime(
            df["timestamp"],
            utc=True,
            errors="coerce",
        )

        # Remove invalid timestamps
        df = df.dropna(subset=["timestamp"])

        # Sort and make timestamp the DataFrame index
        df = (
            df
            .sort_values("timestamp")
            .set_index("timestamp")
        )

        # Now transform_all() receives a DatetimeIndex
        df = self.features.transform_all(df)

        logger.info(
            "Features saved:(%d rows, %d columns)",
            len(df),
            len(df.columns),
        )

        return df
