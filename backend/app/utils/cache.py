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

    start = pd.Timestamp(year=year, month=month, day=1, tz="UTC")
    end = start + pd.offsets.MonthEnd(0) + pd.Timedelta(days=1, microseconds=-1)

    if refresh or not os.path.exists(file_path):
        df = fetch_func(start, end)

        if not df.empty:
            df.to_parquet(file_path)

        return df

        # Cache exists
    cached = pd.read_parquet(file_path)

    if cached.empty:
        df = fetch_func(start, end)
        if not df.empty:
            df.to_parquet(file_path)
        return df

    # Make sure timestamps are UTC
    cached.index = pd.to_datetime(cached.index, utc=True)

    last_timestamp = cached.index.max()

    # Cache already contains the requested period
    if last_timestamp >= end:
        return cached

    # Fetch only the missing part
    new_data = fetch_func(
        last_timestamp + pd.Timedelta(minutes=15),
        end,
    )

    if new_data.empty:
        return cached

    new_data.index = pd.to_datetime(new_data.index, utc=True)

    updated = (
        pd.concat([cached, new_data])
        .loc[lambda df: ~df.index.duplicated(keep="last")]
        .sort_index()
    )

    updated.to_parquet(file_path)

    return updated
