import "./Highlights.scss";
import type { HighlightsData } from "../../../types/types";

type Props = {
  highlights: HighlightsData;
};

const trendIndicators = {
  up: { path: "M8 13V3M4 7L8 3L12 7", label: "Price increased" },
  down: { path: "M8 3V13M4 9L8 13L12 9", label: "Price decreased" },
  neutral: { path: "M3 8H13", label: "Price unchanged" },
};

const PriceChange = ({
  trend,
  change_text,
}: HighlightsData["today_average"]) => {
  const direction = trend === "up" || trend === "down" ? trend : "neutral";
  const indicator = trendIndicators[direction];

  return (
    <div className={`highlights__priceChange highlights__priceChange--${direction}`}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        role="img"
        aria-label={indicator.label}
      >
        <path d={indicator.path} />
      </svg>
      <p>{change_text}</p>
    </div>
  );
};

export const Highlights: React.FC<Props> = ({ highlights }) => {
  return (
    <div className="highlights">
      <div className="highlights__titleBox">
        <h4 className="highlights__titleBox__title">Today’s Highlights</h4>
      </div>

      <div className="highlights__currentPriceBox">
        <p className="highlights__currentPriceBox__text">Current price</p>

        <div className="highlights__currentPriceBox__priceContainer">
          <h3 className="highlights__currentPriceBox__priceContainer__price">
            €{highlights?.current_price.toFixed(2)}
          </h3>
          <p className="highlights__currentPriceBox__priceContainer__unit">
            /MWh
          </p>
        </div>
      </div>

      <div className="highlights__todaysPanelBox">
        <div className="highlights__todaysPanelBox__leftContainer">
          <p className="highlights__todaysPanelBox__leftContainer__text">
            Today’s Average
          </p>

          <div className="highlights__todaysPanelBox__leftContainer__priceContainer">
            <h3 className="highlights__todaysPanelBox__leftContainer__priceContainer__price">
              €{highlights?.today_average.value.toFixed(2)}
            </h3>
            <p className="highlights__todaysPanelBox__leftContainer__priceContainer__unit">
              /MWh
            </p>
          </div>
        </div>

        <div className="highlights__todaysPanelBox__infoContainer">
          <PriceChange {...highlights.today_average} />

          <p className="highlights__todaysPanelBox__infoContainer__text">
            vs yesterday
          </p>
        </div>
      </div>

      <div className="highlights__todaysPanelBox">
        <div className="highlights__todaysPanelBox__leftContainer">
          <p className="highlights__todaysPanelBox__leftContainer__text">
            Today’s Peak
          </p>

          <div className="highlights__todaysPanelBox__leftContainer__priceContainer">
            <h3 className="highlights__todaysPanelBox__leftContainer__priceContainer__price">
              €{highlights?.today_peak.value.toFixed(2)}
            </h3>
            <p className="highlights__todaysPanelBox__leftContainer__priceContainer__unit">
              /MWh
            </p>
          </div>
        </div>

        <div className="highlights__todaysPanelBox__infoContainer">
          <PriceChange {...highlights.today_peak} />
          <p className="highlights__todaysPanelBox__infoContainer__text">
            vs yesterday
          </p>
        </div>
      </div>

      <div className="highlights__todaysPanelBox">
        <div className="highlights__todaysPanelBox__leftContainer">
          <p className="highlights__todaysPanelBox__leftContainer__text">
            Today’s Low
          </p>

          <div className="highlights__todaysPanelBox__leftContainer__priceContainer">
            <h3 className="highlights__todaysPanelBox__leftContainer__priceContainer__price">
              €{highlights?.today_low.value.toFixed(2)}
            </h3>
            <p className="highlights__todaysPanelBox__leftContainer__priceContainer__unit">
              /MWh
            </p>
          </div>
        </div>

        <div className="highlights__todaysPanelBox__infoContainer">
          <PriceChange {...highlights.today_low} />
          <p className="highlights__todaysPanelBox__infoContainer__text">
            vs yesterday
          </p>
        </div>
      </div>
    </div>
  );
};
