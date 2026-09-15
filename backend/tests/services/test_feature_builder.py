import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pandas as pd

from app.config.settings import settings
from app.services.features_builder import FeatureBuilder


class TestFeatureBuilder(unittest.TestCase):

    @patch("app.services.features_builder.Features")
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
                    "timestamp": pd.to_datetime(
                        ["2026-08-20 12:00"],
                        utc=True,
                    ),
                    "load": [100],
                    "wind": [20],
                    "solar": [50],
                    "price": [80],
                    "hour": [12],
                }
            )

            mock_features.return_value.transform_all.return_value = transformed_df

            mock_features.return_value.transform_all.return_value = transformed_df

            with patch.object(settings, "raw_file", input_path), patch.object(
                settings, "processed_file", output_path
            ):
                builder = FeatureBuilder()

                result = builder.build_processed_data()

            mock_features.return_value.transform_all.assert_called_once()

            # build_processed_data() returns timestamp as a normal column
            expected_df = transformed_df

            pd.testing.assert_frame_equal(
                result,
                expected_df,
            )

            self.assertTrue(output_path.exists())

            saved_df = pd.read_csv(
                output_path,
                parse_dates=["timestamp"],
            )

            pd.testing.assert_frame_equal(
                saved_df,
                expected_df,
            )
