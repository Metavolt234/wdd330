const STORAGE_KEY = "uganda-travel-explorer-favorites";

export function loadFavorites(onError) {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw === null) return new Set();
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.some((id) => typeof id !== "string")) {
      throw new Error("Saved places are not in the expected format.");
    }
    return new Set(parsed);
  } catch (error) {
    onError(`Your saved places could not be read: ${error.message}`);
    return new Set();
  }
}

export function saveFavorites(favorites) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]));
}
