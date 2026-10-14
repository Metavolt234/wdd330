const CATEGORY_LABELS = {
  Wildlife: "Wildlife & safari",
  Nature: "Nature & adventure",
  Culture: "Culture & city"
};

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

export function renderDestinations(destinations, favorites, query, category, sort) {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const visible = destinations.filter((destination) => {
    const searchable = [destination.name, destination.region, destination.location, destination.description, ...destination.highlights]
      .join(" ")
      .toLocaleLowerCase();
    return (category === "All" || destination.category === category) && searchable.includes(normalizedQuery);
  });

  if (sort === "name") visible.sort((a, b) => a.name.localeCompare(b.name));
  if (sort === "region") visible.sort((a, b) => a.region.localeCompare(b.region) || a.name.localeCompare(b.name));

  return visible.map((destination) => destinationCard(destination, favorites.has(destination.id))).join("");
}

function destinationCard(destination, isFavorite) {
  const name = escapeHtml(destination.name);
  const imageAlt = escapeHtml(destination.imageAlt);
  const imageUrl = escapeHtml(destination.image);
  const category = escapeHtml(CATEGORY_LABELS[destination.category] ?? destination.category);
  const region = escapeHtml(destination.region);
  const description = escapeHtml(destination.description);
  const photoLabel = escapeHtml(destination.photoLabel);
  return `
    <article class="destination-card">
      <div class="card-image-wrap">
        <img class="card-image" src="${imageUrl}" alt="${imageAlt}" loading="lazy">
        <span class="card-category">${category}</span>
        <button class="favorite-button" type="button" data-favorite="${destination.id}" aria-label="${isFavorite ? "Remove" : "Save"} ${name} ${isFavorite ? "from" : "to"} saved places" aria-pressed="${isFavorite}">${isFavorite ? "♥" : "♡"}</button>
        <span class="card-photo-label">${photoLabel}</span>
      </div>
      <div class="card-body">
        <p class="card-location"><span aria-hidden="true">⌖</span> ${region}</p>
        <h3>${name}</h3>
        <p>${description}</p>
        <div class="card-footer">
          <span>${escapeHtml(destination.location)}</span>
          <button type="button" data-details="${destination.id}" aria-label="View details for ${name}">Discover <span aria-hidden="true">→</span></button>
        </div>
      </div>
    </article>`;
}

export function renderSavedPlaces(destinations, favorites) {
  const saved = destinations.filter((destination) => favorites.has(destination.id));
  if (saved.length === 0) {
    return `<div class="saved-empty"><span aria-hidden="true">♡</span><p>Your saved list is waiting for its first adventure. Tap a heart on any destination to add it.</p></div>`;
  }
  return `<div class="saved-list">${saved.map((destination) => `
    <article class="saved-item">
      <img src="${escapeHtml(destination.image)}" alt="" loading="lazy">
      <div><strong>${escapeHtml(destination.name)}</strong><small>${escapeHtml(destination.region)}</small></div>
      <button type="button" data-favorite="${destination.id}" aria-label="Remove ${escapeHtml(destination.name)} from saved places">Remove</button>
    </article>`).join("")}</div>`;
}

export function renderDestinationDetails(destination, isFavorite) {
  const escape = escapeHtml;
  return `
    <img class="dialog-image" src="${escape(destination.image)}" alt="${escape(destination.imageAlt)}">
    <div class="dialog-body">
      <p class="card-location"><span aria-hidden="true">⌖</span> ${escape(destination.location)} · ${escape(destination.region)}</p>
      <h2 id="dialog-title">${escape(destination.name)}</h2>
      <span class="dialog-category">${escape(CATEGORY_LABELS[destination.category] ?? destination.category)}</span>
      <p class="dialog-description">${escape(destination.description)}</p>
      <h3 class="dialog-subheading">A few things to look forward to</h3>
      <div class="dialog-tags">${destination.highlights.map((highlight) => `<span>${escape(highlight)}</span>`).join("")}</div>
      <h3 class="dialog-subheading">Weather &amp; climate outlook</h3>\n      <div class="destination-weather weather-result" data-destination-weather="${escape(destination.id)}" aria-live="polite"><p>Loading local weather…</p></div>\n      <h3 class="dialog-subheading">Before you go</h3>
      <p>${escape(destination.tips)}</p>
      <p class="dialog-notice">Conditions and access can change. Check current information with official park authorities and local providers before travelling.</p>
      <div class="dialog-actions"><button class="button" type="button" data-favorite="${destination.id}" aria-pressed="${isFavorite}">${isFavorite ? "♥ Saved to your places" : "♡ Save this place"}</button></div>
    </div>`;
}
