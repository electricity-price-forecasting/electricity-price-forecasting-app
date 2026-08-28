import os

os.environ["ENTSOE_API_KEY"] = "test-api-key"

import unittest
from unittest.mock import patch
import pandas as pd

from app.features.features import Features
from app.utils.time_utils import is_nonworking_day


class TestFeatures(unittest.TestCase):

    def setUp(self):
        self.features = Features()

    def test_add_time_features(self):
        df = pd.DataFrame(
            {"price": [100]}, index=pd.to_datetime(["2026-08-20 14:30"], utc=True)
        )
        result = self.features.add_time_features(df)
        self.assertEqual(result["minute"].iloc[0], 30)
        self.assertEqual(result["hour"].iloc[0], 14)
        self.assertEqual(result["dayofweek"].iloc[0], 3)
        self.assertEqual(result["month"].iloc[0], 8)
        self.assertEqual(result["dayofyear"].iloc[0], 232)

    def test_is_nonworking_day_returns_integer(self):
        result = is_nonworking_day(pd.Timestamp("2026-08-20 14:30", tz="UTC"))
        self.assertIn(result, [0, 1])
        self.assertIsInstance(result, int)

    def test_is_nonworking_day(self):
        self.assertEqual(
            is_nonworking_day(pd.Timestamp("2026-08-20 14:30", tz="UTC")), 0
        )
        self.assertEqual(
            is_nonworking_day(pd.Timestamp("2026-08-22 14:30", tz="UTC")), 1
        )

    @patch("app.features.features.sun_elevation")
    def test_add_sun_features(self, mock_sun_elevation):
        mock_sun_elevation.side_effect = [20.5, 25.0]
        index = pd.date_range("2026-08-20 12:00", periods=2, freq="15min", tz="UTC")
        df = pd.DataFrame({"price": [100, 110]}, index=index)
        result = self.features.add_sun_features(df)
        self.assertEqual(result["sun_elevation"].tolist(), [20.5, 25.0])
        self.assertEqual(mock_sun_elevation.call_count, 2)

    def test_add_lags(self):
        df = pd.DataFrame({"price": [10, 20, 30, 40, 50]})
        result = self.features.add_lags(df, "price", [1, 2])
        self.assertTrue(pd.isna(result["price_lag_1"].iloc[0]))
        self.assertEqual(result["price_lag_1"].iloc[2], 20)
        self.assertTrue(pd.isna(result["price_lag_2"].iloc[0]))
        self.assertEqual(result["price_lag_2"].iloc[2], 10)

    @patch("app.features.features.sun_elevation")
    def test_transform_all(self, mock_sun_elevation):
        mock_sun_elevation.return_value = 30.0
        index = pd.date_range("2026-08-01", periods=700, freq="15min", tz="UTC")
        df = pd.DataFrame(
            {
                "price": range(700),
                "load": range(1000, 1700),
                "wind": range(2000, 2700),
                "solar": range(3000, 3700),
            },
            index=index,
        )

        result = self.features.transform_all(df)

        for column in [
            "price",
            "load",
            "wind",
            "solar",
            "minute",
            "hour",
            "dayofweek",
            "month",
            "dayofyear",
            "is_nonworking_day",
            "sun_elevation",
            "load_lag_672",
            "wind_lag_672",
            "solar_lag_672",
            "price_lag_672",
        ]:
            self.assertIn(column, result.columns)

        self.assertFalse(result.isna().any().any())
        self.assertEqual(len(result), 28)
        self.assertTrue((result["sun_elevation"] == 30.0).all())

    def test_transform_all_rejects_missing_columns(self):
        index = pd.date_range("2026-08-01", periods=10, freq="15min", tz="UTC")
        df = pd.DataFrame(
            {"price": range(10), "load": range(10), "wind": range(10)}, index=index
        )

        with self.assertRaises(ValueError):
            self.features.transform_all(df)

    def test_transform_all_rejects_non_datetime_index(self):
        df = pd.DataFrame(
            {"price": [10], "load": [100], "wind": [20], "solar": [5]}, index=[0]
        )

        with self.assertRaises(TypeError):
            self.features.transform_all(df)
