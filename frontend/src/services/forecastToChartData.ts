import type { ChartPoint, ForecastData } from "../types/types";

type ForecastChartPoint = ChartPoint & {
  timestamp: string;
};

const timeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

const dateFormatter = new Intl.DateTimeFormat("en-GB", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: "UTC",
});

export function getForecastDate(date: Date): string {
  return dateFormatter.format(date);
}

export function mapForecastToChartData(
  items: ForecastData[],
): ForecastChartPoint[] {
  return [...items]
    .sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    )
    .map((item, slot) => ({
      slot,
      timestamp: item.timestamp,
      time: timeFormatter.format(new Date(item.timestamp)),
      date: getForecastDate(new Date(item.timestamp)),
      actual: item.price,
    }));
}
