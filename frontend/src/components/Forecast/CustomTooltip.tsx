import type { PricePoint } from "../../types/types";
import "./Forecast.scss";

type TooltipProps = {
  active?: boolean;
  payload?: {
    value?: number;
    dataKey?: string;
    payload?: PricePoint;
  }[];
  label?: number;
};

export function CustomTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const priceItem = payload.find(
    (item) => item.dataKey === "actual" || item.dataKey === "forecast",
  );
  const time = priceItem?.payload?.time.trim();

  if (!priceItem?.value) {
    return null;
  }

  return (
    <div className="price-chart__tooltip">
      <p className="price-chart__tooltip-date">28 Jul 2026 at {time}</p>

      <div className="price-chart__tooltip__container">
        <p className="price-chart__tooltip__container__price">
          €{priceItem.value.toFixed(2)}
        </p>
        <p className="price-chart__tooltip__container__unit">/MWh</p>
      </div>
    </div>
  );
}
