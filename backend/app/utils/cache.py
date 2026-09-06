import os
import pandas as pd
from typing import Callable

from app.config import settings


def get_cached_or_fetch(
    fetch_func: Callable, year: int, month: int, data_type: str, refresh: bool = False
) -> pd.DataFrame:
    cache_dir = settings.settings.cache_dir
    os.makedirs(cache_dir, exist_ok=True)

    file_path = os.path.join(cache_dir, f"{data_type}_{year}_{month:02d}.parquet")

    if not refresh and os.path.exists(file_path):
        return pd.read_parquet(file_path)

    start = pd.Timestamp(year=year, month=month, day=1, tz="UTC")
    end = start + pd.offsets.MonthEnd(0) + pd.Timedelta(days=1, microseconds=-1)

    df = fetch_func(start, end)

    if not df.empty:
        df.to_parquet(file_path)

    return df
