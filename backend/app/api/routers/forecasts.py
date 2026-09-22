from zoneinfo import ZoneInfo

import pandas as pd
from fastapi import APIRouter, HTTPException

from app.services.forecast_pipeline import ForecastPipeline

router = APIRouter(tags=["Forecast"])
WARSAW_TZ = ZoneInfo("Europe/Warsaw")


@router.get("/forecast")
def get_forecast(period: str = "24h"):
    try:
        if period == "24h":
            duration = pd.Timedelta(hours=24)
            periods = 24 * 4
        elif period == "1w":
            duration = pd.Timedelta(days=7)
            periods = 24 * 4 * 7
        elif period == "1m":
            duration = pd.Timedelta(days=30)
            periods = 24 * 4 * 30
        else:
            raise HTTPException(
                status_code=400,
                detail="period must be 24h, 1w or 1m",
            )

        forecast_df = ForecastPipeline().run(periods=periods)

        if forecast_df.empty:
            raise HTTPException(
                status_code=404,
                detail="No forecast data generated",
            )

        if "price" not in forecast_df.columns:
            raise HTTPException(
                status_code=500,
                detail="Forecast data does not contain a 'price' column",
            )

        forecast_df["timestamp"] = pd.to_datetime(
            forecast_df["timestamp"],
            utc=True,
        )

        start = pd.Timestamp.now(WARSAW_TZ).normalize()
        end = start + duration

        forecast_df["timestamp"] = forecast_df["timestamp"].dt.tz_convert(WARSAW_TZ)

        data = forecast_df[
            (forecast_df["timestamp"] >= start) & (forecast_df["timestamp"] <= end)
        ]

        return {
            "period": period,
            "timezone": "Europe/Warsaw",
            "forecast": [
                {
                    "timestamp": row["timestamp"].isoformat(),
                    "price": round(float(row["price"]), 2),
                }
                for _, row in data.iterrows()
            ],
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Forecast failed: {str(e)}",
        )
