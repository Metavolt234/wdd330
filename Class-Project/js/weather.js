import { loadWeather } from "./api.js";
import { getWeatherDescription } from "./ui.js";

function safe(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

export async function showWeather(destination, resultElement) {
  resultElement.innerHTML = `<p class="weather-loading" role="status">Loading current conditions and a 7-day forecast for ${safe(destination.name)}…</p>`;
  try {
    const response = await loadWeather(destination);
    const current = response.current;
    if (!current || typeof current.temperature_2m !== "number" || typeof current.weather_code !== "number") {
      throw new Error("Forecast response did not include current conditions.");
    }
    const time = current.time ? new Date(current.time).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "latest available";
    const daily = response.daily;
    const forecast = daily?.time?.map((day, index) => `
      <div class="forecast-day">
        <span>${new Date(`${day}T12:00:00`).toLocaleDateString(undefined, { weekday: "short", day: "numeric" })}</span>
        <strong>${Math.round(daily.temperature_2m_max[index])}° / ${Math.round(daily.temperature_2m_min[index])}°</strong>
        <small>${getWeatherDescription(daily.weather_code[index])}</small>
        <small>Rain chance: ${daily.precipitation_probability_max?.[index] ?? "—"}%</small>
      </div>`).join("") ?? "";
    resultElement.innerHTML = `
      <div class="weather-current">
        <span class="weather-placeholder-icon" aria-hidden="true">☼</span>
        <p><strong>${Math.round(current.temperature_2m)}°C</strong> ${getWeatherDescription(current.weather_code)} in ${safe(destination.name)}
          <span class="weather-detail">Feels like ${Math.round(current.apparent_temperature)}°C · Humidity ${Math.round(current.relative_humidity_2m)}% · Wind ${Math.round(current.wind_speed_10m)} km/h · Updated ${safe(time)}</span>
        </p>
      </div>
      <h3 class="forecast-heading">7-day weather forecast</h3>
      <div class="forecast-grid">${forecast || "<p>Forecast data is not available for this place.</p>"}</div>
      <p class="climate-note"><strong>Climate-change note:</strong> This is a short-range weather forecast, not a long-term climate prediction. Changing rainfall patterns, heat and extreme weather can affect travel conditions. Recheck before travelling and follow local/park guidance.</p>`;
  } catch (error) {
    const message = error.name === "AbortError"
      ? "The weather request took too long. Please try again."
      : "Weather is temporarily unavailable. Check your connection and try again.";
    resultElement.innerHTML = `<p class="weather-error" role="alert">${message}</p>`;
  }
}
