import { destinations } from './destinations.js';

export function initNavigation(){
 const toggle=document.querySelector('#menuToggle'), nav=document.querySelector('#mainNav');
 if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',open);});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')))}
}
function card(d){const fav=getFavorites().includes(d.id); return `<article class="destination-card"><div class="card-image scenic-placeholder"><button class="favorite-btn ${fav?'saved':''}" data-fav="${d.id}" aria-label="${fav?'Remove':'Save'} ${d.name}">${fav?'♥':'♡'}</button></div><div class="card-body"><h3>${d.short}</h3><strong>${label(d.category)}</strong><p>● ${d.region}</p><div class="rating">★ ${d.rating} <span>(${d.reviews})</span></div><button class="text-link" data-open="${d.id}">View details →</button></div></article>`}
function label(c){return c.split('-').map(x=>x[0].toUpperCase()+x.slice(1)).join(' ')}
export function renderDestinations(el,{limit=null,category='all'}={}){
 const params=new URLSearchParams(location.search), q=(params.get('q')||'').toLowerCase(); let list=destinations.filter(d=>(category==='all'||d.category===category)&&(!q||`${d.name} ${d.region} ${d.category}`.toLowerCase().includes(q)));
 const sort=document.querySelector('#sortFilter'); if(sort) sort.addEventListener('change',()=>{list=[...list].sort((a,b)=>sort.value==='name'?a.name.localeCompare(b.name):b.rating-a.rating); el.innerHTML=list.map(card).join(''); bind(el)});
 el.innerHTML=(limit?list.slice(0,limit):list).map(card).join(''); bind(el);
 if(!list.length) el.innerHTML='<div class="empty-state"><h3>No destinations found</h3><p>Try another search or category.</p></div>';
}
function bind(el){el.querySelectorAll('[data-fav]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();const id=b.dataset.fav;let f=getFavorites();f=f.includes(id)?f.filter(x=>x!==id):[...f,id];localStorage.setItem('ute-favorites',JSON.stringify(f));b.classList.toggle('saved');b.textContent=f.includes(id)?'♥':'♡';}));el.querySelectorAll('[data-open]').forEach(b=>b.addEventListener('click',()=>location.href=`destination.html?id=${b.dataset.open}`));}
function getFavorites(){try{return JSON.parse(localStorage.getItem('ute-favorites'))||[]}catch{return[]}}
export function renderFavorites(el){const f=getFavorites();const list=destinations.filter(d=>f.includes(d.id));el.innerHTML=list.length?list.map(card).join(''):'<div class="empty-state"><h3>No favorites yet</h3><p>Tap ♡ on a destination to save it here.</p><a class="primary-btn" href="destination.html">Explore destinations</a></div>';bind(el)}
export function setupSearch(){const s=document.querySelector('#destinationSearch');if(s){const q=new URLSearchParams(location.search).get('q');if(q)s.value=q;s.addEventListener('input',()=>{const term=s.value.toLowerCase();const cards=[...document.querySelectorAll('.destination-card')];cards.forEach(c=>c.style.display=c.innerText.toLowerCase().includes(term)?'':'none')})}}
