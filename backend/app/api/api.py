from pathlib import Path


import logging

from fastapi import FastAPI, HTTPException, Request, Response
from fastapi.templating import Jinja2Templates

from app.services.forecast import ForecastPipeline



app = FastAPI(
    title="Energy Forecast API",
    description="API for energy data and forecasts",
    version="1.0.0",
)


templates = Jinja2Templates(
    directory=Path(__file__).parent / "templates"
)


logger = logging.getLogger(__name__)

@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request = request,
        name = "index.html",
    )

@app.get("/forecast")
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



