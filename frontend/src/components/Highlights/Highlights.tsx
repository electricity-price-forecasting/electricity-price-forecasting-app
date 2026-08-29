import "./Highlights.scss";
import rateUpIcon from "../../assets/rate-up-icon.svg";
import rateDownIcon from "../../assets/rate-down-icon.svg";

export const Highlights = () => {
  return (
    <div className="highlights">
      <div className="highlights__titleBox">
        <h4 className="highlights__titleBox__title">Today’s Highlights</h4>
      </div>

      <div className="highlights__currentPriceBox">
        <p className="highlights__currentPriceBox__text">Current price</p>

        <div className="highlights__currentPriceBox__priceContainer">
          <h3 className="highlights__currentPriceBox__priceContainer__price">
            €82.40
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
              €74.20
            </h3>
            <p className="highlights__todaysPanelBox__leftContainer__priceContainer__unit">
              /MWh
            </p>
          </div>
        </div>

        <div className="highlights__todaysPanelBox__infoContainer">
          <img
            src={rateUpIcon}
            alt=""
            className="highlights__todaysPanelBox__infoContainer__infoIcon"
          />
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
              €128.50
            </h3>
            <p className="highlights__todaysPanelBox__leftContainer__priceContainer__unit">
              /MWh
            </p>
          </div>
        </div>

        <div className="highlights__todaysPanelBox__infoContainer">
          <img
            src={rateDownIcon}
            alt=""
            className="highlights__todaysPanelBox__infoContainer__infoIcon"
          />
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
              €31.20
            </h3>
            <p className="highlights__todaysPanelBox__leftContainer__priceContainer__unit">
              /MWh
            </p>
          </div>
        </div>

        <div className="highlights__todaysPanelBox__infoContainer">
          <img
            src={rateUpIcon}
            alt=""
            className="highlights__todaysPanelBox__infoContainer__infoIcon"
          />
          <p className="highlights__todaysPanelBox__infoContainer__text">
            vs yesterday
          </p>
        </div>
      </div>
    </div>
  );
};
