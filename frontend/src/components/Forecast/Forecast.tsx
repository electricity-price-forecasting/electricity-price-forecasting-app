import { useState } from "react";
import type { ChartPoint } from "../../types/types";
import { CustomTooltip } from "./CustomTooltip";
import { pricePoints } from "../../api/mockData";
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

const data = pricePoints.map((point, slot) => ({ ...point, slot }));

export const Forecast = () => {
  const [selectedPoint, setSelectedPoint] = useState<ChartPoint>();

  const time = new Date();

  const shortTime = time.toLocaleTimeString("en-US", {
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

          <select className="price-forecast__interval" defaultValue="60">
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
            data={data}
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
              interval={3}
              tick={{
                fill: "#808080",
                fontSize: 12,
              }}
              dy={10}
            />

            <YAxis
              domain={[0, 160]}
              ticks={[0, 40, 80, 120, 160]}
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
        <span>Forecast generated today, {shortTime}</span>

        <span>Data sources: ENTSO-E</span>
      </footer>
    </section>
  );
};
