from unittest.mock import MagicMock, patch

import pandas as pd

from app.services.forecast_pipeline import ForecastPipeline


class TestForecastPipeline:

    @patch("app.services.forecast_pipeline.EntsoeLoader")
    @patch("app.services.forecast_pipeline.HistoricalDatasetBuilder")
    def test_run_raises_when_raw_dataset_is_empty(
        self,
        mock_dataset_builder,
        mock_loader,
    ):
        mock_builder_instance = mock_dataset_builder.return_value
        mock_builder_instance.update_raw_data.return_value = pd.DataFrame()

        with patch.object(
            ForecastPipeline,
            "models_exist",
            return_value=True,
        ):
            try:
                ForecastPipeline().run()
            except ValueError as exc:
                assert str(exc) == "Raw dataset is empty."
            else:
                raise AssertionError("Expected ValueError for empty raw dataset")

    @patch("app.services.forecast_pipeline.FeatureBuilder")
    @patch("app.services.forecast_pipeline.HistoricalDatasetBuilder")
    @patch("app.services.forecast_pipeline.EntsoeLoader")
    def test_run_raises_when_processed_dataset_is_empty(
        self,
        mock_loader,
        mock_dataset_builder,
        mock_feature_builder,
    ):
        raw = pd.DataFrame(
            {
                "timestamp": pd.date_range(
                    "2026-01-01",
                    periods=2,
                    freq="h",
                    tz="UTC",
                ),
                "price": [100.0, 110.0],
            }
        )

        mock_dataset_builder.return_value.update_raw_data.return_value = raw

        mock_feature_builder.return_value.build_processed_data.return_value = (
            pd.DataFrame()
        )

        with patch.object(
            ForecastPipeline,
            "models_exist",
            return_value=True,
        ):
            try:
                ForecastPipeline().run()
            except ValueError as exc:
                assert str(exc) == "Processed dataset is empty."
            else:
                raise AssertionError("Expected ValueError for empty processed dataset")

    @patch("app.services.forecast_pipeline.PriceModel.make_features")
    @patch("app.services.forecast_pipeline.SolarModel.make_features")
    @patch("app.services.forecast_pipeline.WindModel.make_features")
    @patch("app.services.forecast_pipeline.LoadModel.make_features")
    @patch("app.services.forecast_pipeline.Forecast")
    @patch("app.services.forecast_pipeline.ModelTrainer.train_all")
    @patch("app.services.forecast_pipeline.FeatureBuilder")
    @patch("app.services.forecast_pipeline.HistoricalDatasetBuilder")
    @patch("app.services.forecast_pipeline.EntsoeLoader")
    def test_run_retrains_when_models_do_not_exist(
        self,
        mock_loader,
        mock_dataset_builder,
        mock_feature_builder,
        mock_train_all,
        mock_forecast,
        mock_load_model,
        mock_wind_model,
        mock_solar_model,
        mock_price_model,
    ):
        raw = pd.DataFrame(
            {
                "timestamp": pd.date_range(
                    "2026-01-01",
                    periods=2,
                    freq="h",
                    tz="UTC",
                ),
                "price": [100.0, 110.0],
            }
        )

        processed = pd.DataFrame(
            {
                "price": [100.0, 110.0],
                "load": [1000.0, 1100.0],
            }
        )

        forecast_result = pd.DataFrame(
            {
                "timestamp": pd.date_range(
                    "2026-01-02",
                    periods=2,
                    freq="h",
                    tz="UTC",
                ),
                "price": [120.0, 125.0],
            }
        )

        mock_dataset_builder.return_value.update_raw_data.return_value = raw
        mock_feature_builder.return_value.build_processed_data.return_value = processed
        mock_forecast.return_value.recursive_forecast.return_value = forecast_result

        with patch.object(
            ForecastPipeline,
            "models_exist",
            return_value=False,
        ):
            result = ForecastPipeline().run()

        mock_train_all.assert_called_once()

        pd.testing.assert_frame_equal(result, forecast_result)

    @patch("app.services.forecast_pipeline.PriceModel.make_features")
    @patch("app.services.forecast_pipeline.SolarModel.make_features")
    @patch("app.services.forecast_pipeline.WindModel.make_features")
    @patch("app.services.forecast_pipeline.LoadModel.make_features")
    def test_models_exist_returns_true_when_all_models_exist(
        self,
        mock_price_load,
        mock_solar_load,
        mock_wind_load,
        mock_load_load,
        tmp_path,
    ):
        model_paths = [
            tmp_path / "load.pkl",
            tmp_path / "wind.pkl",
            tmp_path / "solar.pkl",
            tmp_path / "price.pkl",
        ]

        with patch(
            "app.config.settings.settings.load_model_pkl",
            model_paths[0],
        ), patch(
            "app.config.settings.settings.wind_model_pkl",
            model_paths[1],
        ), patch(
            "app.config.settings.settings.solar_model_pkl",
            model_paths[2],
        ), patch(
            "app.config.settings.settings.price_model_pkl",
            model_paths[3],
        ):
            for path in model_paths:
                path.touch()

            assert ForecastPipeline.models_exist() is True

    def test_models_exist_returns_false_when_one_model_is_missing(
        self,
        tmp_path,
    ):
        model_paths = [
            tmp_path / "load.pkl",
            tmp_path / "wind.pkl",
            tmp_path / "solar.pkl",
            tmp_path / "price.pkl",
        ]

        # Only three exist
        for path in model_paths[:3]:
            path.touch()

        with patch(
            "app.config.settings.settings.load_model_pkl",
            model_paths[0],
        ), patch(
            "app.config.settings.settings.wind_model_pkl",
            model_paths[1],
        ), patch(
            "app.config.settings.settings.solar_model_pkl",
            model_paths[2],
        ), patch(
            "app.config.settings.settings.price_model_pkl",
            model_paths[3],
        ):
            assert ForecastPipeline.models_exist() is False
