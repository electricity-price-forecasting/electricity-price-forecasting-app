import pytest
import pandas as pd
from fastapi.testclient import TestClient
from unittest.mock import patch

# Adjust the import based on your actual file structure
from main import app

client = TestClient(app)


@pytest.fixture
def mock_dashboard_data():
    """Returns exactly what fetch_dashboard_data() would return."""
    now = pd.Timestamp.now(tz="Europe/Warsaw")

    # Create simple 2-row DataFrames to easily verify math
    yesterday_df = pd.DataFrame({
        "price": [50.0, 100.0],  # avg: 75.0, peak: 100.0, low: 50.0
        "wind": [10.0, 10.0],  # avg: 10.0
        "solar": [20.0, 20.0],  # avg: 20.0
        "load": [100.0, 100.0]  # avg: 100.0
    }, index=[now - pd.Timedelta(days=1), now - pd.Timedelta(hours=23)])

    today_df = pd.DataFrame({
        "price": [100.0, 200.0],  # avg: 150.0, peak: 200.0, low: 100.0
        "wind": [20.0, 20.0],  # avg: 20.0 (+100%, trend should be DOWN for renewables)
        "solar": [10.0, 10.0],  # avg: 10.0 (-50%, trend should be UP for renewables)
        "load": [150.0, 150.0]  # avg: 150.0 (+50%, trend should be UP for load)
    }, index=[now, now + pd.Timedelta(hours=1)])

    return yesterday_df, today_df, now


@patch("app.api.routers.drivers.fetch_dashboard_data")
def test_get_today_highlights(mock_fetch, mock_dashboard_data):
    mock_fetch.return_value = mock_dashboard_data

    response = client.get("/api/dashboard/highlights")
    assert response.status_code == 200

    data = response.json()

    assert data["today_average"]["value"] == 150.0
    assert data["today_average"]["trend"] == "up"
    assert data["today_average"]["change_text"] == "+100.0%"

    assert data["today_peak"]["value"] == 200.0
    assert data["today_peak"]["trend"] == "up"
    assert data["today_peak"]["change_text"] == "+100.0%"

    assert data["today_low"]["value"] == 100.0
    assert data["today_low"]["trend"] == "up"
    assert data["today_low"]["change_text"] == "+100.0%"


@patch("app.api.routers.drivers.fetch_dashboard_data")
def test_get_price_drivers(mock_fetch, mock_dashboard_data):
    mock_fetch.return_value = mock_dashboard_data

    response = client.get("/api/dashboard/drivers")
    assert response.status_code == 200

    data = response.json()
    drivers = {d["name"]: d for d in data["drivers"]}

    assert len(drivers) == 3

    wind = drivers["Wind Generation"]
    assert wind["current_value"] == 20.0
    assert wind["change_text"] == "+100.0%"
    assert wind["trend"] == "down"

    solar = drivers["Solar Generation"]
    assert solar["current_value"] == 10.0
    assert solar["change_text"] == "-50.0%"
    assert solar["trend"] == "up"

    load = drivers["Electricity Demand"]
    assert load["current_value"] == 150.0
    assert load["change_text"] == "+50.0%"
    assert load["trend"] == "up"