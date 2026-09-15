import { useEffect, useState } from "react";
import {
  getDrivers,
  getForecast,
  getHighlights,
} from "../../services/fetchAPI";
import { Drivers } from "./Drivers";
import { Forecast } from "./Forecast";
import { Header } from "./Header";
import { Highlights } from "./Highlights";
import "./Dashboard.scss";
import type {
  DriversData,
  ForecastData,
  HighlightsData,
} from "../../types/types";
import { Bars } from "react-loader-spinner";
// import { Sidebar } from "./Sidebar";

export const Dashboard = () => {
  const [highlights, setHighlights] = useState<HighlightsData | null>(null);
  const [drivers, setDrivers] = useState<DriversData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  const [forecastLoadedAt, setForecastLoadedAt] = useState<Date>(new Date());
  const [updatedAt, setUpdatedAt] = useState(new Date());

  useEffect(() => {
    Promise.allSettled([getHighlights(), getDrivers(), getForecast()])
      .then(([highlightsResult, driversResult, forecastResult]) => {
        if (highlightsResult.status === "fulfilled") {
          setHighlights(highlightsResult.value);
        }

        if (driversResult.status === "fulfilled") {
          setDrivers(driversResult.value);
        }

        if (forecastResult.status === "fulfilled") {
          setForecast(forecastResult.value);
          setForecastLoadedAt(new Date());
        }
      })
      .finally(() => {
        setTimeout(() => setIsLoading(false), 2000);
      });
  }, [updatedAt]);

  const reload = () => {
    setIsLoading(true);
    setUpdatedAt(new Date());
  };

  return (
    <div className="app">
      <Header />

      {isLoading && (
        <div className="app__loader-overlay">
          <div className="app__loader-overlay__loader">
            <Bars color="#0047F4" />
          </div>
        </div>
      )}
      <div className="app__body">
        {/*<Sidebar />*/}

        <main className="app__body__content">
          {highlights !== null ? (
            <Highlights highlights={highlights} />
          ) : (
            <div className="app__body__content__errorBox highlight">
              Unable to load Highlights
              <button
                onClick={() => reload()}
                className="app__body__content__errorBox__reloadBtn"
              >
                Reload
              </button>
            </div>
          )}

          {drivers !== null ? (
            <Drivers drivers={drivers} />
          ) : (
            <div className="app__body__content__errorBox price-drivers">
              Unable to load Price Drivers
              <button
                onClick={() => reload()}
                className="app__body__content__errorBox__reloadBtn"
              >
                Reload
              </button>
            </div>
          )}

          {forecast !== null ? (
            <Forecast rawData={forecast} loadedAt={forecastLoadedAt} />
          ) : (
            <div className="app__body__content__errorBox chart">
              Unable to load Forecast
              <button
                onClick={() => reload()}
                className="app__body__content__errorBox__reloadBtn"
              >
                Reload
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
