const BASE_URL = "http://localhost:5173/api";

const DRIVERS = "/drivers.json";
const HIGHLIGHTS = "/highlights.json";
const FORECAST = "/forecast.json";

export function getDrivers() {
  return fetch(BASE_URL + DRIVERS).then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  });
}

export function getHighlights() {
  return fetch(BASE_URL + HIGHLIGHTS).then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  });
}

export function getForecast() {
  return fetch(BASE_URL + FORECAST).then((response) => {
    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    return response.json();
  });
}
