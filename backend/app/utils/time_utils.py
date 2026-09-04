import pandas as pd
import holidays


def normalize_timezone(df: pd.DataFrame) -> pd.DataFrame:
    """
    Converts the DataFrame index to the UTC timezone.
    If the index is timezone-naive, it localizes it to UTC.
    """
    if df.empty:
        return df

    if df.index.tz is None:
        df.index = df.index.tz_localize("UTC")
    else:
        df.index = df.index.tz_convert("UTC")

    return df


def resample_to_15min(df: pd.DataFrame) -> pd.DataFrame:
    """
    Converts hourly data resolution to 15-minute intervals.
    Applies linear interpolation based on time to ensure smooth transitions.
    """
    if df.empty:
        return df

    return df.resample("15min").interpolate(method="time").round(2)


def validate_dates(start, end):
    start = pd.Timestamp(start)
    end = pd.Timestamp(end)
    if start >= end:
        raise ValueError("Start date must be before end date")
    return start, end

def is_nonworking_day(timestamp: pd.Timestamp) -> int:
    return int(timestamp.weekday() >= 5 or timestamp.date() in holidays.Poland())

def next_timestamp(df: pd.DataFrame) -> pd.Timestamp:

    if not isinstance(df.index, pd.DatetimeIndex):
        df.index = pd.to_datetime(df.index, utc=True)

    return pd.Timestamp(df.index[-1]) + pd.Timedelta(minutes=15)