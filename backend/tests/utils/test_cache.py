import os

os.environ["ENTSOE_API_KEY"] = "test-api-key"
import unittest
import pandas as pd
from unittest.mock import Mock, patch
from app.utils.cache import get_cached_or_fetch


class TestCacheUtils(unittest.TestCase):

    # ДОБАВИЛИ @patch для os.makedirs сюда тоже
    @patch("app.utils.cache.os.path.exists")
    @patch("app.utils.cache.os.makedirs")
    @patch("app.utils.cache.pd.read_parquet")
    def test_get_cached_or_fetch_updates_existing_cache(
        self,
        mock_read_parquet,
        mock_makedirs,
        mock_exists,
    ):
        """
        Test that an existing cache is loaded and updated
        with missing data.
        """
        mock_exists.return_value = True

        cached_df = pd.DataFrame(
            {"price": [10.0, 20.0]},
            index=pd.date_range(
                "2026-08-01 00:00",
                periods=2,
                freq="15min",
                tz="UTC",
            ),
        )

        new_df = pd.DataFrame(
            {"price": [30.0, 40.0]},
            index=pd.date_range(
                "2026-08-01 00:30",
                periods=2,
                freq="15min",
                tz="UTC",
            ),
        )

        mock_read_parquet.return_value = cached_df

        mock_fetch_func = Mock(return_value=new_df)

        with patch.object(
            pd.DataFrame,
            "to_parquet",
        ) as mock_to_parquet:
            result = get_cached_or_fetch(
                fetch_func=mock_fetch_func,
                year=2026,
                month=8,
                data_type="prices",
                refresh=False,
            )

        # Cache was read
        mock_read_parquet.assert_called_once()

        # Missing data was fetched
        mock_fetch_func.assert_called_once()

        # Updated cache was saved
        mock_to_parquet.assert_called_once()

        # Cached + new data
        expected = pd.DataFrame(
            {"price": [10.0, 20.0, 30.0, 40.0]},
            index=pd.date_range(
                "2026-08-01 00:00",
                periods=4,
                freq="15min",
                tz="UTC",
            ),
        )

        pd.testing.assert_frame_equal(result, expected)


if __name__ == "__main__":
    unittest.main()
