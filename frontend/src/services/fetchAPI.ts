const BASE_URL_DRIVERS = "http://localhost:5173/api/drivers.json";
const BASE_URL_HIGHLIGHTS = "http://localhost:5173/api/highlights.json";
const BASE_URL_FORECAST = "http://localhost:5173/api/forecast.json";

export function getDrivers() {
  return fetch(BASE_URL_DRIVERS).then((response) => {
    if (!response.ok) {
      return;
    }

    return response.json();
  });
}

export function getHighlights() {
  return fetch(BASE_URL_HIGHLIGHTS).then((response) => {
    if (!response.ok) {
      return;
    }

    return response.json();
  });
}

export function getForecast() {
  return fetch(BASE_URL_FORECAST).then((response) => {
    if (!response.ok) {
      return;
    }

    return response.json();
  });
}
