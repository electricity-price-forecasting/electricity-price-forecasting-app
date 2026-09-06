
from pathlib import Path

import pandas as pd

from app.loader.entsoe_loader import EntsoeLoader
from app.services.dataset_builder import HistoricalDatasetBuilder
from app.src.config.settings import settings
from app.src.features.features_builder import FeatureBuilder
from app.src.forecasting.forecast import Forecast
from app.models.load_model import LoadModel
from app.models.wind_model import WindModel
from app.models.solar_model import SolarModel
from app.models.price_model import PriceModel
from app.src.training.trainer import ModelTrainer


class ForecastPipeline:
    """End-to-end data, training, and forecasting pipeline."""

    def run(
        self,
        retrain: bool = False,
    ) -> pd.DataFrame:

        # 1. Get/create + update raw data
        loader = EntsoeLoader()
        builder = HistoricalDatasetBuilder(loader)
        raw = builder.update_raw_data()

        if raw.empty:
            raise ValueError("Raw dataset is empty.")

        print(raw.columns)


        # 2. Build processed/features dataset
        processor = FeatureBuilder()
        processed = processor.build_processed_data(raw)

        if processed.empty:
            raise ValueError("Processed dataset is empty.")


        # 3. Train models if necessary
        if retrain or not self.models_exist():
            ModelTrainer.train_all(processed)

        # 4. Load trained models
        forecast_service = Forecast(
            load_model=LoadModel.load(settings.load_model_pkl),
            wind_model=WindModel.load(settings.wind_model_pkl),
            solar_model=SolarModel.load(settings.solar_model_pkl),
            price_model=PriceModel.load(settings.price_model_pkl),
        )

        # 5. Forecast
        result = forecast_service.recursive_forecast(
            processed,
            periods=settings.month_period,
        ).dropna()

        # 6. Save forecast
        output_path = Path(settings.forecast_file)

        output_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        result.to_csv(
            output_path,
            index=False,
        )

        return result


    @staticmethod
    def models_exist() -> bool:
        """Return True when all trained model files exist."""

        return all(
            Path(path).exists()
            for path in (
                settings.load_model_pkl,
                settings.wind_model_pkl,
                settings.solar_model_pkl,
                settings.price_model_pkl,
            )
        )


def main() -> None:
    pipeline = ForecastPipeline()
    pipeline.run()


if __name__ == "__main__":
    main()

