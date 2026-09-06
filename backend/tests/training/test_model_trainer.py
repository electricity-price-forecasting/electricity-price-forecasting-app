import logging
from unittest.mock import MagicMock, patch

import pandas as pd

from app.src.training.trainer import ModelTrainer



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
            "app.src.training.trainer.pd.read_csv",
            return_value=expected,
        ) as read_csv:
            result = trainer.load_dataset("data.csv")

        read_csv.assert_called_once_with(
            "data.csv",
            parse_dates=["timestamp"],
            index_col="timestamp",
        )
        pd.testing.assert_frame_equal(result, expected)

    @patch("app.src.training.trainer.MODEL_REGISTRY")
    @patch("app.src.training.trainer.MODEL_FEATURES")
    def test_train(self, mock_features, mock_registry):
        trainer = ModelTrainer()

        model = MagicMock()

        config = MagicMock()
        config.processed_dataset = "processed.csv"
        config.model_path = "model.pkl"
        config.model_class.return_value = model

        mock_registry.__getitem__.return_value = config
        mock_features.__getitem__.return_value = ["feature_1", "feature_2"]

        dataset = pd.DataFrame(
            {
                "target": range(10),
                "feature_1": range(10, 20),
                "feature_2": range(20, 30),
                "unused": range(30, 40),
            }
        )

        with patch.object(
            trainer,
            "load_dataset",
            return_value=dataset,
        ) as load_dataset:
            trainer.train("target")

        load_dataset.assert_called_once_with("processed.csv")
        config.model_class.assert_called_once_with()

        fitted_data = model.fit.call_args.args[0]

        expected = dataset[["target", "feature_1", "feature_2"]].iloc[:8]

        pd.testing.assert_frame_equal(fitted_data, expected)

        model.save.assert_called_once_with("model.pkl")

    @patch("app.src.training.trainer.MODEL_REGISTRY")
    def test_train_uses_first_80_percent_for_training(self, mock_registry):
        trainer = ModelTrainer()

        model = MagicMock()

        config = MagicMock()
        config.processed_dataset = "processed.csv"
        config.model_path = "model.pkl"
        config.model_class.return_value = model

        mock_registry.__getitem__.return_value = config

        features = ["feature_1"]
        dataset = pd.DataFrame(
            {
                "target": range(11),
                "feature_1": range(11, 22),
            }
        )

        with patch(
            "app.src.training.trainer.MODEL_FEATURES",
            {"target": features},
        ):
            with patch.object(
                trainer,
                "load_dataset",
                return_value=dataset,
            ):
                trainer.train("target")

        fitted_data = model.fit.call_args.args[0]

        # int(11 * 0.8) == 8
        assert len(fitted_data) == 8
        pd.testing.assert_frame_equal(
            fitted_data,
            dataset[["target", "feature_1"]].iloc[:8],
        )

    @patch("app.src.training.trainer.MODEL_REGISTRY")
    def test_train_all(self, mock_registry, caplog):
        trainer = ModelTrainer()

        names = ["model_a", "model_b", "model_c"]
        mock_registry.__iter__.return_value = iter(names)

        with patch.object(trainer, "train") as train:
            with caplog.at_level(logging.INFO):
                trainer.train_all()

        assert train.call_count == 3
        train.assert_any_call("model_a")
        train.assert_any_call("model_b")
        train.assert_any_call("model_c")

        assert "All models trained." in caplog.text