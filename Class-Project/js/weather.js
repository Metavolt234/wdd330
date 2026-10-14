import { loadWeather } from "./api.js";
import { getWeatherDescription } from "./ui.js";

export async function showWeather(destination, resultElement) {
  resultElement.innerHTML = `<p class="weather-loading" role="status">Checking the latest available conditions for ${destination.name}…</p>`;
  try {
    const response = await loadWeather(destination);
    const current = response.current;
    if (!current || typeof current.temperature_2m !== "number" || typeof current.weather_code !== "number") {
      throw new Error("The forecast response did not include current conditions.");
    }
    const time = current.time ? new Date(current.time).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "latest available";
    resultElement.innerHTML = `
      <span class="weather-placeholder-icon" aria-hidden="true">☼</span>
      <p><strong>${Math.round(current.temperature_2m)}°C</strong> ${getWeatherDescription(current.weather_code)} in ${destination.name}
        <span class="weather-detail">Feels like ${Math.round(current.apparent_temperature)}°C · Wind ${Math.round(current.wind_speed_10m)} km/h · Updated ${time}</span>
      </p>`;
  } catch (error) {
    const message = error.name === "AbortError"
      ? "The weather request took too long. Please try again."
      : "Weather is temporarily unavailable. Please check your connection and try again.";
    resultElement.innerHTML = `<p class="weather-error" role="alert">${message}</p>`;
  }
}
