import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pandas as pd

from app.src.features.features_builder import FeatureBuilder


class TestFeatureBuilder(unittest.TestCase):

    @patch("app.src.features.features_builder.Features")
    def test_build_all(self, mock_features):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)

            input_path = tmp / "raw.csv"
            output_path = tmp / "processed" / "features.csv"

            input_df = pd.DataFrame(
                {
                    "timestamp": [
                        "2026-08-20 12:00",
                        "2026-08-20 12:15",
                    ],
                    "load": [100, 110],
                    "wind": [20, 25],
                    "solar": [50, 60],
                    "price": [80, 90],
                }
            )

            input_df.to_csv(input_path, index=False)

            transformed_df = pd.DataFrame(
                {
                    "load": [100],
                    "wind": [20],
                    "solar": [50],
                    "price": [80],
                    "hour": [12],
                },
                index=pd.DatetimeIndex(
                    ["2026-08-20 12:00"],
                    name="timestamp",
                ),
            )

            mock_features.return_value.transform_all.return_value = transformed_df

            builder = FeatureBuilder()

            result = builder.build(
                input_path,
                output_path,
            )

            mock_features.return_value.transform_all.assert_called_once()

            pd.testing.assert_frame_equal(
                result,
                transformed_df,
            )

            self.assertTrue(output_path.exists())

            saved_df = pd.read_csv(
                output_path,
                parse_dates=["timestamp"],
                index_col="timestamp",
            )

            pd.testing.assert_frame_equal(
                saved_df,
                transformed_df,
            )