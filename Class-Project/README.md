# Uganda Travel Explorer

A responsive, browser-based guide to places to explore in Uganda. It was built from the supplied project proposal and uses a local destination catalogue, Open-Meteo for live weather, and REST Countries for Uganda reference details.

## Run the website

The site uses JavaScript modules and fetches its local JSON catalogue, so open it through a local web server rather than opening `index.html` directly.

### Option 1: Python

1. Install Python 3 if it is not already installed.
2. Open a terminal in this project folder.
3. Run:

   ```powershell
   py -m http.server 8000
   ```

4. Visit <http://localhost:8000> in a browser.
5. Stop the local server with **Ctrl+C** in the terminal.

If the port is already in use, run `py -m http.server 8001` and visit <http://localhost:8001> instead. If the `py` launcher is not available, use `python -m http.server 8000` instead.

### Option 2: Visual Studio Code

1. Open this folder in Visual Studio Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html` and select **Open with Live Server**.

## Use the explorer

- Search by destination name, region, district, description or experience.
- Filter the guide by wildlife, nature or culture.
- Change the destination sort order.
- Select **Discover** on a card to see highlights and practical planning notes.
- Tap the heart to save or remove a place. Saved places are kept in this browser on this device.
- Choose a destination in the weather section to request its current conditions.
- Use the navigation to return to the guide, open saved places, or read about Uganda.

## Project structure

```text
index.html                 Main discovery page and accessible destination dialog
css/styles.css             Visual identity, layout and component styles
css/responsive.css         Tablet, mobile and reduced-motion adjustments
js/main.js                 Application startup and shared page behaviour
js/api.js                  Destination data, weather and country API requests
js/destinations.js         Destination search, filtering and rendering
js/favorites.js            Browser storage for saved destinations
js/weather.js              Weather display and request states
js/ui.js                   Shared interface helpers and weather descriptions
data/destinations.json     Local Uganda destination catalogue
```

## Data and service notes

- Destinations and coordinates are stored locally in `data/destinations.json`; the core guide does not depend on a remote destination service.
- Weather uses the Open-Meteo Forecast API. An internet connection is needed for weather, and current conditions are shown when that endpoint responds.
- Country reference details use the REST Countries API and are optional; the guide remains usable if that service is unavailable.
- Destination photographs and the display fonts are loaded from Unsplash and Google Fonts. The layout includes neutral background colours if an image cannot load.
- Service availability, park access, permits, prices and travel conditions can change. Confirm current information with the Uganda Wildlife Authority, Uganda Tourism Board and local providers before travelling.
- The sample catalogue is a discovery aid, not an official or exhaustive register of destinations. Check each entry and image attribution/usage requirements before public deployment.

## Updating destinations

Edit `data/destinations.json` to add or revise entries. Each destination needs a unique `id`, `name`, `category` (`Wildlife`, `Nature` or `Culture`), `region`, `location`, `description`, `image`, `imageAlt`, `photoLabel`, numeric `latitude` and `longitude`, a `highlights` array, and a practical `tips` note. Use accurate coordinates so the weather lookup corresponds to the destination.

## Before deployment

1. Verify destination descriptions, boundaries, coordinates, park names, access notes and all travel advice with authoritative Ugandan sources.
2. Confirm photo rights and attribution requirements for every image.
3. Test the experience on current mobile and desktop browsers, including keyboard navigation and reduced-motion settings.
4. Test offline/API-failure states and favourite persistence in a private window.
5. Host the static files on a static web host using HTTPS. No API keys or build step are required.
