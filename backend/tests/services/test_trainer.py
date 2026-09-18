import logging
from unittest.mock import MagicMock, patch

import pandas as pd

from app.config.settings import settings
from app.services.trainer_pipeline import ModelTrainer
import app.services.trainer_pipeline as trainer_module


class TestModelTrainer:

    def test_load_dataset(self):
        trainer = ModelTrainer()

        expected = pd.DataFrame(
            {
                "value": [1, 2],
            },
            index=pd.DatetimeIndex(
                ["2026-01-01", "2026-01-02"],
                name="timestamp",
            ),
        )

        with patch(
            "app.services.trainer_pipeline.pd.read_csv",
            return_value=expected,
        ) as read_csv:
            result = trainer.load_processed_dataset("data.csv")

        read_csv.assert_called_once_with(
            "data.csv",
            parse_dates=["timestamp"],
        )
        pd.testing.assert_frame_equal(result, expected)

    def test_train(self, monkeypatch):
        trainer = ModelTrainer()

        model = MagicMock()

        config = MagicMock()
        config.model_path = "model.pkl"
        config.model_class.return_value = model

        dataset = pd.DataFrame(
            {
                "price": range(10),
                "feature_1": range(10, 20),
                "feature_2": range(20, 30),
                "unused": range(30, 40),
            }
        )

        monkeypatch.setattr(
            trainer_module,
            "MODEL_FEATURES",
            {
                "price": ["feature_1", "feature_2"],
            },
        )

        monkeypatch.setattr(
            trainer_module,
            "MODEL_REGISTRY",
            {
                "price": config,
            },
        )

        monkeypatch.setattr(
            settings,
            "processed_file",
            "processed.csv",
        )

        with patch.object(
            trainer,
            "load_processed_dataset",
            return_value=dataset,
        ) as load_processed_dataset:
            trainer.train("price")

        load_processed_dataset.assert_called_once_with("processed.csv")
        config.model_class.assert_called_once_with()

        fitted_data = model.fit.call_args.args[0]

        expected = dataset[["price", "feature_1", "feature_2"]].iloc[:8]

        pd.testing.assert_frame_equal(
            fitted_data,
            expected,
        )

        model.save.assert_called_once_with("model.pkl")

    def test_train_uses_first_80_percent_for_training(self):
        trainer = ModelTrainer()

        model = MagicMock()

        config = MagicMock()
        config.model_path = "model.pkl"
        config.model_class.return_value = model

        features = ["feature_1"]

        dataset = pd.DataFrame(
            {
                "price": range(11),
                "feature_1": range(11, 22),
            }
        )

        with patch.object(
            trainer_module,
            "MODEL_REGISTRY",
            {"price": config},
        ), patch.object(
            trainer_module,
            "MODEL_FEATURES",
            {"price": features},
        ), patch.object(
            trainer,
            "load_processed_dataset",
            return_value=dataset,
        ) as load_processed_dataset:
            trainer.train("price")

        load_processed_dataset.assert_called_once()

        fitted_data = model.fit.call_args.args[0]

        # int(11 * 0.8) == 8
        assert len(fitted_data) == 8

        pd.testing.assert_frame_equal(
            fitted_data,
            dataset[["price", "feature_1"]].iloc[:8],
        )

        model.save.assert_called_once_with("model.pkl")

    def test_train_all(self, caplog):
        names = ["model_a", "model_b", "model_c"]
        registry = {name: MagicMock() for name in names}

        with patch.object(
            trainer_module,
            "MODEL_REGISTRY",
            registry,
        ), patch.object(
            ModelTrainer,
            "train",
        ) as mock_train:
            with caplog.at_level(logging.INFO):
                ModelTrainer.train_all()

        assert mock_train.call_count == 3
        mock_train.assert_any_call("model_a")
        mock_train.assert_any_call("model_b")
        mock_train.assert_any_call("model_c")

        assert "All models trained." in caplog.text
