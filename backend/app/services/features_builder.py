import logging
from pathlib import Path

import pandas as pd

from app.config.settings import settings
from app.features.features import Features

logger = logging.getLogger(__name__)


class FeatureBuilder:

    def __init__(self) -> None:
        self.features = Features()

    def save_processed_data(self, processed_df: pd.DataFrame) -> None:

        processed_path = settings.processed_file

        processed_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        temp_path = processed_path.with_suffix(".tmp.csv")

        processed_df.to_csv(
            temp_path,
            index=False,
        )

        temp_path.replace(processed_path)

    def build_processed_data(self) -> pd.DataFrame:

        raw_df = pd.read_csv(settings.raw_file)

        raw_df.columns = raw_df.columns.astype(str).str.strip()

        raw_df["timestamp"] = pd.to_datetime(
            raw_df["timestamp"],
            utc=True,
            errors="coerce",
        )

        raw_df = raw_df.dropna(subset=["timestamp"])
        raw_df = raw_df.sort_values("timestamp")

        # No processed file -> build everything
        if not settings.processed_file.exists():
            processed_df = self.features.transform_all(raw_df)

            self.save_processed_data(processed_df)

            logger.info(
                "Processed data built: %d rows, %d columns",
                len(processed_df),
                len(processed_df.columns),
            )

            return processed_df

        # Processed file exists -> load it
        processed_df = pd.read_csv(settings.processed_file)

        processed_df["timestamp"] = pd.to_datetime(
            processed_df["timestamp"],
            utc=True,
            errors="coerce",
        )

        processed_df = processed_df.dropna(subset=["timestamp"])

        last_processed_timestamp = processed_df["timestamp"].max()
        last_raw_timestamp = raw_df["timestamp"].max()

        # Already up to date
        if last_processed_timestamp >= last_raw_timestamp:
            logger.info(
                "Processed data is already up to date: %s",
                last_processed_timestamp,
            )

            return processed_df

        # Raw data has new rows
        return self.update_processed_data(
            processed_df,
            raw_df,
            last_processed_timestamp,
        )

    def update_processed_data(
            self,
            processed_df: pd.DataFrame,
            raw_df: pd.DataFrame,
            last_processed_timestamp,
    ) -> pd.DataFrame:
        """Update processed data using 672 rows of historical context."""

        # Find new raw rows
        new_raw_df = raw_df[
            raw_df["timestamp"] > last_processed_timestamp
            ].copy()

        if new_raw_df.empty:
            logger.info("Processed data is already up to date.")
            return processed_df

        # One week of context
        context_rows = 672

        # Position of the first new row
        first_new_timestamp = new_raw_df["timestamp"].iloc[0]

        first_new_position = raw_df["timestamp"].searchsorted(
            first_new_timestamp
        )

        # Take the previous 672 rows
        context_start = max(
            0,
            first_new_position - context_rows,
        )

        context_df = raw_df.iloc[
            context_start:first_new_position
        ].copy()

        # History + new data
        data_to_transform = pd.concat(
            [context_df, new_raw_df],
            ignore_index=True,
        )

        data_to_transform = data_to_transform.set_index("timestamp", drop = False)
        data_to_transform = data_to_transform.sort_index()

        # Build features
        transformed_df = self.features.transform_all(
            data_to_transform
        )

        # Keep only new rows
        new_processed_df = transformed_df[
            transformed_df["timestamp"] > last_processed_timestamp
            ].copy()

        # Append to existing processed data
        processed_df = pd.concat(
            [processed_df, new_processed_df],
            ignore_index=True,
        )

        # Sort
        processed_df = (
            processed_df
            .sort_values("timestamp")
            .reset_index(drop=True)
        )

        # Save
        self.save_processed_data(processed_df)

        logger.info(
            "Processed data updated: %d new rows, %d total rows",
            len(new_processed_df),
            len(processed_df),
        )

        return processed_df

if __name__ == "__main__":
    FeatureBuilder().build_processed_data()
