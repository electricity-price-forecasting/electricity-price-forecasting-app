import pandas as pd
import pytest

from app.models.base_model import BaseModel


class FakeEstimator:
    def __init__(self):
        self.fitted = False

    def fit(self, X, y):
        self.fitted = True

    def predict(self, X):
        return [42.0] * len(X)


class DummyModel(BaseModel):
    TARGET = "target"
    FEATURES = ["feature_1", "feature_2"]

    def make_features(self, df):
        return pd.DataFrame({
            "feature_1": [1],
            "feature_2": [2],
        })


def test_fit():
    model = DummyModel(FakeEstimator())

    df = pd.DataFrame({
        "feature_1": [1, 2, 3],
        "feature_2": [4, 5, 6],
        "target": [10, 20, 30],
    })

    model.fit(df)

    assert model.estimator.fitted is True


def test_predict():
    model = DummyModel(FakeEstimator())

    df = pd.DataFrame({
        "feature_1": [1],
        "feature_2": [2],
    })

    predictions = model.predict(df)

    assert predictions == [42.0]


def test_predict_next():
    model = DummyModel(FakeEstimator())

    df = pd.DataFrame({
        "feature_1": [1],
        "feature_2": [2],
    })

    prediction = model.predict_next(df)

    assert prediction == 42.0


def test_missing_feature():
    model = DummyModel(FakeEstimator())

    df = pd.DataFrame({
        "feature_1": [1],
    })

    with pytest.raises(ValueError, match="Missing required features"):
        model.predict(df)


def test_missing_target():
    model = DummyModel(FakeEstimator())

    df = pd.DataFrame({
        "feature_1": [1],
        "feature_2": [2],
    })

    with pytest.raises(ValueError, match="Target column"):
        model.fit(df)


def test_empty_dataframe():
    model = DummyModel(FakeEstimator())

    df = pd.DataFrame()

    with pytest.raises(ValueError, match="Training data is empty"):
        model.fit(df)