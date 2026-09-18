import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

import pandas as pd

from app.config.settings import settings
from app.services.features_builder import FeatureBuilder


class TestFeatureBuilder(unittest.TestCase):

    def create_raw_data(self):
        return pd.DataFrame(
            {
                "timestamp": pd.to_datetime(
                    [
                        "2026-08-20 12:00",
                        "2026-08-20 12:15",
                        "2026-08-20 12:30",
                    ],
                    utc=True,
                ),
                "load": [100.0, 110.0, 120.0],
                "wind": [20.0, 25.0, 30.0],
                "solar": [50.0, 60.0, 70.0],
                "price": [80.0, 90.0, 100.0],
            }
        )

    def create_transformed_data(self):
        index = pd.to_datetime(
            [
                "2026-08-20 12:00",
                "2026-08-20 12:15",
                "2026-08-20 12:30",
            ],
            utc=True,
        )

        result = pd.DataFrame(
            {
                "load": [100.0, 110.0, 120.0],
                "wind": [20.0, 25.0, 30.0],
                "solar": [50.0, 60.0, 70.0],
                "price": [80.0, 90.0, 100.0],
                "hour": [12, 12, 12],
            },
            index=index,
        )

        result.index.name = "timestamp"

        return result

    @patch("app.services.features_builder.Features")
    def test_save_processed_data(self, mock_features):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)

            output_path = tmp / "processed" / "features.csv"

            processed_df = self.create_transformed_data()

            with patch.object(
                settings,
                "processed_file",
                output_path,
            ):
                FeatureBuilder().save_processed_data(processed_df)

            self.assertTrue(output_path.exists())

            saved_df = pd.read_csv(
                output_path,
                parse_dates=["timestamp"],
            )

            saved_df["timestamp"] = pd.to_datetime(
                saved_df["timestamp"],
                utc=True,
            )

            expected_df = processed_df.reset_index()

            pd.testing.assert_frame_equal(
                saved_df,
                expected_df,
            )

    @patch("app.services.features_builder.Features")
    def test_build_processed_data_without_existing_file(
        self,
        mock_features,
    ):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)

            raw_path = tmp / "raw.csv"
            processed_path = tmp / "processed" / "features.csv"

            raw_df = self.create_raw_data()
            raw_df.to_csv(
                raw_path,
                index=False,
            )

            transformed_df = self.create_transformed_data()

            mock_features.return_value.transform_all.return_value = transformed_df

            update_start = pd.Timestamp(
                "2026-08-20 12:00",
                tz="UTC",
            )

            with patch.object(
                settings,
                "raw_file",
                raw_path,
            ), patch.object(
                settings,
                "processed_file",
                processed_path,
            ):
                result = FeatureBuilder().build_processed_data(
                    update_start=update_start,
                )

            mock_features.return_value.transform_all.assert_called_once()

            pd.testing.assert_frame_equal(
                result,
                transformed_df,
            )

            self.assertTrue(processed_path.exists())

    @patch("app.services.features_builder.Features")
    def test_build_processed_data_with_existing_file(
        self,
        mock_features,
    ):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)

            raw_path = tmp / "raw.csv"
            processed_path = tmp / "processed" / "features.csv"

            raw_df = self.create_raw_data()

            raw_df.to_csv(
                raw_path,
                index=False,
            )

            old_processed = self.create_transformed_data()

            # Simulate old processed data
            old_processed["load"] = [
                100.0,
                100.0,
                100.0,
            ]

            processed_path.parent.mkdir(
                parents=True,
                exist_ok=True,
            )

            old_processed.to_csv(
                processed_path,
                index=True,
                index_label="timestamp",
            )

            new_processed = self.create_transformed_data()

            mock_features.return_value.transform_all.return_value = new_processed

            update_start = pd.Timestamp(
                "2026-08-20 12:15",
                tz="UTC",
            )

            with patch.object(
                settings,
                "raw_file",
                raw_path,
            ), patch.object(
                settings,
                "processed_file",
                processed_path,
            ):
                result = FeatureBuilder().build_processed_data(
                    update_start=update_start,
                )

            mock_features.return_value.transform_all.assert_called_once()

            # Row before update_start remains unchanged
            self.assertEqual(
                result.loc[
                    pd.Timestamp(
                        "2026-08-20 12:00",
                        tz="UTC",
                    ),
                    "load",
                ],
                100.0,
            )

            # Rows from update_start are recalculated
            self.assertEqual(
                result.loc[
                    pd.Timestamp(
                        "2026-08-20 12:15",
                        tz="UTC",
                    ),
                    "load",
                ],
                110.0,
            )

            self.assertEqual(
                result.loc[
                    pd.Timestamp(
                        "2026-08-20 12:30",
                        tz="UTC",
                    ),
                    "load",
                ],
                120.0,
            )

    @patch("app.services.features_builder.Features")
    def test_update_processed_data_replaces_old_values(
        self,
        mock_features,
    ):
        old_processed = self.create_transformed_data()

        old_processed["load"] = [
            100.0,
            100.0,
            100.0,
        ]

        raw_df = self.create_raw_data()

        raw_df = raw_df.set_index("timestamp").sort_index()

        new_processed = self.create_transformed_data()

        mock_features.return_value.transform_all.return_value = new_processed

        update_start = pd.Timestamp(
            "2026-08-20 12:15",
            tz="UTC",
        )

        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)

            processed_path = tmp / "processed" / "features.csv"

            with patch.object(
                settings,
                "processed_file",
                processed_path,
            ):
                result = FeatureBuilder().update_processed_data(
                    old_processed,
                    raw_df,
                    update_start,
                )

        # Before update_start = old value
        self.assertEqual(
            result.loc[
                pd.Timestamp(
                    "2026-08-20 12:00",
                    tz="UTC",
                ),
                "load",
            ],
            100.0,
        )

        # From update_start = recalculated value
        self.assertEqual(
            result.loc[
                pd.Timestamp(
                    "2026-08-20 12:15",
                    tz="UTC",
                ),
                "load",
            ],
            110.0,
        )

        self.assertEqual(
            result.loc[
                pd.Timestamp(
                    "2026-08-20 12:30",
                    tz="UTC",
                ),
                "load",
            ],
            120.0,
        )

        # No duplicated timestamps
        self.assertFalse(result.index.duplicated().any())

        mock_features.return_value.transform_all.assert_called_once()

    @patch("app.services.features_builder.Features")
    def test_update_processed_data_keeps_one_week_context(
        self,
        mock_features,
    ):
        index = pd.date_range(
            "2026-08-13 00:00",
            periods=673,
            freq="15min",
            tz="UTC",
        )

        raw_df = pd.DataFrame(
            {
                "load": 100.0,
                "wind": 20.0,
                "solar": 50.0,
                "price": 80.0,
            },
            index=index,
        )

        raw_df.index.name = "timestamp"

        transformed = raw_df.copy()

        mock_features.return_value.transform_all.return_value = transformed

        processed_df = raw_df.copy()

        update_start = pd.Timestamp(
            "2026-08-20 00:00",
            tz="UTC",
        )

        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)

            processed_path = tmp / "processed" / "features.csv"

            with patch.object(
                settings,
                "processed_file",
                processed_path,
            ):
                FeatureBuilder().update_processed_data(
                    processed_df,
                    raw_df,
                    update_start,
                )

        transformed_input = mock_features.return_value.transform_all.call_args[0][0]

        # update_start + 672 context rows
        self.assertEqual(
            len(transformed_input),
            673,
        )

        self.assertEqual(
            transformed_input.index[0],
            pd.Timestamp(
                "2026-08-13 00:00",
                tz="UTC",
            ),
        )

    @patch("app.services.features_builder.Features")
    def test_ffill_is_only_used_for_feature_calculation(
        self,
        mock_features,
    ):
        with tempfile.TemporaryDirectory() as tmp:
            tmp = Path(tmp)

            raw_path = tmp / "raw.csv"
            processed_path = tmp / "processed" / "features.csv"

            raw_df = pd.DataFrame(
                {
                    "timestamp": [
                        "2026-08-20 12:00",
                        "2026-08-20 12:15",
                    ],
                    "load": [100.0, None],
                    "wind": [20.0, None],
                    "solar": [50.0, None],
                    "price": [80.0, 90.0],
                }
            )

            raw_df.to_csv(
                raw_path,
                index=False,
            )

            transformed = self.create_transformed_data().iloc[:2]

            mock_features.return_value.transform_all.return_value = transformed

            update_start = pd.Timestamp(
                "2026-08-20 12:15",
                tz="UTC",
            )

            with patch.object(
                settings,
                "raw_file",
                raw_path,
            ), patch.object(
                settings,
                "processed_file",
                processed_path,
            ):
                FeatureBuilder().build_processed_data(
                    update_start=update_start,
                )

            features_input = mock_features.return_value.transform_all.call_args[0][0]

            # ffill is used before feature calculation
            self.assertEqual(
                features_input.loc[
                    pd.Timestamp(
                        "2026-08-20 12:15",
                        tz="UTC",
                    ),
                    "load",
                ],
                100.0,
            )

            self.assertEqual(
                features_input.loc[
                    pd.Timestamp(
                        "2026-08-20 12:15",
                        tz="UTC",
                    ),
                    "wind",
                ],
                20.0,
            )

            self.assertEqual(
                features_input.loc[
                    pd.Timestamp(
                        "2026-08-20 12:15",
                        tz="UTC",
                    ),
                    "solar",
                ],
                50.0,
            )

            # Original raw CSV still contains NaN
            saved_raw = pd.read_csv(
                raw_path,
            )

            self.assertTrue(pd.isna(saved_raw.loc[1, "load"]))

            self.assertTrue(pd.isna(saved_raw.loc[1, "wind"]))

            self.assertTrue(pd.isna(saved_raw.loc[1, "solar"]))


if __name__ == "__main__":
    unittest.main()
