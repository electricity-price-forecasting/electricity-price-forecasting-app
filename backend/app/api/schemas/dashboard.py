from pydantic import BaseModel
from typing import List

class HighlightMetric(BaseModel):
    value: float
    trend: str            # "up", "down", or "neutral" (used by frontend for red/green colors)
    change_text: str      # e.g., "+4%", "-2.1%", or "Rate"

class TodayHighlightsResponse(BaseModel):
    current_price: float
    today_average: HighlightMetric
    today_peak: HighlightMetric
    today_low: HighlightMetric

class PriceDriver(BaseModel):
    name: str             # e.g., "Wind Generation"
    description: str      # e.g., "Strong downward pressure"
    previous_value: float
    current_value: float
    unit: str             # "GW" or "€"
    change_text: str      # e.g., "-2.1%" or "+5€"
    trend: str            # "up", "down", or "neutral"

class PriceDriversResponse(BaseModel):
    summary: str          # e.g., "Prices are expected to fall by 12% tomorrow"
    drivers: List[PriceDriver]