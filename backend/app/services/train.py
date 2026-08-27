from app.src.config import settings
from app.src.training.trainer import ModelTrainer


def main():
    trainer = ModelTrainer()
    trainer.train_all()


if __name__ == "__main__":
    main()