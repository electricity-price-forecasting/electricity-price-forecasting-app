import { useEffect, useState } from "react";
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
import { getForecast } from "../../services/fetchAPI";
import {
  getForecastDate,
  mapForecastToChartData,
} from "../../services/forecastToChartData";

export const Forecast = () => {
  const [forecastData, setForecastData] = useState<ForecastData[] | null>(null);
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint>();
  const [forecastInterval, setForecastInterval] = useState("60");

  useEffect(() => {
    getForecast().then((response) => {
      if (response) {
        setForecastData(response);
      }
    });
  }, []);

  const data = mapForecastToChartData(forecastData ?? []);

  const today = getForecastDate(new Date());

  const visibleData = data
    .filter((element) => {
      return element.date === today;
    })
    .filter((_element, index) => {
      if (forecastInterval === "60") {
        return index % 4 === 0;
      }

      if (forecastInterval === "30") {
        return index % 2 === 0;
      }

      return true;
    });

  const time = new Date();

  const shortTime = time.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });

  const handleChartMouseMove = (event: { activeLabel?: string | number }) => {
    const slot = Number(event.activeLabel);

    if (!Number.isInteger(slot)) {
      return;
    }

    const point = data[slot];

    if (point) {
      setSelectedPoint(point);
    }
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
              className="price-forecast__period-button price-forecast__period-button--active"
            >
              24h
            </button>

            <button type="button" className="price-forecast__period-button">
              1w
            </button>

            <button type="button" className="price-forecast__period-button">
              1m
            </button>
          </div>

          <select
            className="price-forecast__interval"
            defaultValue="60"
            onChange={(e) => setForecastInterval(e.target.value)}
          >
            <option value="15">15 min</option>
            <option value="30">30 min</option>
            <option value="60">hourly</option>
          </select>
        </div>
      </header>

      <div className="price-forecast__unit">€/MWh</div>

      <div className="price-forecast__chart">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={visibleData}
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
              dataKey="slot"
              tickFormatter={(slot: number) => data[slot]?.time.trim() ?? ""}
              axisLine={false}
              tickLine={false}
              interval={4}
              tick={{
                fill: "#808080",
                fontSize: 12,
              }}
              dy={10}
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
              x={selectedPoint?.slot}
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
