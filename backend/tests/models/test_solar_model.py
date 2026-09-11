import pandas as pd

from app.models.solar_model import SolarModel


def make_history() -> pd.DataFrame:
    periods = 700

    index = pd.date_range(
        start="2026-01-01",
        periods=periods,
        freq="15min",
        tz="UTC",
        name="timestamp",
    )

    return pd.DataFrame(
        {
            "solar": [200.0 + i for i in range(periods)],
        },
        index=index,
    )


def test_solar_model_target():
    model = SolarModel()

    assert model.TARGET == "solar"


def test_solar_model_features():
    model = SolarModel()

    assert model.FEATURES


def test_make_features():
    model = SolarModel()
    df = make_history()

    features = model.make_features(df)

    assert len(features) == 1

    for feature in model.FEATURES:
        assert feature in features.columns