import logging
import pandas as pd

from training.registry import MODEL_REGISTRY
from app.models.features import MODEL_FEATURES

logger = logging.getLogger(__name__)


class ModelTrainer:

    def load_dataset(self, path):
        return pd.read_csv(
            path,
            parse_dates=["timestamp"],
            index_col="timestamp",
        )

    def train(self, name: str) -> None:
        config = MODEL_REGISTRY[name]
        dataset = self.load_dataset(config.processed_dataset)
        dataset = dataset[[name] + MODEL_FEATURES[name]]


        split = int(len(dataset) * 0.8)
        train_data, test_data = dataset.iloc[:split], dataset.iloc[split:]

        model = config.model_class()
        model.fit(train_data)

        model.save(config.model_path)

    def train_all(self) -> None:
        for name in MODEL_REGISTRY:
            self.train(name)

        logger.info("All models trained.")