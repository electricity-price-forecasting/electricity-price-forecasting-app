import pandas as pd
import logging

from app.config.settings import settings
from app.loader.entsoe_loader import EntsoeLoader
from app.utils.logger_config import setup_logging
from app.utils.time_utils import normalize_timezone, resample_to_15min
from app.utils.cache import get_cached_or_fetch
from app.utils.file_utils import save_csv

logger = logging.getLogger(__name__)


class HistoricalDatasetBuilder:
    def __init__(self, loader: EntsoeLoader):
        self.loader = loader

    @staticmethod
    def merge_energy_data(
        prices_df: pd.DataFrame, load_df: pd.DataFrame, renewable_df: pd.DataFrame
    ) -> pd.DataFrame:
        """
        Merges prices, load, wind, and solar DataFrames into a single dataset.
        Uses an outer join to ensure no timestamps are lost even if data is missing.
        """
        if prices_df.empty and load_df.empty and renewable_df.empty:
            return pd.DataFrame()

        merged = pd.concat(
            [prices_df, load_df, renewable_df], axis=1, join="outer", sort=False
        )
        return merged.sort_index()

    def build(
        self, start_date: str, end_date: str, refresh_cache: bool = False
    ) -> pd.DataFrame:
        """
        Generates the final historical dataset for the requested date range.
        Fetches data in monthly chunks to respect API rate limits and utilizes caching.
        """
        start_month = pd.Timestamp(start_date).replace(day=1)

        months = pd.date_range(start=start_month, end=end_date, freq="MS")

        all_months_data = []

        for dt in months:
            refresh_month = dt == months[-1]
            prices = get_cached_or_fetch(
                fetch_func=self.loader.get_prices,
                year=dt.year,
                month=dt.month,
                data_type="prices",
                refresh=refresh_month,
            )

            load = get_cached_or_fetch(
                fetch_func=self.loader.get_load,
                year=dt.year,
                month=dt.month,
                data_type="load",
                refresh=refresh_month,
            )

            renewable = get_cached_or_fetch(
                fetch_func=self.loader.get_wind_solar,
                year=dt.year,
                month=dt.month,
                data_type="renewable",
                refresh=refresh_month,
            )

            prices = normalize_timezone(prices)
            load = normalize_timezone(load)
            renewable = normalize_timezone(renewable)

            prices = resample_to_15min(prices)
            load = resample_to_15min(load)
            renewable = resample_to_15min(renewable)

            monthly_merged = self.merge_energy_data(prices, load, renewable)

            if not monthly_merged.empty:
                all_months_data.append(monthly_merged)
                logger.info(
                    "Processed %s: %d rows",
                    dt.strftime("%Y-%m"),
                    len(monthly_merged),
                )

        if not all_months_data:
            return pd.DataFrame()

        final_dataset = pd.concat(all_months_data, axis=0, sort=False)

        start_ts = pd.Timestamp(start_date, tz="UTC")
        end_ts = pd.Timestamp(end_date, tz="UTC")
        final_dataset = final_dataset.loc[start_ts:end_ts]

        return final_dataset.sort_index()

    setup_logging()


def main():
    setup_logging()

    today = pd.Timestamp.now(tz="UTC")

    loader = EntsoeLoader()
    builder = HistoricalDatasetBuilder(loader)

    dataset = builder.build(
        start_date=str(today - pd.DateOffset(months=2)),
        end_date=str(today),
    )

    save_csv(dataset, settings.raw_file)


if __name__ == "__main__":
    main()
