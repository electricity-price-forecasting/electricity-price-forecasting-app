import { Route, Routes } from "react-router-dom";
import "./App.scss";
import { Drivers } from "./components/Drivers";
import { Forecast } from "./components/Forecast";
import { Header } from "./components/Header";
import { Highlights } from "./components/Highlights";
import { Homepage } from "./components/Homepage";
import { useEffect, useState } from "react";
import { getDrivers, getForecast, getHighlights } from "./services/fetchAPI";
import { Bars } from "react-loader-spinner";
import type { DriversData, ForecastData, HighlightsData } from "./types/types";
import { PageNotFound } from "./components/PageNotFound";
// import { Sidebar } from "./components/Sidebar";

export const App = () => {
  const [highlights, setHighlights] = useState<HighlightsData | null>(null);
  const [drivers, setDrivers] = useState<DriversData | null>(null);
  const [forecast, setForecast] = useState<ForecastData[] | null>(null);

  const [isLoading, setIsLoading] = useState(true);

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
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route
        path="/dashboard"
        element={
          <div className="app">
            <Header />

            {isLoading ? (
              <div className="app__loader">
                <Bars color="#0047F4" />
              </div>
            ) : (
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
                    <Forecast rawData={forecast} />
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
            )}
          </div>
        }
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};
