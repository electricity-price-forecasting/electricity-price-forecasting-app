const BASE_URL = "http://localhost:5173/api/highlights.json";

export function getHighlights() {
  return fetch(BASE_URL).then((response) => {
    if (!response.ok) {
      return;
    }

    return response.json();
  });
}
