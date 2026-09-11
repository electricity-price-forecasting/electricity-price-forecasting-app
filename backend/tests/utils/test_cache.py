import os

os.environ["ENTSOE_API_KEY"] = "test-api-key"
import unittest
import pandas as pd
from unittest.mock import Mock, patch
from app.utils.cache import get_cached_or_fetch


class TestCacheUtils(unittest.TestCase):

    # ДОБАВИЛИ @patch для os.makedirs сюда тоже
    @patch("app.utils.cache.os.makedirs")
    @patch("app.utils.cache.os.path.exists")
    @patch("app.utils.cache.pd.read_parquet")
    def test_get_cached_or_fetch_returns_cache_when_exists(
        self, mock_read_parquet, mock_exists, mock_makedirs
    ):
        """
        Test that if the cache file exists and refresh is False,
        the function reads from the disk and does not call the API.
        """
        # 1. Setup mocks: simulate that the file exists
        mock_exists.return_value = True

        # Simulate the DataFrame returned by reading the parquet file
        cached_df = pd.DataFrame({"price": [10.0, 20.0]})
        mock_read_parquet.return_value = cached_df

        # Create a mock loader function (API) to track its calls
        mock_fetch_func = Mock()

        # 2. Execute the function
        result = get_cached_or_fetch(
            fetch_func=mock_fetch_func,
            year=2026,
            month=8,
            data_type="prices",
            refresh=False,
        )

        # 3. Assertions
        # The API should not be called at all
        mock_fetch_func.assert_not_called()

        # The parquet read function should be called exactly once
        mock_read_parquet.assert_called_once()

        # The result must match the cached DataFrame
        pd.testing.assert_frame_equal(result, cached_df)

    @patch("app.utils.cache.os.path.exists")
    @patch("app.utils.cache.os.makedirs")
    def test_get_cached_or_fetch_calls_api_when_no_cache(
        self, mock_makedirs, mock_exists
    ):
        """
        Test that if the cache file does not exist,
        the function calls the API loader and saves the result to parquet.
        """
        # 1. Setup mocks: simulate that the file does not exist
        mock_exists.return_value = False

        # Fake API response DataFrame
        api_response_df = pd.DataFrame({"load": [1000.0, 1100.0]})
        mock_fetch_func = Mock(return_value=api_response_df)

        # Mock the to_parquet method of the DataFrame to prevent disk writes
        with patch.object(pd.DataFrame, "to_parquet") as mock_to_parquet:
            # 2. Execute the function
            result = get_cached_or_fetch(
                fetch_func=mock_fetch_func, year=2026, month=8, data_type="load"
            )

            # 3. Assertions
            # The API function should be called exactly once
            mock_fetch_func.assert_called_once()

            # The data should be saved to parquet
            mock_to_parquet.assert_called_once()

            # The result must match the API response
            pd.testing.assert_frame_equal(result, api_response_df)


if __name__ == "__main__":
    unittest.main()
