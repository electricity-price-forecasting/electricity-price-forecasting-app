import logging
from pathlib import Path

import pandas as pd

from app.config.settings import settings
from app.features.features import Features

logger = logging.getLogger(__name__)


class FeatureBuilder:

    def __init__(self) -> None:
        self.features = Features()

    def build_processed_data(self) -> pd.DataFrame:
        """Transform raw data into the processed feature dataset, using cache if available."""

        raw_path = settings.raw_file
        processed_path = settings.processed_file

        # Use cached processed data if it already exists
        if processed_path.exists():
            logger.info("Using cached processed data: %s", processed_path)
            return pd.read_csv(processed_path)

        # Otherwise, build the processed dataset
        raw_df = pd.read_csv(raw_path)
        raw_df = raw_df.copy()
        raw_df.columns = raw_df.columns.astype(str).str.strip()

        # Convert timestamp column to datetime
        raw_df.index = pd.to_datetime(
            raw_df.index,
            utc=True,
            errors="coerce",
        )

        # Sort and make timestamp the DataFrame index
        raw_df = raw_df.sort_index()

        # Transform features
        processed_df = self.features.transform_all(raw_df)

        processed_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        # Temporary file
        temp_processed_path = processed_path.with_suffix(".tmp.csv")

        # Save processed dataset
        processed_df.to_csv(
            temp_processed_path,
            index=False,
        )

        # Replace old processed CSV
        temp_processed_path.replace(processed_path)

        logger.info(
            "Features saved: (%d rows, %d columns)",
            len(processed_df),
            len(processed_df.columns),
        )

        return processed_df


if __name__ == "__main__":
    FeatureBuilder().build_processed_data()
