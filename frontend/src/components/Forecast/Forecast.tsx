import { useState } from "react";
import type { ChartPoint, ForecastData } from "../../types/types";
import { CustomTooltip } from "./CustomTooltip";
import "./Forecast.scss";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getForecastDate,
  mapForecastToChartData,
} from "../../services/forecastToChartData";
import { ChartPeriods } from "../../types/enums";
import classNames from "classnames";

type Props = {
  rawData: ForecastData[];
};

export const Forecast: React.FC<Props> = ({ rawData }) => {
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint>();

  const [forecastInterval, setForecastInterval] = useState("60");
  const [period, setPeriod] = useState(ChartPeriods.day);

  const [generatedTime] = useState(new Date());

  const today = getForecastDate(new Date());

  const [day, month, year] = today.split("/").map(Number);

  const start = new Date(year, month - 1, day);
  const end = new Date(start);

  switch (period) {
    case ChartPeriods.day:
      end.setDate(end.getDate() + 1);
      break;

    case ChartPeriods.week:
      end.setDate(end.getDate() + 7);
      break;

    case ChartPeriods.month:
      start.setDate(start.getDate() - 14);
      end.setDate(end.getDate() + 15);
      break;
  }

  const startMs = start.getTime();
  const endMs = end.getTime();

  const includeEndPoint =
    period === ChartPeriods.day ||
    period === ChartPeriods.week ||
    (period === ChartPeriods.month && forecastInterval === "day");

  const transformedData = mapForecastToChartData(rawData ?? []);

  const visibleData = transformedData
    .filter((point) => {
      const timestamp = new Date(point.timestamp).getTime();

      return (
        timestamp >= startMs &&
        (timestamp < endMs || (includeEndPoint && timestamp === endMs))
      );
    })
    .filter((point) => {
      const date = new Date(point.timestamp);
      const timestamp = date.getTime();

      if (includeEndPoint && timestamp === endMs) {
        return true;
      }

      if (forecastInterval === "60") {
        return date.getMinutes() === 0;
      }

      if (forecastInterval === "30") {
        return date.getMinutes() % 30 === 0;
      }

      if (forecastInterval === "day") {
        return date.getHours() === 0 && date.getMinutes() === 0;
      }

      return true;
    })
    .map((point) => ({
      ...point,
      timestampMs: new Date(point.timestamp).getTime(),
    }));

  const firstForecastIndex = visibleData.findIndex(
    (point) => point.forecast != null,
  );

  const bridgeIndex =
    firstForecastIndex > 0 && visibleData[firstForecastIndex - 1].actual != null
      ? firstForecastIndex - 1
      : -1;

  const chartData = visibleData.map((point, index) =>
    index === bridgeIndex ? { ...point, forecast: point.actual } : point,
  );

  const xTicks: number[] = [];

  for (const tick = new Date(start); tick.getTime() < endMs; ) {
    xTicks.push(tick.getTime());

    if (period === ChartPeriods.day) {
      tick.setHours(tick.getHours() + 4);
    } else {
      tick.setDate(tick.getDate() + (period === ChartPeriods.week ? 1 : 4));
    }
  }

  if (period === ChartPeriods.day || period === ChartPeriods.week) {
    xTicks.push(endMs);
  }

  const axisFormatter = new Intl.DateTimeFormat(
    "en-GB",
    period === ChartPeriods.day
      ? {
          hour: "2-digit",
          minute: "2-digit",
          hourCycle: "h23",
        }
      : {
          day: "2-digit",
          month: "short",
        },
  );

  const shortTime = generatedTime.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleChartMouseMove = (event: { activeLabel?: string | number }) => {
    if (event.activeLabel == null) {
      return;
    }

    const timestamp = Number(event.activeLabel);
    const point = visibleData.find((point) => point.timestampMs === timestamp);

    if (point) {
      setSelectedPoint(point);
    }
  };

  const handlePeriodChange = (period: ChartPeriods) => {
    setSelectedPoint(undefined);
    setForecastInterval("60");
    setPeriod(period);
  };

  return (
    <section className="price-forecast">
      <header className="price-forecast__header">
        <div>
          <h2 className="price-forecast__title">Price Forecast</h2>
        </div>

        <div className="price-forecast__controls">
          <div className="price-forecast__periods">
            <button
              type="button"
              onClick={() => handlePeriodChange(ChartPeriods.day)}
              className={classNames("price-forecast__period-button", {
                "price-forecast__period-button--active":
                  period === ChartPeriods.day,
              })}
            >
              24h
            </button>

            <button
              type="button"
              onClick={() => handlePeriodChange(ChartPeriods.week)}
              className={classNames("price-forecast__period-button", {
                "price-forecast__period-button--active":
                  period === ChartPeriods.week,
              })}
            >
              1w
            </button>

            <button
              type="button"
              onClick={() => handlePeriodChange(ChartPeriods.month)}
              className={classNames("price-forecast__period-button", {
                "price-forecast__period-button--active":
                  period === ChartPeriods.month,
              })}
            >
              1m
            </button>
          </div>

          <select
            className="price-forecast__interval"
            value={forecastInterval}
            onChange={(e) => setForecastInterval(e.target.value)}
          >
            {period !== ChartPeriods.week && period !== ChartPeriods.month && (
              <option value="15">15 min</option>
            )}
            {period !== ChartPeriods.month && (
              <option value="30">30 min</option>
            )}
            <option value="60">hourly</option>
            {period === ChartPeriods.month && (
              <option value="day">daily</option>
            )}
          </select>
        </div>
      </header>

      <div className="price-forecast__unit">€/MWh</div>

      <div className="price-forecast__chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={chartData}
            accessibilityLayer={false}
            onMouseMove={handleChartMouseMove}
            margin={{
              top: 20,
              right: 18,
              left: -12,
              bottom: 5,
            }}
          >
            <CartesianGrid stroke="#ececf2" vertical={false} />

            <XAxis
              dataKey="timestampMs"
              type="number"
              scale="time"
              domain={[startMs, endMs]}
              ticks={xTicks}
              tickFormatter={(timestamp: number) =>
                axisFormatter.format(new Date(timestamp))
              }
              axisLine={false}
              tickLine={false}
              interval={0}
              tick={({ x, y, payload }) => {
                const isFirst = payload.value === xTicks[0];
                const isLast = payload.value === xTicks[xTicks.length - 1];

                return (
                  <text
                    x={x}
                    y={y}
                    dy={10}
                    textAnchor={isFirst ? "start" : isLast ? "end" : "middle"}
                    fill="#808080"
                    fontSize={12}
                  >
                    {axisFormatter.format(new Date(payload.value))}
                  </text>
                );
              }}
            />

            <YAxis
              domain={[0, 200]}
              ticks={[0, 40, 80, 120, 160, 200]}
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#808080",
                fontSize: 12,
              }}
            />

            <Tooltip content={<CustomTooltip />} cursor={false} />

            <Area
              type="linear"
              dataKey="rangeBase"
              stackId="range"
              stroke="none"
              fill="transparent"
              activeDot={false}
              legendType="none"
              isAnimationActive={false}
            />

            <Area
              type="linear"
              dataKey="rangeDiff"
              stackId="range"
              stroke="none"
              activeDot={false}
              fill="#f0f0f8"
              fillOpacity={0.9}
              name="Prices range"
              isAnimationActive={false}
            />

            <ReferenceLine
              y={selectedPoint?.actual ?? selectedPoint?.forecast}
              stroke="#9d9da7"
              strokeDasharray="6 6"
            />

            <ReferenceLine
              x={
                visibleData.find((point) => point.slot === selectedPoint?.slot)
                  ?.timestampMs
              }
              stroke="#b8b8c0"
              strokeDasharray="6 6"
            />

            <Line
              type="linear"
              dataKey="actual"
              stroke="#6E55FF"
              strokeWidth={1.2}
              dot={false}
              activeDot={{
                r: 4,
                fill: "#EAF5FF",
                stroke: "#007DFF",
                strokeWidth: 1,
              }}
              name="Actual price"
              connectNulls={true}
              isAnimationActive={false}
            />

            <Line
              type="linear"
              dataKey="forecast"
              stroke="#007DFF"
              strokeWidth={1.2}
              strokeDasharray="3 3"
              dot={false}
              activeDot={{
                r: 4,
                fill: "#EAF5FF",
                stroke: "#007DFF",
                strokeWidth: 1,
              }}
              name="Forecast"
              connectNulls={true}
              isAnimationActive={false}
            />

            <Legend
              verticalAlign="bottom"
              height={44}
              iconType="plainline"
              wrapperStyle={{
                fontSize: "12px",
                color: "#777780",
                paddingTop: "16px",
              }}
              labelStyle={{
                color: "#535353",
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <footer className="price-forecast__footer">
        <span>Forecast generated today, {shortTime.toLocaleUpperCase()}</span>

        <span>Data sources: ENTSO-E</span>
      </footer>
    </section>
  );
};
