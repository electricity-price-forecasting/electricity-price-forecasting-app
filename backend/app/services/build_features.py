from app.src.config.settings import settings
from app.src.features.features_builder import FeatureBuilder


def main() -> None:
    FeatureBuilder().build_all(settings.raw_file,settings.processed_file)


if __name__ == "__main__":
    main()