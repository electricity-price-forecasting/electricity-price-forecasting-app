import "./Drivers.scss";
import blueArrowRightIcon from "../../assets/blue-arrow-right-icon.svg";
import windIcon from "../../assets/wind-with-background-icon.svg";
import arrowIcon from "../../assets/solar-arrow-right-linear.svg";
import rateGreenIcon from "../../assets/rate-green.svg";
import rateRedThreeIcon from "../../assets/rate-red-3.svg";
import rateRedFiveIcon from "../../assets/rate-red-5.svg";
import sunIcon from "../../assets/sun-with-background-icon.svg";
import peopleIcon from "../../assets/people-background-icon.svg";
import gasIcon from "../../assets/gas-background.svg";

export const Drivers = () => {
  return (
    <div className="drivers">
      <div className="drivers__textBox">
        <div className="drivers__textBox__titleBox">
          <h4 className="drivers__textBox__titleBox__title">Price Drivers</h4>
          <p className="drivers__textBox__titleBox__text">
            Prices are expected to fall by 12% tomorrow
          </p>
        </div>

        <button className="drivers__textBox__button">
          View detailed drivers
          <img src={blueArrowRightIcon} alt="" />
        </button>
      </div>

      <div className="drivers__infoPanel">
        <div className="drivers__infoPanel__textContainer">
          <img
            src={windIcon}
            alt=""
            className="drivers__infoPanel__textContainer__icon"
          />

          <div className="drivers__infoPanel__textContainer__textBox">
            <p className="drivers__infoPanel__textContainer__textBox__mainText">
              Wind Generation
            </p>
            <p className="drivers__infoPanel__textContainer__textBox__secondaryText">
              Strong downward pressure
            </p>
          </div>
        </div>

        <div className="drivers__infoPanel__infoBox">
          <div className="drivers__infoPanel__infoBox__unitsBox">
            <p className="drivers__infoPanel__infoBox__unitsBox__text">12 GW</p>
            <img
              src={arrowIcon}
              alt=""
              className="drivers__infoPanel__infoBox__unitsBox__arrow"
            />
            <p className="drivers__infoPanel__infoBox__unitsBox__text">21 GW</p>
          </div>

          <img
            src={rateGreenIcon}
            alt=""
            className="drivers__infoPanel__infoBox__rate"
          />
        </div>
      </div>

      <div className="drivers__infoPanel">
        <div className="drivers__infoPanel__textContainer">
          <img
            src={sunIcon}
            alt=""
            className="drivers__infoPanel__textContainer__icon"
          />

          <div className="drivers__infoPanel__textContainer__textBox">
            <p className="drivers__infoPanel__textContainer__textBox__mainText">
              Solar Generation
            </p>
            <p className="drivers__infoPanel__textContainer__textBox__secondaryText">
              Downward pressure
            </p>
          </div>
        </div>

        <div className="drivers__infoPanel__infoBox">
          <div className="drivers__infoPanel__infoBox__unitsBox">
            <p className="drivers__infoPanel__infoBox__unitsBox__text">12 GW</p>
            <img
              src={arrowIcon}
              alt=""
              className="drivers__infoPanel__infoBox__unitsBox__arrow"
            />
            <p className="drivers__infoPanel__infoBox__unitsBox__text">21 GW</p>
          </div>

          <img
            src={rateGreenIcon}
            alt=""
            className="drivers__infoPanel__infoBox__rate"
          />
        </div>
      </div>

      <div className="drivers__infoPanel">
        <div className="drivers__infoPanel__textContainer">
          <img
            src={peopleIcon}
            alt=""
            className="drivers__infoPanel__textContainer__icon"
          />

          <div className="drivers__infoPanel__textContainer__textBox">
            <p className="drivers__infoPanel__textContainer__textBox__mainText">
              Electricity Demand
            </p>
            <p className="drivers__infoPanel__textContainer__textBox__secondaryText">
              Moderate demand
            </p>
          </div>
        </div>

        <div className="drivers__infoPanel__infoBox">
          <div className="drivers__infoPanel__infoBox__unitsBox">
            <p className="drivers__infoPanel__infoBox__unitsBox__text">38 GW</p>
            <img
              src={arrowIcon}
              alt=""
              className="drivers__infoPanel__infoBox__unitsBox__arrow"
            />
            <p className="drivers__infoPanel__infoBox__unitsBox__text">42 GW</p>
          </div>

          <img
            src={rateRedThreeIcon}
            alt=""
            className="drivers__infoPanel__infoBox__rate"
          />
        </div>
      </div>

      <div className="drivers__infoPanel">
        <div className="drivers__infoPanel__textContainer">
          <img
            src={gasIcon}
            alt=""
            className="drivers__infoPanel__textContainer__icon"
          />

          <div className="drivers__infoPanel__textContainer__textBox">
            <p className="drivers__infoPanel__textContainer__textBox__mainText">
              Gas Prices
            </p>
            <p className="drivers__infoPanel__textContainer__textBox__secondaryText">
              High cost pressure
            </p>
          </div>
        </div>

        <div className="drivers__infoPanel__infoBox">
          <div className="drivers__infoPanel__infoBox__unitsBox">
            <p className="drivers__infoPanel__infoBox__unitsBox__text">+8%</p>
          </div>

          <img
            src={rateRedFiveIcon}
            alt=""
            className="drivers__infoPanel__infoBox__rate"
          />
        </div>
      </div>
    </div>
  );
};
