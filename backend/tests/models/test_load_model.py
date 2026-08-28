import pandas as pd

from app.models.load_model import LoadModel


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
            "load": range(periods),
        },
        index=index,
    )


def test_load_model_has_correct_target():
    model = LoadModel()

    assert model.TARGET == "load"


def test_load_model_has_features():
    model = LoadModel()

    assert model.FEATURES
    assert isinstance(model.FEATURES, list)


def test_make_features():
    model = LoadModel()
    df = make_history()

    features = model.make_features(df)

    assert len(features) == 1

    for feature in model.FEATURES:
        assert feature in features.columns


def test_make_features_lags():
    model = LoadModel()
    df = make_history()

    features = model.make_features(df)

    assert features["load_lag_1"].iloc[0] == df["load"].iloc[-1]
    assert features["load_lag_4"].iloc[0] == df["load"].iloc[-4]
    assert features["load_lag_96"].iloc[0] == df["load"].iloc[-96]
    assert features["load_lag_672"].iloc[0] == df["load"].iloc[-672]


def test_predict_next():
    model = LoadModel()
    df = make_history()

    # Replace with your real training data if the
    # training feature columns are required.
    features = model.make_features(df)

    model.estimator.fit(
        features,
        [500.0],
    )

    prediction = model.predict_next(df)

    assert isinstance(prediction, float)