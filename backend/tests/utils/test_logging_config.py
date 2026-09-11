import logging
import unittest
from unittest.mock import patch

from app.utils.logger_config import setup_logging


class TestSetupLogging(unittest.TestCase):

    @patch("app.utils.logger_config.logging.basicConfig")
    def test_setup_logging_configures_logging(self, mock_basic_config):
        setup_logging()

        mock_basic_config.assert_called_once_with(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
        )


if __name__ == "__main__":
    unittest.main()
