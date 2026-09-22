import pandas as pd
from unittest.mock import Mock

from entsoe.exceptions import NoMatchingDataError

from app.loader.entsoe_loader import EntsoeLoader


def test_prepare_dataframe_converts_series_to_dataframe():
    series = pd.Series(
        [10, 20], index=pd.date_range("2026-01-01", periods=2, freq="15min")
    )
    result = EntsoeLoader._prepare_dataframe(series)
    assert isinstance(result, pd.DataFrame)
    assert len(result) == 2


def test_prepare_dataframe_converts_index_to_utc():
    index = pd.date_range(
        "2026-01-01 10:00", periods=2, freq="15min", tz="Europe/Warsaw"
    )
    df = pd.DataFrame({"price": [10, 20]}, index=index)
    result = EntsoeLoader._prepare_dataframe(df)
    assert str(result.index.tz) == "UTC"


def test_prepare_dataframe_sorts_index():
    index = pd.to_datetime(
        ["2026-01-01 10:30", "2026-01-01 10:00", "2026-01-01 10:15"], utc=True
    )
    df = pd.DataFrame({"price": [30, 10, 20]}, index=index)
    result = EntsoeLoader._prepare_dataframe(df)
    assert result.index.is_monotonic_increasing
    assert result["price"].tolist() == [10, 20, 30]


def test_get_prices_returns_15_minute_data():
    loader = EntsoeLoader.__new__(EntsoeLoader)
    loader.client = Mock()
    loader.country = "PL"
    prices = pd.Series(
        [10.0, 20.0],
        index=pd.to_datetime(["2026-01-01 10:00", "2026-01-01 11:00"], utc=True),
    )
    loader.client.query_day_ahead_prices.return_value = prices
    result = loader.get_prices(prices.index[0], prices.index[-1])
    assert isinstance(result, pd.DataFrame)
    assert "price" in result.columns
    assert result.index.is_monotonic_increasing


def test_get_prices_returns_empty_dataframe_when_no_data():
    loader = EntsoeLoader.__new__(EntsoeLoader)
    loader.client = Mock()
    loader.country = "PL"
    loader.client.query_day_ahead_prices.side_effect = NoMatchingDataError()
    result = loader.get_prices(
        pd.Timestamp("2026-01-01", tz="UTC"), pd.Timestamp("2026-01-02", tz="UTC")
    )
    assert result.empty
    assert list(result.columns) == ["price"]


def test_get_load_returns_dataframe():
    loader = EntsoeLoader.__new__(EntsoeLoader)
    loader.client = Mock()
    loader.country = "PL"
    load_data = pd.DataFrame(
        {"Actual Load": [1000.0, 1100.0]},
        index=pd.to_datetime(["2026-01-01 10:00", "2026-01-01 10:15"], utc=True),
    )
    loader.client.query_load.return_value = load_data
    result = loader.get_load(load_data.index[0], load_data.index[1])
    assert isinstance(result, pd.DataFrame)
    assert "load" in result.columns
    assert "Actual Load" not in result.columns
    assert len(result) == 2


def test_get_load_returns_empty_dataframe_when_no_data():
    loader = EntsoeLoader.__new__(EntsoeLoader)
    loader.client = Mock()
    loader.country = "PL"
    loader.client.query_load.side_effect = NoMatchingDataError()
    result = loader.get_load(
        pd.Timestamp("2026-01-01", tz="UTC"), pd.Timestamp("2026-01-02", tz="UTC")
    )
    assert isinstance(result, pd.DataFrame)
    assert result.empty
    assert list(result.columns) == ["load"]


def test_get_wind_solar_returns_wind_and_solar():
    loader = EntsoeLoader.__new__(EntsoeLoader)
    loader.client = Mock()
    loader.country = "PL"
    generation = pd.DataFrame(
        {"Wind Onshore": [100.0, 110.0], "Solar": [50.0, 60.0]},
        index=pd.to_datetime(["2026-01-01 10:00", "2026-01-01 10:15"], utc=True),
    )
    loader.client.query_generation.return_value = generation
    result = loader.get_wind_solar(generation.index[0], generation.index[1])
    assert isinstance(result, pd.DataFrame)
    assert list(result.columns) == ["wind", "solar"]
    assert result["wind"].tolist() == [100.0, 110.0]
    assert result["solar"].tolist() == [50.0, 60.0]


def test_get_wind_solar_returns_only_available_columns():
    loader = EntsoeLoader.__new__(EntsoeLoader)
    loader.client = Mock()
    loader.country = "PL"
    generation = pd.DataFrame(
        {"Wind Onshore": [100.0, 110.0]},
        index=pd.date_range("2026-01-01 10:00", periods=2, freq="15min", tz="UTC"),
    )
    loader.client.query_generation.return_value = generation
    result = loader.get_wind_solar(generation.index[0], generation.index[1])
    assert isinstance(result, pd.DataFrame)
    assert list(result.columns) == ["wind"]
    assert result["wind"].tolist() == [100.0, 110.0]


def test_get_wind_solar_returns_empty_when_no_data():
    loader = EntsoeLoader.__new__(EntsoeLoader)
    loader.client = Mock()
    loader.country = "PL"
    loader.client.query_generation.side_effect = NoMatchingDataError()
    result = loader.get_wind_solar(
        pd.Timestamp("2026-01-01", tz="UTC"), pd.Timestamp("2026-01-02", tz="UTC")
    )
    assert isinstance(result, pd.DataFrame)
    assert result.empty
    assert list(result.columns) == ["wind", "solar"]


def test_build_dataset_returns_combined_dataframe():
    loader = EntsoeLoader.__new__(EntsoeLoader)

    index = pd.date_range("2026-01-01 10:00", periods=2, freq="15min", tz="UTC")

    prices = pd.DataFrame({"price": [10.0, 20.0]}, index=index)
    load = pd.DataFrame({"load": [1000.0, 1100.0]}, index=index)
    renewable = pd.DataFrame(
        {"wind": [100.0, 120.0], "solar": [50.0, 60.0]}, index=index
    )

    loader.get_prices = Mock(return_value=prices)
    loader.get_load = Mock(return_value=load)
    loader.get_wind_solar = Mock(return_value=renewable)

    result = loader.build_dataset(index[0], index[-1])

    assert isinstance(result, pd.DataFrame)
    assert list(result.columns) == ["price", "load", "wind", "solar"]
    assert len(result) == 2
    assert result["price"].tolist() == [10.0, 20.0]
    assert result["load"].tolist() == [1000.0, 1100.0]
    assert result["wind"].tolist() == [100.0, 120.0]
    assert result["solar"].tolist() == [50.0, 60.0]


def test_build_dataset_keeps_only_common_timestamps():
    loader = EntsoeLoader.__new__(EntsoeLoader)

    index = pd.date_range("2026-01-01 10:00", periods=3, freq="15min", tz="UTC")

    prices = pd.DataFrame({"price": [10.0, 20.0, 30.0]}, index=index)
    load = pd.DataFrame({"load": [1000.0, 1100.0]}, index=index[:2])
    renewable = pd.DataFrame(
        {"wind": [100.0, 120.0], "solar": [50.0, 60.0]}, index=index[:2]
    )

    loader.get_prices = Mock(return_value=prices)
    loader.get_load = Mock(return_value=load)
    loader.get_wind_solar = Mock(return_value=renewable)

    result = loader.build_dataset(index[0], index[-1])

    assert len(result) == 2
    assert result.index.equals(index[:2])
