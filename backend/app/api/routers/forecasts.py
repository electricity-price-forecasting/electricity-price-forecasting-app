import pandas as pd
from fastapi import APIRouter, HTTPException

from app.services.forecast_pipeline import ForecastPipeline

router = APIRouter(tags=["Forecast"])


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

        now = pd.Timestamp.now(tz="UTC")
        end = now + duration

        data = forecast_df[
            (forecast_df["timestamp"] >= now) & (forecast_df["timestamp"] <= end)
        ]

        return {
            "period": period,
            "timezone": "UTC",
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
