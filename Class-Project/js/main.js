import { destinations, getDestination } from './destinations.js';
import { getWeather } from './weather.js';
import { initNavigation, renderDestinations, renderFavorites, setupSearch } from './ui.js';

initNavigation();

const detailId = new URLSearchParams(location.search).get('id');
const detailView = document.querySelector('#detailView');
const listingView = document.querySelector('#listingView');
if (detailId && detailView) {
  const d = getDestination(detailId);
  if (d) {
    document.title = `${d.name} | Uganda Travel Explorer`;
    detailView.innerHTML = `<a class="back-link" href="destination.html">← Back to destinations</a><div class="detail-hero scenic-placeholder"></div><div class="detail-content"><div><p class="eyebrow">${d.region} · ${d.category.replace('-', ' ')}</p><h1>${d.name}</h1><p class="detail-description">${d.description}</p><div class="rating large">★ ${d.rating} <span>(${d.reviews} reviews)</span></div></div><button class="primary-btn" data-detail-fav="${d.id}">♡ Save Favorite</button></div><div class="detail-grid"><section><h2>Things to explore</h2><ul>${d.attractions.map(x=>`<li>${x}</li>`).join('')}</ul></section><section><h2>Travel tip</h2><p>${d.tips}</p><div class="weather-detail" id="detailWeather">Loading destination weather...</div></section></div>`;
    if (listingView) listingView.style.display='none';
    const favBtn=detailView.querySelector('[data-detail-fav]');
    const saved=JSON.parse(localStorage.getItem('ute-favorites')||'[]').includes(d.id);
    favBtn.textContent=saved?'♥ Saved':'♡ Save Favorite';
    favBtn.addEventListener('click',()=>{let f=JSON.parse(localStorage.getItem('ute-favorites')||'[]');f=f.includes(d.id)?f.filter(x=>x!==d.id):[...f,d.id];localStorage.setItem('ute-favorites',JSON.stringify(f));favBtn.textContent=f.includes(d.id)?'♥ Saved':'♡ Save Favorite';});
    getWeather(d.lat,d.lon).then(w=>{document.querySelector('#detailWeather').innerHTML=`<strong>${Math.round(w.current.temperature_2m)}°C</strong> · ${w.current.relative_humidity_2m}% humidity · ${Math.round(w.current.wind_speed_10m)} km/h wind`;}).catch(()=>document.querySelector('#detailWeather').textContent='Weather temporarily unavailable.');
  } else { detailView.innerHTML='<div class="empty-state"><h3>Destination not found</h3><a class="primary-btn" href="destination.html">Browse destinations</a></div>'; if(listingView) listingView.style.display='none'; }
}

const grid = document.querySelector('#destinationGrid');
if (grid && !detailId) {
  const isHome = location.pathname.endsWith('index.html') || location.pathname.endsWith('/');
  const params = new URLSearchParams(location.search);
  const category = params.get('category') || 'all';
  renderDestinations(grid, { limit: isHome ? 4 : null, category });
  setupSearch();
}

const favoriteGrid = document.querySelector('#favoriteGrid');
if (favoriteGrid) renderFavorites(favoriteGrid);

const searchForm = document.querySelector('#searchForm');
if (searchForm) searchForm.addEventListener('submit', e => { e.preventDefault(); const q=document.querySelector('#searchInput').value.trim(); location.href=`destination.html${q?`?q=${encodeURIComponent(q)}`:''}`; });

const headerSearch=document.querySelector('#headerSearch');
if(headerSearch) headerSearch.addEventListener('keydown', e=>{if(e.key==='Enter' && e.target.value.trim()) location.href=`destination.html?q=${encodeURIComponent(e.target.value.trim())}`});

const temp = document.querySelector('#temperature');
if (temp) getWeather(0.3476, 32.5825).then(data => {
  temp.textContent = `${Math.round(data.current.temperature_2m)}°C`;
  document.querySelector('#weatherText').textContent = weatherLabel(data.current.weather_code);
  const days=data.daily?.time||[];
  document.querySelector('#forecast').innerHTML=days.slice(0,5).map((d,i)=>`<div><b>${i===0?'Today':new Date(d).toLocaleDateString('en-US',{weekday:'short'})}</b><span>☁</span><small>${Math.round(data.daily.temperature_2m_max[i])}°/${Math.round(data.daily.temperature_2m_min[i])}°</small></div>`).join('');
}).catch(()=>{document.querySelector('#weatherText').textContent='Weather temporarily unavailable';});

function weatherLabel(code){ if(code===0) return 'Clear sky'; if([1,2,3].includes(code)) return 'Partly cloudy'; if(code>=51&&code<=67) return 'Rain'; if(code>=80&&code<=82) return 'Rain showers'; if(code>=95) return 'Thunderstorm'; return 'Partly cloudy'; }

window.openDestination = id => { location.href=`destination.html?id=${id}`; };
