export const FAVORITES_KEY = 'ute-favorites';
export const readFavorites = () => JSON.parse(localStorage.getItem(FAVORITES_KEY) || '[]');
export const saveFavorites = ids => localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
