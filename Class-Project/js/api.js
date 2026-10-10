async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 9000);
  try {
    const response = await fetch(url, { signal: controller.signal, headers: { Accept: "application/json" } });
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}.`);
    }
    return await response.json();
  } finally {
    window.clearTimeout(timeout);
  }
}

export async function loadDestinations() {
  const response = await fetch("./data/destinations.json");
  if (!response.ok) {
    throw new Error(`Could not load the destination guide (${response.status}).`);
  }
  const destinations = await response.json();
  if (!Array.isArray(destinations) || destinations.length === 0) {
    throw new Error("The destination guide is empty or has an invalid format.");
  }
  return destinations;
}

export async function loadWeather(destination) {
  const params = new URLSearchParams({
    latitude: String(destination.latitude),
    longitude: String(destination.longitude),
    current: "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,weather_code,wind_speed_10m",
    timezone: "auto"
  });
  return fetchJson(`https://api.open-meteo.com/v1/forecast?${params}`);
}

export async function loadCountryInfo() {
  const params = new URLSearchParams({
    fields: "name,capital,region,population,languages,currencies,flags"
  });
  const countries = await fetchJson(`https://restcountries.com/v3.1/alpha/UG?${params}`);
  const country = Array.isArray(countries) ? countries[0] : countries;
  if (!country?.name?.common || !country?.capital?.[0] || !country?.population) {
    throw new Error("The country reference response is missing expected Uganda details.");
  }
  return country;
}
