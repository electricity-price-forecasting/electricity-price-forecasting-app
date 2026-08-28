import unittest
import pandas as pd
from unittest.mock import Mock, patch
import sys

# =====================================================================
# Mock for the settings module to prevent Pydantic ValidationError
# =====================================================================
mock_settings = Mock()
mock_settings.country = "PL"

mock_settings_module = Mock()
mock_settings_module.settings = mock_settings

sys.modules["config"] = Mock()
sys.modules["config.settings"] = mock_settings_module
sys.modules["app.config"] = Mock()
sys.modules["app.config.settings"] = mock_settings_module
# =====================================================================

from app.services.dataset_builder import HistoricalDatasetBuilder


class TestHistoricalDatasetBuilder(unittest.TestCase):

    def test_merge_energy_data_outer_join(self):
        """
        Test that the merge uses an outer join and does not drop rows
        if data is missing in one of the DataFrames.
        """
        prices_index = pd.to_datetime(
            ["2026-01-01 10:00", "2026-01-01 10:30"], utc=True
        )
        prices_df = pd.DataFrame({"price": [100.0, 150.0]}, index=prices_index)

        load_index = pd.to_datetime(["2026-01-01 10:00", "2026-01-01 10:15"], utc=True)
        load_df = pd.DataFrame({"load": [1000.0, 1100.0]}, index=load_index)

        renewable_index = pd.to_datetime(
            ["2026-01-01 10:15", "2026-01-01 10:30"], utc=True
        )
        renewable_df = pd.DataFrame(
            {"wind": [50.0, 60.0], "solar": [20.0, 30.0]}, index=renewable_index
        )

        result = HistoricalDatasetBuilder.merge_energy_data(
            prices_df, load_df, renewable_df
        )

        self.assertEqual(len(result), 3)

        self.assertTrue(pd.isna(result.loc["2026-01-01 10:15", "price"]))
        self.assertTrue(pd.isna(result.loc["2026-01-01 10:30", "load"]))
        self.assertTrue(pd.isna(result.loc["2026-01-01 10:00", "wind"]))

        self.assertEqual(result.loc["2026-01-01 10:00", "price"], 100.0)
        self.assertEqual(result.loc["2026-01-01 10:00", "load"], 1000.0)
        self.assertEqual(result.loc["2026-01-01 10:15", "wind"], 50.0)
        self.assertEqual(result.loc["2026-01-01 10:30", "solar"], 30.0)

    @patch("app.services.dataset_builder.get_cached_or_fetch")
    def test_build_trims_data_to_exact_dates(self, mock_get_cached):
        """
        Test that the builder correctly trims the full month cached data
        down to the exact requested dates.
        """
        full_month_index = pd.date_range(
            "2026-08-01", "2026-08-31", freq="15min", tz="UTC"
        )
        mock_df = pd.DataFrame({"dummy_col": 1}, index=full_month_index)

        mock_get_cached.return_value = mock_df

        builder = HistoricalDatasetBuilder(loader=Mock())

        start_req = "2026-08-10"
        end_req = "2026-08-15"

        result = builder.build(start_date=start_req, end_date=end_req)

        expected_start = pd.Timestamp(start_req, tz="UTC")
        self.assertEqual(result.index.min(), expected_start)

        expected_end = pd.Timestamp(end_req, tz="UTC")
        self.assertEqual(result.index.max(), expected_end)

        self.assertTrue(result.index.is_monotonic_increasing)

    @patch("app.services.dataset_builder.save_csv")
    @patch("app.services.dataset_builder.HistoricalDatasetBuilder.build")
    @patch("app.services.dataset_builder.EntsoeLoader")
    def test_main_builds_and_saves_dataset(
        self,
        mock_loader,
        mock_build,
        mock_save_csv,
    ):

        expected_dataset = pd.DataFrame(
            {
                "price": [100.0, 150.0],
                "load": [1000.0, 1100.0],
                "wind": [50.0, 60.0],
                "solar": [20.0, 30.0],
            }
        )

        mock_build.return_value = expected_dataset

        from app.services.dataset_builder import main

        main()

        # Loader should be created
        mock_loader.assert_called_once()

        # Builder should build the dataset
        mock_build.assert_called_once()

        # save_csv should be called
        mock_save_csv.assert_called_once()

        # Check the DataFrame passed to save_csv
        saved_dataset = mock_save_csv.call_args.args[0]

        pd.testing.assert_frame_equal(
            saved_dataset,
            expected_dataset,
        )


if __name__ == "__main__":
    unittest.main()
