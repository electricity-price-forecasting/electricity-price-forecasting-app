import unittest
import pandas as pd
import pytest

from app.utils.time_utils import normalize_timezone, resample_to_15min, validate_dates


class TestTimeUtils(unittest.TestCase):

    def test_normalize_timezone_localizes_naive_index(self):
        """
        Test that a timezone-naive index is properly localized to UTC.
        """
        # Create a naive datetime index (no timezone attached)
        index = pd.date_range("2026-01-01", periods=2, freq="h")
        df = pd.DataFrame({"price": [10.0, 20.0]}, index=index)

        result = normalize_timezone(df)

        # Assert that the timezone is now set to UTC
        self.assertEqual(str(result.index.tz), "UTC")

    def test_normalize_timezone_converts_cet_to_utc(self):
        """
        Test that a timezone-aware index (e.g., CET) is correctly converted to UTC.
        """
        # Create an aware datetime index in CET timezone (+01:00 or +02:00)
        index = pd.date_range("2026-01-01", periods=2, freq="h", tz="CET")
        df = pd.DataFrame({"price": [10.0, 20.0]}, index=index)

        result = normalize_timezone(df)

        # Assert that the timezone was converted to UTC (+00:00)
        self.assertEqual(str(result.index.tz), "UTC")

    def test_resample_to_15min_interpolates_correctly(self):
        """
        Test that hourly data is resampled to 15-minute intervals
        and missing values are linearly interpolated based on time.
        """
        # Create hourly data (2 data points, 1 hour apart)
        index = pd.date_range("2026-01-01 10:00", periods=2, freq="h", tz="UTC")
        df = pd.DataFrame({"price": [10.0, 50.0]}, index=index)

        result = resample_to_15min(df)

        # A 1-hour span at 15-minute intervals should yield exactly 5 data points
        # (10:00, 10:15, 10:30, 10:45, 11:00)
        self.assertEqual(len(result), 5)

        # Verify the mathematically interpolated values
        self.assertEqual(result.iloc[0]["price"], 10.0)  # 10:00
        self.assertEqual(result.iloc[1]["price"], 20.0)  # 10:15
        self.assertEqual(result.iloc[2]["price"], 30.0)  # 10:30
        self.assertEqual(result.iloc[3]["price"], 40.0)  # 10:45
        self.assertEqual(result.iloc[4]["price"], 50.0)  # 11:00

    def test_validate_dates_rejects_invalid_range(self):
        with pytest.raises(ValueError):
            validate_dates(
                pd.Timestamp("2026-01-02"),
                pd.Timestamp("2026-01-01"),
            )


if __name__ == "__main__":
    unittest.main()
