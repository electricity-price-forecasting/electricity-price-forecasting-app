import logging
from pathlib import Path

import pandas as pd

from app.config.settings import settings
from app.features.features import Features
from app.services.dataset_builder import HistoricalDatasetBuilder

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
        processed_df = processed_df.sort_index()
        processed_df.index.name = "timestamp"
        processed_df = processed_df.reset_index()

        processed_df.to_csv(
            temp_path,
            index=False,
        )

        temp_path.replace(processed_path)

    def build_processed_data(
        self,
        update_start: pd.Timestamp,
    ) -> pd.DataFrame:
        raw_df = pd.read_csv(settings.raw_file)

        raw_df["timestamp"] = pd.to_datetime(
            raw_df["timestamp"],
            utc=True,
            errors="coerce",
        )

        raw_df = raw_df.dropna(subset=["timestamp"])
        raw_df = raw_df.sort_values("timestamp")
        raw_df = raw_df.set_index("timestamp")

        # No processed file yet
        if not settings.processed_file.exists():
            raw_for_features = raw_df.copy()

            value_columns = ["load", "wind", "solar"]

            raw_for_features[value_columns] = raw_for_features[value_columns].ffill()

            processed_df = self.features.transform_all(raw_for_features)

            self.save_processed_data(processed_df)

            return processed_df

        # Load existing processed data
        processed_df = pd.read_csv(settings.processed_file)

        processed_df["timestamp"] = pd.to_datetime(
            processed_df["timestamp"],
            utc=True,
            errors="coerce",
        )

        processed_df = processed_df.dropna(subset=["timestamp"])

        processed_df = processed_df.set_index("timestamp").sort_index()

        return self.update_processed_data(
            processed_df,
            raw_df,
            update_start,
        )

    def update_processed_data(
        self,
        processed_df: pd.DataFrame,
        raw_df: pd.DataFrame,
        update_start: pd.Timestamp,
    ) -> pd.DataFrame:

        context_rows = 672

        # Find update_start position
        position = raw_df.index.searchsorted(update_start)

        # Keep one week of history for features
        context_start = max(
            0,
            position - context_rows,
        )

        data_to_transform = raw_df.iloc[context_start:].copy()

        value_columns = [
            "load",
            "wind",
            "solar",
        ]

        # IMPORTANT:
        # ffill only for feature calculation
        data_to_transform[value_columns] = data_to_transform[value_columns].ffill()

        # Recalculate features
        transformed = self.features.transform_all(data_to_transform)

        # Keep old processed data BEFORE update_start
        processed_before = processed_df[processed_df.index < update_start]

        # Use newly calculated data FROM update_start
        processed_after = transformed[transformed.index >= update_start]

        # Replace old ffilled rows
        updated = pd.concat(
            [
                processed_before,
                processed_after,
            ]
        ).sort_index()

        updated = updated[~updated.index.duplicated(keep="last")]

        self.save_processed_data(updated)

        return updated


if __name__ == "__main__":

    raw_df, update_start = HistoricalDatasetBuilder().update_raw_data()

    FeatureBuilder().build_processed_data(update_start=update_start)
