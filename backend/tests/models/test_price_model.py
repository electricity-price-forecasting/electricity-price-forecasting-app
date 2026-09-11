import pandas as pd

from app.models.price_model import PriceModel
from app.models.generation_model import GenerationModel


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
            "price": [50.0 + i for i in range(periods)],
        },
        index=index,
    )


def test_price_lags():
    model = PriceModel()
    df = make_history()

    generation = GenerationModel(
        load=500.0,
        wind=100.0,
        solar=200.0,
    )

    features = model.make_features(df, generation)

    assert features["price_lag_1"].iloc[0] == df["price"].iloc[-1]
    assert features["price_lag_2"].iloc[0] == df["price"].iloc[-2]
    assert features["price_lag_4"].iloc[0] == df["price"].iloc[-4]
    assert features["price_lag_8"].iloc[0] == df["price"].iloc[-8]
    assert features["price_lag_24"].iloc[0] == df["price"].iloc[-24]
    assert features["price_lag_48"].iloc[0] == df["price"].iloc[-48]
    assert features["price_lag_96"].iloc[0] == df["price"].iloc[-96]
    assert features["price_lag_192"].iloc[0] == df["price"].iloc[-192]
    assert features["price_lag_672"].iloc[0] == df["price"].iloc[-672]

def test_price_generation_features():
    model = PriceModel()
    df = make_history()

    generation = GenerationModel(
        load=500.0,
        wind=100.0,
        solar=200.0,
    )

    features = model.make_features(df, generation)

    assert features["load"].iloc[0] == 500.0
    assert features["wind"].iloc[0] == 100.0
    assert features["solar"].iloc[0] == 200.0