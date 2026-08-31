import { useState } from "react";
import type { PricePoint } from "../../types/types";
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

const pricePoints: PricePoint[] = [
  { time: "23:00", actual: 56 },
  { time: "00:00", actual: 59 },
  { time: "01:00", actual: 62 },
  { time: "02:00", actual: 63 },
  { time: "03:00", actual: 65 },
  { time: "04:00", actual: 75 },
  { time: "05:00", actual: 64 },
  { time: "06:00", actual: 42 },
  { time: "07:00", actual: 54 },
  { time: "08:00", actual: 72 },
  { time: "09:00", actual: 84 },
  { time: "10:00", actual: 90, forecast: 90 },

  {
    time: "11:00",
    forecast: 94,
    rangeBase: 84,
    rangeDiff: 20,
  },
  {
    time: "12:00",
    forecast: 109,
    rangeBase: 88,
    rangeDiff: 28,
  },
  {
    time: "13:00",
    forecast: 112,
    rangeBase: 90,
    rangeDiff: 26,
  },
  {
    time: "14:00",
    forecast: 101,
    rangeBase: 88,
    rangeDiff: 27,
  },
  {
    time: "15:00",
    forecast: 115,
    rangeBase: 92,
    rangeDiff: 31,
  },
  {
    time: "16:00",
    forecast: 124,
    rangeBase: 96,
    rangeDiff: 34,
  },
  {
    time: "17:00",
    forecast: 131,
    rangeBase: 99,
    rangeDiff: 34,
  },
  {
    time: "18:00",
    forecast: 120,
    rangeBase: 92,
    rangeDiff: 30,
  },
  {
    time: "19:00",
    forecast: 116,
    rangeBase: 88,
    rangeDiff: 27,
  },
  {
    time: "20:00",
    forecast: 108,
    rangeBase: 84,
    rangeDiff: 27,
  },
  {
    time: "21:00",
    forecast: 104,
    rangeBase: 82,
    rangeDiff: 24,
  },
  {
    time: "22:00",
    forecast: 100,
    rangeBase: 80,
    rangeDiff: 23,
  },
  {
    time: "23:00",
    forecast: 95,
    rangeBase: 78,
    rangeDiff: 22,
  },
  {
    time: "00:00 ",
    forecast: 80,
    rangeBase: 71,
    rangeDiff: 23,
  },
];

const data = pricePoints.map((point, slot) => ({ ...point, slot }));

export const Forecast = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | number>();
  const selectedPrice = 90;

  // const selectedSlot = data.findIndex((point) => point.time === "10:00");

  /*  function getDate() {
    const date = new Date();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `${hour - 12}:${minute}`;
  }
*/

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
            onClick={(e) => setSelectedSlot(e.activeLabel ?? undefined)}
            margin={{
              top: 20,
              right: 10,
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
              legendType="none"
              isAnimationActive={false}
            />

            <Area
              type="linear"
              dataKey="rangeDiff"
              stackId="range"
              stroke="none"
              fill="#f0f0f8"
              fillOpacity={0.9}
              name="Prices range"
              isAnimationActive={false}
            />

            <ReferenceLine
              y={selectedPrice}
              stroke="#9d9da7"
              strokeDasharray="7 7"
            />

            <ReferenceLine
              x={selectedSlot}
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
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <footer className="price-forecast__footer">
        <span>Forecast generated today, 10:15 AM</span>

        <span>Data sources: ENTSO-E</span>
      </footer>
    </section>
  );
};
