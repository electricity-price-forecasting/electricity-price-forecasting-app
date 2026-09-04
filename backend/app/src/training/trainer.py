import logging
import pandas as pd

from app.src.training.registry import MODEL_REGISTRY
from app.models.features import MODEL_FEATURES
from app.utils.logger_config import setup_logging

setup_logging()
logger = logging.getLogger(__name__)


class ModelTrainer:

    def train(self, name: str, df: pd.DataFrame) -> None:
        config = MODEL_REGISTRY[name]

        dataset = df[[name] + MODEL_FEATURES[name]]

        split = int(len(dataset) * 0.8)
        train_data = dataset.iloc[:split]

        model = config.model_class()
        model.fit(train_data)

        model.save(config.model_path)

    @classmethod
    def train_all(cls, df: pd.DataFrame) -> None:
        trainer = cls()
        for name in MODEL_REGISTRY:
            trainer.train(name, df)

        logger.info("All models trained.")



