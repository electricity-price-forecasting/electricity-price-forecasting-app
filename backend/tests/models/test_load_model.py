import pytest
import pandas as pd
import numpy as np
from app.models.load_model import LoadModel


@pytest.fixture
def mock_history_df() -> pd.DataFrame:
    """
    Creates a fake historical DataFrame with exactly 672 rows
    (1 week of 15-minute intervals) to use in our tests.
    """
    # Create exactly 672 timestamps ending at a specific known time
    timestamps = pd.date_range(end="2026-08-26 12:00:00", periods=672, freq="15min")

    # Create fake electricity load data (just numbers from 1000 to 1671)
    fake_load = np.arange(1000, 1000 + 672)

    return pd.DataFrame({"load": fake_load}, index=timestamps)


def test_load_model_insufficient_history():
    """
    ML-011 & ML-012: Tests that providing less than 672 rows correctly raises an error.
    """
    model = LoadModel()
    short_df = pd.DataFrame({"load": [1, 2, 3]})  # Only 3 rows!

    with pytest.raises(ValueError, match="Insufficient history"):
        model.make_features(short_df)

    with pytest.raises(ValueError, match="Insufficient history"):
        model.predict_next(short_df)


def test_load_model_make_features(mock_history_df: pd.DataFrame):
    """
    ML-011: Tests calendar generation, lag values, and column ordering.
    """
    model = LoadModel()
    features_df = model.make_features(mock_history_df)

    # 1. Correct next timestamp (15 mins after 12:00:00 is 12:15:00)
    next_timestamp = features_df.index[0]
    assert next_timestamp.hour == 12
    assert next_timestamp.minute == 15

    # 2. Calendar features are generated correctly in the columns
    assert features_df["hour"].iloc[0] == 12
    assert features_df["minute"].iloc[0] == 15

    # 3. Lag values are taken from the correct historical observations
    assert features_df["load_lag_1"].iloc[0] == mock_history_df["load"].iloc[-1]
    assert features_df["load_lag_4"].iloc[0] == mock_history_df["load"].iloc[-4]
    assert features_df["load_lag_96"].iloc[0] == mock_history_df["load"].iloc[-96]
    assert features_df["load_lag_672"].iloc[0] == mock_history_df["load"].iloc[-672]

    # 4. Returned columns strictly match LOAD_FEATURES order
    assert list(features_df.columns) == model.FEATURES


def test_load_model_predict_next(mock_history_df: pd.DataFrame):
    """
    ML-012: Tests that prediction returns a float and uses the trained model.
    """

    # Create a "fake" machine learning algorithm that always guesses 42.5
    class DummyEstimator:
        def predict(self, X):
            return np.array([42.5])

    # Inject our fake brain into the LoadModel
    model = LoadModel(estimator=DummyEstimator())

    prediction = model.predict_next(mock_history_df)

    # 1. Ensure a single Python float is returned
    assert isinstance(prediction, float)

    # 2. Ensure it successfully called the model
    assert prediction == 42.5