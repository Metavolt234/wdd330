import { loadCountryInfo, loadDestinations } from "./api.js";
import { renderDestinationDetails, renderDestinations, renderSavedPlaces } from "./destinations.js";
import { loadFavorites, saveFavorites } from "./favorites.js";
import { formatNumber, showToast } from "./ui.js";
import { showWeather } from "./weather.js";

const grid = document.querySelector("#destination-grid");
const resultsCount = document.querySelector("#results-count");
const noResults = document.querySelector("#no-results");
const catalogError = document.querySelector("#catalog-error");
const savedPanel = document.querySelector("#saved-panel");
const dialog = document.querySelector("#destination-dialog");
const dialogContent = document.querySelector("#dialog-content");
const favorites = loadFavorites(showToast);
let destinations = [];
let query = "";
let category = "All";
let sort = "featured";

function renderCatalog() {
  const markup = renderDestinations(destinations, favorites, query, category, sort);
  grid.innerHTML = markup;
  grid.setAttribute("aria-busy", "false");
  noResults.hidden = markup !== "";
  resultsCount.textContent = `${markup ? grid.children.length : 0} ${grid.children.length === 1 ? "place" : "places"} to discover`;
  savedPanel.innerHTML = renderSavedPlaces(destinations, favorites);
  document.querySelector(".saved-count").textContent = String(favorites.size);
  document.querySelector(".saved-count").setAttribute("aria-label", `${favorites.size} saved ${favorites.size === 1 ? "place" : "places"}`);
  populateWeatherSelect();\n  populateTripDestination();
}

function populateWeatherSelect() {
  const select = document.querySelector("#weather-destination");
  const selectedId = select.value;
  select.innerHTML = `<option value="">Select a place</option>${destinations.map((place) => `<option value="${place.id}">${place.name}</option>`).join("")}`;
  if (destinations.some((place) => place.id === selectedId)) select.value = selectedId;
}

function populateTripDestination() {
  const select = document.querySelector("#trip-destination");
  const selectedId = select.value;
  select.innerHTML = `<option value="">Choose a place</option>${destinations.map((place) => `<option value="${place.id}">${escapeHtml(place.name)}</option>`).join("")}`;
  if (destinations.some((place) => place.id === selectedId)) select.value = selectedId;
}

function openDestinationDetails(destination) {
  dialogContent.innerHTML = renderDestinationDetails(destination, favorites.has(destination.id));
  dialog.showModal();
  const weatherPanel = dialogContent.querySelector("[data-destination-weather]");
  if (weatherPanel) showWeather(destination, weatherPanel);
}

function toggleFavorite(id) {
  const destination = destinations.find((place) => place.id === id);
  if (!destination) return;
  const wasSaved = favorites.has(id);
  if (wasSaved) favorites.delete(id);
  else favorites.add(id);

  try {
    saveFavorites(favorites);
  } catch (error) {
    if (wasSaved) favorites.add(id);
    else favorites.delete(id);
    showToast(`Your saved places could not be updated: ${error.message}`);
  }
  renderCatalog();
  if (dialog.open) {
    dialogContent.innerHTML = renderDestinationDetails(destination, favorites.has(id));\n    const weatherPanel = dialogContent.querySelector("[data-destination-weather]");\n    if (weatherPanel) showWeather(destination, weatherPanel);
  }
}

function showCountry(country) {
  const facts = document.querySelector("#country-facts");
  const languages = Object.values(country.languages ?? {});
  const currency = Object.values(country.currencies ?? {})[0]?.name ?? "Not listed";
  facts.innerHTML = `
    <div class="country-fact"><strong>${country.capital[0]}</strong><span>CAPITAL</span></div>
    <div class="country-fact"><strong>${escapeHtml(languages.slice(0, 2).join(", ") || "—")}</strong><span>LANGUAGES</span></div>
    <div class="country-fact"><strong>${escapeHtml(currency)}</strong><span>CURRENCY</span></div>`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[character]);
}

async function start() {
  try {
    destinations = await loadDestinations();
    let removedUnavailablePlaces = false;
    for (const savedId of favorites) {
      if (!destinations.some((destination) => destination.id === savedId)) {
        favorites.delete(savedId);
        removedUnavailablePlaces = true;
      }
    }
    if (removedUnavailablePlaces) {
      try {
        saveFavorites(favorites);
      } catch (error) {
        showToast(`Some saved places no longer exist, but could not be removed from browser storage: ${error.message}`);
      }
    }
    renderCatalog();
    catalogError.hidden = true;
  } catch (error) {
    grid.setAttribute("aria-busy", "false");
    resultsCount.textContent = "Destination guide unavailable";
    catalogError.hidden = false;
    showToast(error.message);
  }
}

document.querySelector("#hero-search").addEventListener("submit", (event) => {
  event.preventDefault();
  query = document.querySelector("#hero-search-input").value;
  renderCatalog();
  document.querySelector("#destinations").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#hero-search-input").addEventListener("input", (event) => {
  query = event.currentTarget.value;
  if (destinations.length) renderCatalog();
});

document.querySelectorAll(".category-chip").forEach((chip) => {
  chip.addEventListener("click", () => {
    category = chip.dataset.category;
    document.querySelectorAll(".category-chip").forEach((button) => {
      const isActive = button === chip;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
    renderCatalog();
  });
});

document.querySelector("#sort-destinations").addEventListener("change", (event) => {
  sort = event.currentTarget.value;
  renderCatalog();
});

document.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.favorite);
    return;
  }
  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) {
    const destination = destinations.find((place) => place.id === detailsButton.dataset.details);
    if (!destination) return;
    openDestinationDetails(destination);
  }
});

document.querySelector(".dialog-close").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

const menuToggle = document.querySelector(".menu-toggle");
const mainNav = document.querySelector("#main-nav");
menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
});
mainNav.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
  }
});

document.querySelector("#weather-submit").addEventListener("click", () => {
  const selected = destinations.find((place) => place.id === document.querySelector("#weather-destination").value);
  const result = document.querySelector("#weather-result");
  if (!selected) {
    result.innerHTML = `<p class="weather-error" role="alert">Choose a destination to check its weather.</p>`;
    return;
  }
  showWeather(selected, result);
});

document.querySelector("#retry-catalog").addEventListener("click", start);

loadCountryInfo()
  .then(showCountry)
  .catch((error) => {
    document.querySelector("#country-facts").hidden = true;
    document.querySelector("#country-error").hidden = false;
    showToast(`Live country details are unavailable: ${error.message}`);
  });

start();

// Trip planner validates the selected place and dates, then prepares a local trip summary.
const tripForm = document.querySelector("#trip-form");
tripForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(tripForm);
  const start = String(formData.get("start"));
  const end = String(formData.get("end"));
  const feedback = document.querySelector("#trip-form-feedback");
  if (end < start) {
    feedback.textContent = "Please choose an end date that is on or after the start date.";
    document.querySelector("#trip-end").setCustomValidity("End date must be on or after start date.");
    document.querySelector("#trip-end").reportValidity();
    return;
  }
  document.querySelector("#trip-end").setCustomValidity("");
  const destination = destinations.find((place) => place.id === formData.get("destination"));
  if (!destination) {
    feedback.textContent = "Please choose a destination.";
    return;
  }
  const summary = {
    name: formData.get("name"),
    email: formData.get("email"),
    destination: destination.name,
    start,
    end,
    interest: formData.get("interest"),
    notes: formData.get("notes"),
    createdAt: new Date().toISOString()
  };
  try {
    const savedPlans = JSON.parse(localStorage.getItem("uganda-travel-plans") || "[]");
    savedPlans.push(summary);
    localStorage.setItem("uganda-travel-plans", JSON.stringify(savedPlans));
    feedback.textContent = `Trip plan created for ${destination.name} (${start} to ${end}) and saved in this browser. This demo form does not send an email or book travel.`;
    tripForm.reset();
  } catch {
    feedback.textContent = "Your plan is ready, but this browser could not save it. Please copy your trip details before leaving.";
  }
});
document.querySelector("#trip-start").min = new Date().toISOString().slice(0, 10);
document.querySelector("#trip-start").addEventListener("change", (event) => {
  const endInput = document.querySelector("#trip-end");
  endInput.min = event.target.value;
  if (endInput.value && endInput.value < event.target.value) endInput.value = event.target.value;
});
