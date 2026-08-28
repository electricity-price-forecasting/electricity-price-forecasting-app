from config.settings import settings
from features.features_builder import FeatureBuilder


def main() -> None:
    FeatureBuilder().build_all(settings.raw_file,settings.processed_file)


if __name__ == "__main__":
    main()