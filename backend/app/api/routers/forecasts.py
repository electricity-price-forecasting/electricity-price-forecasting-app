from fastapi import APIRouter, HTTPException, Response
from app.services.forecast import ForecastPipeline

router = APIRouter(tags=["Forecast"])

@router.get("/forecast")
def run_forecast():
    try:
        pipeline = ForecastPipeline()
        result = pipeline.run()

        if result is None or result.empty:
            raise HTTPException(
                status_code=404,
                detail="No forecast data generated",
            )

        json_result = result.to_json(
            orient="records",
            date_format="iso",
        )

        return Response(
            content=json_result,
            media_type="application/json",
        )

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Forecast failed: {str(e)}",
        )