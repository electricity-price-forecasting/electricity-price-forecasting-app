const BASE_URL = "http://localhost:5173/api/drivers.json";

export function getDrivers() {
  return fetch(BASE_URL).then((response) => {
    if (!response.ok) {
      return;
    }

    return response.json();
  });
}
