import pandas as pd

from app.models.wind_model import WindModel


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
            "wind": [100.0 + i for i in range(periods)],
        },
        index=index,
    )


def test_wind_model_target():
    model = WindModel()

    assert model.TARGET == "wind"


def test_wind_model_features():
    model = WindModel()

    assert model.FEATURES


def test_make_features():
    model = WindModel()
    df = make_history()

    features = model.make_features(df)

    assert len(features) == 1

    for feature in model.FEATURES:
        assert feature in features.columns