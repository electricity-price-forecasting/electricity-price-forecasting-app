import pytest
import pandas as pd
from fastapi.testclient import TestClient
from unittest.mock import patch

from main import app

client = TestClient(app)


@pytest.fixture
def mock_forecast_df():
    """Returns a simple mock DataFrame for the /forecast endpoint."""
    return pd.DataFrame({
        "timestamp": ["2026-09-06T12:00:00Z", "2026-09-06T13:00:00Z"],
        "price": [100.0, 110.0],
        "wind": [50.0, 60.0],
        "solar": [10.0, 0.0],
        "load": [1000.0, 1100.0]
    })


@patch("app.api.routers.forecasts.ForecastPipeline.run")
def test_run_forecast_success(mock_run, mock_forecast_df):
    mock_run.return_value = mock_forecast_df

    response = client.get("/forecast")

    assert response.status_code == 200
    data = response.json()
    assert len(data) == 2
    assert data[0]["price"] == 100.0


@patch("app.api.routers.forecasts.ForecastPipeline.run")
def test_run_forecast_empty_data(mock_run):
    mock_run.return_value = pd.DataFrame()

    response = client.get("/forecast")

    assert response.status_code == 404
    assert response.json()["detail"] == "No forecast data generated"


@patch("app.api.routers.forecasts.ForecastPipeline.run")
def test_run_forecast_internal_error(mock_run):
    mock_run.side_effect = Exception("Database connection failed")

    response = client.get("/forecast")

    assert response.status_code == 500
    assert "Forecast failed: Database connection failed" in response.json()["detail"]