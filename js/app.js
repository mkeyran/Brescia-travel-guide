// Brescia on Foot — a hand-picked walking guide.
//
// The guide (picks and walks) is in picks.mjs; the build locates each pick
// and routes the walks into data/picks.json. CAI trails and drinking water
// are optional OpenStreetMap extras. If the built data is missing (Pages
// serving the raw branch), the same lookups run in the browser.

import { checkOverpassResponse, placesQuery, trailsQuery, transformPlaces, transformTrails } from './osm.mjs';
import { CHECKED, buildWalks, picksQuery, resolvePicks, walkRouteUrl } from './picks.mjs';

const OVERPASS = ['https://overpass-api.de/api/interpreter', 'https://overpass.private.coffee/api/interpreter'];
const LIVE_CACHE = 'live-data-v3';
const LIVE_MAX_AGE_MS = 7 * 24 * 3600 * 1000;

const BRESCIA = [45.5398, 10.2200];
const LIST_LIMIT = 60;
const WALK_LIMIT = 9;

const CATEGORY = {
    walks: { icon: '🚶', label: 'Walks', color: '#22453b' },
    food: { icon: '🧀', label: 'Eat & buy', color: '#c0602b' },
    heritage: { icon: '🏛️', label: 'See', color: '#6d4c9f' },
    nature: { icon: '🌄', label: 'Outdoors', color: '#2e7d4f' },
    trails: { icon: '🥾', label: 'CAI trails', color: '#b23b2e' },
    essentials: { icon: '🚰', label: 'Water & WC', color: '#2a6fb0' }
};

const KIND_ICON = { 'Drinking water': '🚰', 'Public toilet': '🚻' };

// CAI hiking difficulty scale used on Italian trails.
const DIFFICULTY = {
    T: { label: 'T — tourist path', hint: 'Easy, clear paths and tracks.', color: '#2e7d32' },
    E: { label: 'E — hiking trail', hint: 'Marked footpaths, some uneven or steep ground. Proper shoes.', color: '#d84315' },
    EE: { label: 'EE — expert hikers', hint: 'Exposed or rough terrain. Experience needed.', color: '#6a1b9a' },
    EEA: { label: 'EEA — equipped route', hint: 'Via ferrata gear required.', color: '#212121' }
};
const DEFAULT_TRAIL_COLOR = '#b23b2e';

const state = {
    places: [],      // located picks + OSM water/WC
    unlocated: [],   // picks the build couldn't place on the map
    walks: [],
    trails: [],
    meta: null,
    enabled: new Set(['walks', 'food', 'heritage', 'nature']),
    search: '',
    user: null,
    watchId: null,
    firstFix: false,
    walk: loadWalk(),
    view: 'list',
    selected: null
};

let map, userDot, userAccuracy, myWalkLayer, trailLayer, walksLayer, stopLayer;
const clusters = {};
const placeMarkers = new Map();
const trailLines = new Map();
const walkLines = new Map();

// ==================== STARTUP ====================

init();

async function init() {
    initMap();
    bindUi();
    registerServiceWorker();
    try {
        const data = await loadData();
        const picks = data.picks.map(p => ({ ...p, pick: true }));
        state.places = [...picks.filter(p => p.lat != null), ...data.places.filter(p => p.category === 'essentials')];
        state.unlocated = picks.filter(p => p.lat == null);
        state.walks = data.walks;
        state.trails = data.trails;
        state.meta = data.meta;
    } catch (err) {
        console.error(err);
        setPanelTitle('The guide could not be loaded');
        el('panelBody').innerHTML = `<p class="empty">Could not load the guide (${esc(err.message)}). Check your connection and reload.</p>
            <button class="btn primary" onclick="location.reload()">Reload</button>`;
        return;
    }
    buildLayers();
    applyFilters();
    renderMyWalkLayer();
    openFromHash();
}

async function fetchJson(url, options) {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    return res.json();
}

async function loadData() {
    try {
        const [meta, guide, places, trails] = await Promise.all([
            fetchJson('data/meta.json'),
            fetchJson('data/picks.json'),
            fetchJson('data/places.json'),
            fetchJson('data/trails.json')
        ]);
        return { meta, picks: guide.picks, walks: guide.walks, places, trails };
    } catch (err) {
        console.warn('Built data not available, looking things up live', err);
    }

    const cache = 'caches' in window ? await caches.open(LIVE_CACHE).catch(() => null) : null;
    const cached = await cache?.match('live.json');
    const saved = cached ? await cached.json() : null;
    if (saved && Date.now() - new Date(saved.meta.builtAt) < LIVE_MAX_AGE_MS) return saved;

    setPanelTitle('Preparing the map…');
    el('panelBody').innerHTML = `<p class="empty">Placing the picks on the map. The first visit can take up to a minute; after that everything is stored on your phone.</p>`;
    try {
        const [picksJson, placesJson, trailsJson] = await Promise.all([
            overpass(picksQuery()), overpass(placesQuery()), overpass(trailsQuery())
        ]);
        const picks = resolvePicks(picksJson);
        const routes = {};
        const byId = Object.fromEntries(picks.map(p => [p.id, p]));
        await Promise.all(buildWalks(picks).map(async w => {
            try {
                const json = await fetchJson(walkRouteUrl(w.stops.map(id => [byId[id].lat, byId[id].lng])));
                const r = json.routes[0];
                routes[w.id] = { path: r.geometry.coordinates.map(([lng, lat]) => [lat, lng]), distance: r.distance, duration: r.duration };
            } catch (e) {
                console.warn('Routing failed', w.id, e);
            }
        }));
        const data = {
            meta: { builtAt: new Date().toISOString(), picksChecked: CHECKED, source: 'Hand-picked; located live in your browser' },
            picks,
            walks: buildWalks(picks, routes),
            places: transformPlaces(placesJson).filter(p => p.category === 'essentials'),
            trails: transformTrails(trailsJson)
        };
        await cache?.put('live.json', new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } }));
        return data;
    } catch (err) {
        if (saved) return saved;
        throw err;
    }
}

async function overpass(query) {
    let lastError;
    for (const url of OVERPASS) {
        try {
            return checkOverpassResponse(await fetchJson(url, { method: 'POST', body: new URLSearchParams({ data: query }) }));
        } catch (err) {
            lastError = err;
        }
    }
    throw lastError;
}

function initMap() {
    map = L.map('map', { zoomControl: false }).setView(BRESCIA, 14);
    L.control.zoom({ position: 'topright' }).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    L.control.scale({ imperial: false, position: 'bottomleft' }).addTo(map);

    trailLayer = L.layerGroup().addTo(map);
    walksLayer = L.layerGroup().addTo(map);
    stopLayer = L.layerGroup().addTo(map);
    myWalkLayer = L.layerGroup().addTo(map);
    map.on('moveend', debounce(renderList, 150));
}

function buildLayers() {
    for (const cat of ['food', 'heritage', 'nature', 'essentials']) {
        clusters[cat] = L.markerClusterGroup({
            disableClusteringAtZoom: cat === 'essentials' ? 17 : 14,
            maxClusterRadius: 40,
            showCoverageOnHover: false,
            iconCreateFunction: c => L.divIcon({
                html: `<div class="cluster" style="background:${CATEGORY[cat].color}">${c.getChildCount()}</div>`,
                className: 'cluster-wrap',
                iconSize: [36, 36]
            })
        }).addTo(map);
    }

    for (const p of state.places) {
        const size = p.pick ? 36 : 26;
        const marker = L.marker([p.lat, p.lng], {
            icon: L.divIcon({
                className: 'pin-wrap',
                html: `<div class="pin${p.pick ? ' pick' : ''}" style="--c:${CATEGORY[p.category].color}"><span>${iconFor(p)}</span></div>`,
                iconSize: [size, size],
                iconAnchor: [size / 2, size - 2]
            }),
            title: p.name,
            keyboard: true,
            zIndexOffset: p.pick ? 500 : 0
        });
        marker.on('click', () => selectItem(p.id));
        placeMarkers.set(p.id, marker);
    }

    for (const w of state.walks) {
        const points = w.path || walkStopPoints(w);
        if (points.length < 2) continue;
        const line = L.polyline(points, {
            color: CATEGORY.walks.color, weight: w.path ? 5 : 3, opacity: 0.75,
            dashArray: w.path ? null : '1 9', lineCap: 'round'
        });
        const hit = L.polyline(points, { weight: 20, opacity: 0 });
        const group = L.featureGroup([hit, line]).on('click', () => selectItem(w.id));
        walkLines.set(w.id, { group, line });
    }

    for (const t of state.trails) {
        const color = trailColor(t);
        const line = L.polyline(t.segments, { color, weight: 4, opacity: 0.85 });
        const hit = L.polyline(t.segments, { color, weight: 18, opacity: 0 });
        const group = L.featureGroup([hit, line]).on('click', () => selectItem(t.id));
        trailLines.set(t.id, { group, line });
    }
}

function walkStopPoints(w) {
    return w.stops.map(id => state.places.find(p => p.id === id)).filter(Boolean).map(p => [p.lat, p.lng]);
}

// ==================== FILTERING & LIST ====================

function matches(item) {
    if (!state.search) return true;
    const hay = `${item.name} ${item.kind || ''} ${item.why || ''} ${item.pitch || ''} ${item.ref || ''} ${item.address || ''}`.toLowerCase();
    return hay.includes(state.search);
}

function applyFilters() {
    for (const [cat, group] of Object.entries(clusters)) {
        group.clearLayers();
        if (!state.enabled.has(cat)) continue;
        group.addLayers(state.places.filter(p => p.category === cat && matches(p)).map(p => placeMarkers.get(p.id)));
    }
    walksLayer.clearLayers();
    if (state.enabled.has('walks')) {
        for (const w of state.walks) if (walkLines.has(w.id) && matches(w)) walksLayer.addLayer(walkLines.get(w.id).group);
    }
    trailLayer.clearLayers();
    if (state.enabled.has('trails')) {
        for (const t of state.trails) if (matches(t)) trailLayer.addLayer(trailLines.get(t.id).group);
    }
    renderList();
}

// Picks and walks are always listed; OSM extras only when on screen.
function listItems() {
    const bounds = map.getBounds();
    const items = [];
    for (const p of state.places) {
        if (!state.enabled.has(p.category) || !matches(p)) continue;
        if (p.pick || state.search || bounds.contains([p.lat, p.lng])) items.push(p);
    }
    for (const p of state.unlocated) if (state.enabled.has(p.category) && matches(p)) items.push(p);
    if (state.enabled.has('trails')) {
        for (const t of state.trails) {
            if (matches(t) && (state.search || bounds.intersects(trailLines.get(t.id).line.getBounds()))) items.push(t);
        }
    }
    const origin = state.user || [map.getCenter().lat, map.getCenter().lng];
    for (const item of items) item._dist = distanceFrom(origin, item);
    return items.sort((a, b) => (b.pick === true) - (a.pick === true) || a._dist - b._dist);
}

function renderList() {
    if (state.view !== 'list' || !state.meta) return;
    const walks = state.enabled.has('walks') ? state.walks.filter(matches) : [];
    const items = listItems();
    const where = state.user ? 'from you' : 'from map centre';
    const picks = items.filter(i => i.pick).length;
    setPanelTitle(walks.length || items.length
        ? `${walks.length ? `${walks.length} walks · ` : ''}${picks} picks${items.length > picks ? ` · ${items.length - picks} extras` : ''}`
        : 'Nothing matches — change filters or search');

    el('panelBody').innerHTML = `
        ${walks.length ? `<h3 class="section">Walks I'd do</h3>
        <ul class="list">${walks.map(w => `
            <li><button class="row" data-id="${esc(w.id)}">
                <span class="row-icon" style="--c:${CATEGORY.walks.color}">🚶</span>
                <span class="row-text"><strong>${esc(w.name)}</strong>
                <small>${w.distanceKm ? `${w.distanceKm} km · ~${formatMinutes(w.minutes)} walking · ` : ''}${w.stops.length} stops</small></span>
            </button></li>`).join('')}
        </ul>` : ''}
        ${items.length ? `<h3 class="section">Places · nearest first</h3>
        <ul class="list">
            ${items.slice(0, LIST_LIMIT).map(item => `
                <li><button class="row" data-id="${esc(item.id)}">
                    <span class="row-icon" style="--c:${colorFor(item)}">${iconFor(item)}</span>
                    <span class="row-text">
                        <strong>${esc(item.name)}</strong>
                        <small>${esc(subtitleFor(item))}</small>
                    </span>
                    <span class="row-dist">${isFinite(item._dist) ? formatKm(item._dist) : '—'}</span>
                </button></li>`).join('')}
        </ul>
        <p class="hint">Distances are straight-line ${where}.</p>` : ''}`;
}

// ==================== DETAIL ====================

function findItem(id) {
    return state.places.find(p => p.id === id) || state.unlocated.find(p => p.id === id) ||
        state.walks.find(w => w.id === id) || state.trails.find(t => t.id === id);
}

function selectItem(id, { fly = false } = {}) {
    const item = findItem(id);
    if (!item) return;
    state.selected = id;
    state.view = 'detail';
    history.replaceState(null, '', `#${id}`);
    highlight(item);

    if (fly) {
        if (item.stops) fitWalk(item);
        else if (item.segments) map.fitBounds(trailLines.get(id).line.getBounds(), { padding: [40, 40] });
        else if (item.lat != null) map.setView([item.lat, item.lng], Math.max(map.getZoom(), 17));
    }
    if (item.stops) renderWalkDetail(item);
    else if (item.segments) renderTrailDetail(item);
    else renderPlaceDetail(item);
    expandPanel(true);
}

function backToList() {
    highlight(null);
    state.selected = null;
    state.view = 'list';
    history.replaceState(null, '', location.pathname + location.search);
    renderList();
}

function highlight(item) {
    for (const [tid, { line }] of trailLines) {
        const on = item?.id === tid;
        line.setStyle({ weight: on ? 7 : 4, opacity: item?.segments && !on ? 0.45 : 0.85 });
        if (on) line.bringToFront();
    }
    for (const [wid, { line }] of walkLines) {
        const on = item?.id === wid;
        const base = state.walks.find(w => w.id === wid)?.path ? 5 : 3;
        line.setStyle({ weight: on ? base + 2 : base, opacity: item?.stops && !on ? 0.3 : 0.75 });
        if (on) line.bringToFront();
    }
    stopLayer.clearLayers();
    if (item?.stops) {
        item.stops.map(id => state.places.find(p => p.id === id)).filter(Boolean).forEach((p, i) => {
            L.marker([p.lat, p.lng], {
                icon: L.divIcon({ className: 'stop-wrap', html: `<div class="stop walk">${i + 1}</div>`, iconSize: [26, 26], iconAnchor: [-6, 34] }),
                zIndexOffset: 2000, interactive: false
            }).addTo(stopLayer);
        });
    }
}

function fitWalk(w) {
    const points = w.path || walkStopPoints(w);
    if (points.length) map.fitBounds(L.latLngBounds(points), { padding: [40, 40], maxZoom: 17 });
}

function renderPlaceDetail(p) {
    if (!p.pick) return renderExtraDetail(p);
    const inWalk = state.walk.includes(p.id);
    const dist = state.user && p.lat != null ? `<p class="dist">📍 ${formatKm(distanceFrom(state.user, p))} from you (straight line)</p>` : '';
    const directions = p.lat != null ? walkingDirectionsUrl([p.lat, p.lng]) : mapsSearchUrl(p);
    const where = !p.located
        ? `<p class="note">⚠️ I couldn't place this one on the map automatically. Use the address.</p>`
        : p.located.approximate ? `<p class="note">The pin marks the street, not the exact door.</p>` : '';
    const walksWithIt = state.walks.filter(w => w.stops.includes(p.id));

    setPanelTitle(`${p.icon} ${CATEGORY[p.category].label}`);
    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <h2>${esc(p.name)}</h2>
        ${confidenceBadge(p)}
        ${dist}
        <div class="take"><span>My take</span><p>${esc(p.why)}</p>${p.tip ? `<p>💡 ${esc(p.tip)}</p>` : ''}</div>
        ${p.caution ? `<p class="caution">⏰ ${esc(p.caution)}</p>` : ''}
        <dl class="facts">
            ${p.address ? fact('Address', esc(p.address)) : ''}
            ${walksWithIt.length ? fact('On the walk', walksWithIt.map(w => `<button class="link-btn inline" data-id="${esc(w.id)}">${esc(w.name)}</button>`).join(', ')) : ''}
            ${fact('Sources', p.evidence.map(e => `<a href="${esc(e.url)}" target="_blank" rel="noopener">${esc(e.label)}</a>`).join(' · '))}
        </dl>
        ${where}
        <div class="actions">
            <a class="btn primary" href="${directions}" target="_blank" rel="noopener">🧭 Walking directions</a>
            ${p.lat != null ? `<button class="btn" data-action="toggle-walk" data-id="${esc(p.id)}">${inWalk ? '✓ In my walk' : '➕ Add to my walk'}</button>
            <button class="btn" data-action="zoom" data-id="${esc(p.id)}">🔍 Zoom to</button>` : ''}
        </div>`;
}

function confidenceBadge(p) {
    const month = new Date(`${state.meta?.picksChecked || CHECKED}-01`).toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
    return p.confidence === 'check'
        ? `<p class="badge-line check">Check before you go: the evidence is old or incomplete</p>`
        : `<p class="badge-line ok">✓ Checked against sources, ${esc(month)}</p>`;
}

function renderExtraDetail(p) {
    const inWalk = state.walk.includes(p.id);
    setPanelTitle(`${iconFor(p)} ${p.kind}`);
    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <h2>${esc(p.name)}</h2>
        ${state.user ? `<p class="dist">📍 ${formatKm(distanceFrom(state.user, p))} from you</p>` : ''}
        <dl class="facts">
            ${p.tags?.opening_hours ? fact('Opening hours', esc(p.tags.opening_hours)) : ''}
            ${p.tags?.fee ? fact('Fee', esc(p.tags.fee)) : ''}
            ${p.tags?.drinking_water === 'no' ? fact('Water', 'Not drinkable') : ''}
        </dl>
        <p class="hint">From OpenStreetMap, not checked by me.</p>
        <div class="actions">
            <a class="btn primary" href="${walkingDirectionsUrl([p.lat, p.lng])}" target="_blank" rel="noopener">🧭 Walking directions</a>
            <button class="btn" data-action="toggle-walk" data-id="${esc(p.id)}">${inWalk ? '✓ In my walk' : '➕ Add to my walk'}</button>
            <a class="btn" href="https://www.openstreetmap.org/${esc(p.id)}" target="_blank" rel="noopener">OpenStreetMap</a>
        </div>`;
}

function renderWalkDetail(w) {
    const stops = w.stops.map(id => state.places.find(p => p.id === id)).filter(Boolean);
    setPanelTitle('🚶 Walk');
    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <h2>${esc(w.name)}</h2>
        <p class="badge-line ok">${w.distanceKm ? `${w.distanceKm} km · about ${formatMinutes(w.minutes)} of walking, plus stops` : `${stops.length} stops`}</p>
        <div class="take"><span>Why this walk</span><p>${esc(w.pitch)}</p></div>
        <p class="caution">🗓️ Best: ${esc(w.when)}</p>
        <ol class="stops">
            ${stops.map((p, i) => `
                <li><button class="row" data-id="${esc(p.id)}">
                    <span class="stop small walk">${i + 1}</span>
                    <span class="row-text"><strong>${esc(p.name)}</strong><small>${esc(p.caution || p.address || '')}</small></span>
                </button></li>`).join('')}
        </ol>
        ${w.missing?.length ? `<p class="note">${w.missing.length} stop(s) couldn't be placed on the map and are left out.</p>` : ''}
        ${w.path ? '' : `<p class="note">The dotted line only shows the order of the stops. Use the directions for the actual path.</p>`}
        <div class="actions">
            <a class="btn primary" href="${walkUrl(stops)}" target="_blank" rel="noopener">🧭 Walk it in Google Maps</a>
            <button class="btn" data-action="zoom" data-id="${esc(w.id)}">🔍 Show on map</button>
            ${w.path ? `<button class="btn" data-action="gpx" data-id="${esc(w.id)}">⬇️ GPX</button>` : ''}
        </div>`;
}

function renderTrailDetail(t) {
    const diff = DIFFICULTY[t.difficulty];
    const start = trailEntryPoint(t);
    setPanelTitle('🥾 CAI trail');
    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <h2>${esc(t.name)}</h2>
        ${state.user ? `<p class="dist">📍 Nearest point is ${formatKm(distanceFrom(state.user, t))} from you</p>` : ''}
        <dl class="facts">
            ${t.ref ? fact('Trail number', esc(t.ref)) : ''}
            ${t.from || t.to ? fact('Route', `${esc(t.from || '?')} → ${esc(t.to || '?')}`) : ''}
            ${fact('Length on map', `${t.lengthKm} km${t.clipped ? ' (only the part near Brescia)' : ''}`)}
            ${diff ? fact('Difficulty', `<span class="diff" style="--c:${diff.color}">${esc(diff.label)}</span><br><small>${esc(diff.hint)}</small>`) : ''}
            ${t.operator ? fact('Maintained by', esc(t.operator)) : ''}
        </dl>
        <p class="hint">From OpenStreetMap. Follow the red-and-white marks on the ground.</p>
        <div class="actions">
            <button class="btn primary" data-action="gpx" data-id="${esc(t.id)}">⬇️ Download GPX</button>
            <a class="btn" href="${walkingDirectionsUrl(start)}" target="_blank" rel="noopener">🧭 To the trail</a>
            <button class="btn" data-action="zoom" data-id="${esc(t.id)}">🔍 Whole trail</button>
        </div>`;
}

function fact(label, html) {
    return `<div><dt>${label}</dt><dd>${html}</dd></div>`;
}

// ==================== MY WALK ====================

function loadWalk() {
    try {
        return JSON.parse(localStorage.getItem('walk') || '[]');
    } catch {
        return [];
    }
}

function saveWalk() {
    try { localStorage.setItem('walk', JSON.stringify(state.walk)); } catch { /* private mode */ }
    const count = el('walkCount');
    count.textContent = state.walk.length;
    count.hidden = !state.walk.length;
    renderMyWalkLayer();
}

function toggleWalk(id) {
    if (state.walk.includes(id)) {
        state.walk = state.walk.filter(w => w !== id);
    } else {
        if (state.walk.length >= WALK_LIMIT) return toast(`A walk can have up to ${WALK_LIMIT} stops.`);
        state.walk.push(id);
        toast('Added to your walk');
    }
    saveWalk();
}

function myWalkStops() {
    return state.walk.map(id => state.places.find(p => p.id === id)).filter(Boolean);
}

function renderMyWalkLayer() {
    if (!myWalkLayer) return;
    myWalkLayer.clearLayers();
    myWalkStops().forEach((p, i) => {
        L.marker([p.lat, p.lng], {
            icon: L.divIcon({ className: 'stop-wrap', html: `<div class="stop">${i + 1}</div>`, iconSize: [26, 26], iconAnchor: [32, 34] }),
            zIndexOffset: 1000
        }).on('click', () => selectItem(p.id)).addTo(myWalkLayer);
    });
}

function renderMyWalk() {
    state.view = 'walk';
    highlight(null);
    const stops = myWalkStops();
    setPanelTitle(`📝 My walk · ${stops.length} stop${stops.length === 1 ? '' : 's'}`);
    if (!stops.length) {
        el('panelBody').innerHTML = `
            <button class="link-btn" data-action="back">← Back to list</button>
            <p class="empty">Open any place and tap <b>Add to my walk</b> to build your own route, then open it in Google Maps for walking directions.</p>`;
        return expandPanel(true);
    }
    const points = stops.map(p => [p.lat, p.lng]);
    if (state.user) points.unshift(state.user);
    let km = 0;
    for (let i = 1; i < points.length; i++) km += distanceKm(points[i - 1], points[i]);

    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <ol class="stops">
            ${stops.map((p, i) => `
                <li>
                    <button class="row" data-id="${esc(p.id)}">
                        <span class="stop small">${i + 1}</span>
                        <span class="row-text"><strong>${esc(p.name)}</strong><small>${esc(p.kind || CATEGORY[p.category].label)}</small></span>
                    </button>
                    <span class="stop-tools">
                        <button class="icon-btn" data-action="move" data-id="${esc(p.id)}" data-dir="-1" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>↑</button>
                        <button class="icon-btn" data-action="move" data-id="${esc(p.id)}" data-dir="1" aria-label="Move down" ${i === stops.length - 1 ? 'disabled' : ''}>↓</button>
                        <button class="icon-btn" data-action="toggle-walk" data-id="${esc(p.id)}" aria-label="Remove">✕</button>
                    </span>
                </li>`).join('')}
        </ol>
        <p class="muted">At least ${formatKm(km)}${state.user ? ' from where you are' : ''}, measured in straight lines, so the real walk is longer.</p>
        <div class="actions">
            <a class="btn primary" href="${walkUrl(stops)}" target="_blank" rel="noopener">🧭 Open in Google Maps</a>
            <button class="btn" data-action="fit-mywalk">🔍 Show on map</button>
            <button class="btn" data-action="clear-walk">Clear</button>
        </div>`;
    expandPanel(true);
}

function moveStop(id, dir) {
    const i = state.walk.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= state.walk.length) return;
    [state.walk[i], state.walk[j]] = [state.walk[j], state.walk[i]];
    saveWalk();
    renderMyWalk();
}

function walkUrl(stops) {
    const fmt = p => `${p.lat},${p.lng}`;
    const params = new URLSearchParams({ api: '1', travelmode: 'walking', destination: fmt(stops[stops.length - 1]) });
    const middle = stops.slice(0, -1);
    if (state.user) params.set('origin', state.user.join(','));
    else if (middle.length) params.set('origin', fmt(middle.shift()));
    if (middle.length) params.set('waypoints', middle.map(fmt).join('|'));
    return `https://www.google.com/maps/dir/?${params}`;
}

function walkingDirectionsUrl([lat, lng]) {
    return `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${lat},${lng}`;
}

function mapsSearchUrl(p) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${p.name.split(' — ')[0]}, ${p.address || 'Brescia'}`)}`;
}

// ==================== LOCATION ====================

function toggleLocation() {
    if (state.watchId !== null) {
        navigator.geolocation.clearWatch(state.watchId);
        state.watchId = null;
        state.user = null;
        userDot?.remove();
        userAccuracy?.remove();
        userDot = userAccuracy = null;
        setLocateState('off');
        renderCurrentView();
        return;
    }
    if (!('geolocation' in navigator)) return toast('This browser cannot share your location.');
    setLocateState('searching');
    state.firstFix = true;
    state.watchId = navigator.geolocation.watchPosition(onPosition, onPositionError, {
        enableHighAccuracy: true, maximumAge: 5000, timeout: 20000
    });
}

function onPosition(pos) {
    const { latitude, longitude, accuracy } = pos.coords;
    state.user = [latitude, longitude];
    if (!userDot) {
        userAccuracy = L.circle(state.user, { radius: accuracy, color: '#1a73e8', weight: 1, fillOpacity: 0.12, interactive: false }).addTo(map);
        userDot = L.circleMarker(state.user, { radius: 8, color: '#fff', weight: 3, fillColor: '#1a73e8', fillOpacity: 1, interactive: false }).addTo(map);
    } else {
        userDot.setLatLng(state.user);
        userAccuracy.setLatLng(state.user).setRadius(accuracy);
    }
    setLocateState('on');
    if (state.firstFix) {
        state.firstFix = false;
        map.setView(state.user, Math.max(map.getZoom(), 16));
        if (distanceKm(state.user, BRESCIA) > 25) toast('You seem to be far from Brescia. Distances are measured from you.');
    }
    renderCurrentView();
}

function onPositionError(err) {
    const reasons = {
        1: 'Location permission was denied. Allow it in your browser settings.',
        2: 'Your position is not available right now.',
        3: 'Finding your position took too long. Try again outdoors.'
    };
    toast(reasons[err.code] || 'Could not get your location.');
    if (err.code === 1 && state.watchId !== null) {
        navigator.geolocation.clearWatch(state.watchId);
        state.watchId = null;
        setLocateState('off');
    }
}

function setLocateState(s) {
    const btn = el('locateBtn');
    btn.dataset.state = s;
    btn.setAttribute('aria-label', s === 'off' ? 'Show my location' : 'Stop showing my location');
}

const renderCurrentView = throttle(() => {
    if (state.view === 'list') renderList();
    else if (state.view === 'detail' && state.selected) {
        const item = findItem(state.selected);
        if (item && !item.stops && !item.segments) renderPlaceDetail(item);
        else if (item?.segments) renderTrailDetail(item);
    }
}, 3000);

// ==================== ABOUT ====================

function renderAbout() {
    state.view = 'about';
    highlight(null);
    const m = state.meta;
    setPanelTitle('ⓘ About this guide');
    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <h2>How this guide was made</h2>
        <p>These are my picks for someone who walks a lot, prefers quieter places to famous ones, and wants to eat well without sitting in restaurants. "My take" is opinion. Facts such as dates, addresses and hours come from the sources linked on each place, which I checked in ${esc(m?.picksChecked || CHECKED)}.</p>
        <p>An earlier version of this app had invented places in it. That's why every pick now links to its sources. Places marked <b>Check before you go</b> are documented, but the evidence is old or incomplete.</p>
        <p>Hours change often in Italy, especially around lunch, on Sundays and in August. Call ahead before crossing town for a shop.</p>
        ${state.unlocated.length ? `<p class="note">Not placed on the map: ${state.unlocated.map(p => esc(p.name)).join(', ')}. They're still in the list, with their address.</p>` : ''}

        <h2>Brescian food to look for</h2>
        <ul class="guide">
            <li><b>Casoncelli (casonsèi)</b> — Brescia's stuffed pasta. Buy it fresh at a pastificio and cook it with butter and sage.</li>
            <li><b>Bagòss</b> — a long-aged cheese from Bagolino, a Slow Food Presidium. <b>Silter DOP</b> and <b>Nostrano Valtrompia DOP</b> are the other two to try.</li>
            <li><b>Franciacorta</b> — sparkling wine from the hills west of the city.</li>
            <li><b>Spiedo bresciano</b> — meats slowly roasted on a spit, a Sunday dish. I couldn't confirm anywhere in the city that sells it to take away, so ask at a gastronomia.</li>
        </ul>

        <h2>For walkers</h2>
        <ul class="guide">
            <li>Turn on <b>🚰 Water &amp; WC</b> to find public drinking fountains for your bottle.</li>
            <li>Turn on <b>🥾 CAI trails</b> for the marked hiking paths in the hills. The <b>Sentiero 3V</b> starts in Brescia and runs about 120 km through the valleys, if you get ambitious.</li>
        </ul>
        <p class="muted">Map, locations and walking routes use OpenStreetMap data (© OpenStreetMap contributors, ODbL). Routes come from the FOSSGIS routing service. Built with Leaflet.</p>`;
    expandPanel(true);
}

// ==================== GPX ====================

function downloadGpx(item) {
    const xml = s => String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
    const segments = item.segments || [item.path];
    const segs = segments.map(seg => `<trkseg>${seg.map(([lat, lng]) => `<trkpt lat="${lat}" lon="${lng}"/>`).join('')}</trkseg>`).join('\n');
    const wpts = item.stops ? item.stops.map(id => state.places.find(p => p.id === id)).filter(Boolean)
        .map((p, i) => `<wpt lat="${p.lat}" lon="${p.lng}"><name>${i + 1}. ${xml(p.name)}</name></wpt>`).join('\n') : '';
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Brescia on Foot" xmlns="http://www.topografix.com/GPX/1/1">
<metadata><name>${xml(item.name)}</name><copyright author="OpenStreetMap contributors"><license>https://opendatacommons.org/licenses/odbl/</license></copyright></metadata>
${wpts}
<trk><name>${xml(item.name)}</name>
${segs}
</trk>
</gpx>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([gpx], { type: 'application/gpx+xml' }));
    a.download = `${item.name.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'route'}.gpx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ==================== UI WIRING ====================

function bindUi() {
    el('chips').addEventListener('click', e => {
        const chip = e.target.closest('.chip');
        if (!chip) return;
        const cat = chip.dataset.cat;
        const on = !state.enabled.has(cat);
        on ? state.enabled.add(cat) : state.enabled.delete(cat);
        chip.setAttribute('aria-pressed', on);
        applyFilters();
    });

    el('search').addEventListener('input', debounce(e => {
        state.search = e.target.value.trim().toLowerCase();
        applyFilters();
        if (state.view !== 'list') backToList();
    }, 200));

    el('locateBtn').addEventListener('click', toggleLocation);
    el('walkBtn').addEventListener('click', () => state.view === 'walk' ? backToList() : renderMyWalk());
    el('aboutBtn').addEventListener('click', () => state.view === 'about' ? backToList() : renderAbout());
    el('panelHandle').addEventListener('click', () => expandPanel(el('panel').dataset.expanded !== 'true'));

    el('panelBody').addEventListener('click', e => {
        const target = e.target.closest('[data-action], [data-id]');
        if (!target) return;
        const id = target.dataset.id;
        const action = target.dataset.action;
        if (!action) return selectItem(id, { fly: true });
        if (action === 'back') return backToList();
        if (action === 'zoom') return selectItem(id, { fly: true });
        if (action === 'gpx') return downloadGpx(findItem(id));
        if (action === 'move') return moveStop(id, Number(target.dataset.dir));
        if (action === 'clear-walk') {
            state.walk = [];
            saveWalk();
            return renderMyWalk();
        }
        if (action === 'fit-mywalk') {
            const stops = myWalkStops();
            if (stops.length) map.fitBounds(L.latLngBounds(stops.map(p => [p.lat, p.lng])), { padding: [50, 50], maxZoom: 17 });
            return expandPanel(false);
        }
        if (action === 'toggle-walk') {
            toggleWalk(id);
            if (state.view === 'walk') renderMyWalk();
            else renderPlaceDetail(findItem(id));
        }
    });

    window.addEventListener('hashchange', () => {
        if (state.meta && location.hash.slice(1) !== state.selected) openFromHash();
    });
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape' && state.view !== 'list') backToList();
    });
    saveWalk();
}

function openFromHash() {
    const id = decodeURIComponent(location.hash.slice(1));
    if (id && findItem(id)) selectItem(id, { fly: true });
}

function expandPanel(open) {
    el('panel').dataset.expanded = open;
}

function setPanelTitle(text) {
    el('panelTitle').textContent = text;
}

let toastTimer;
function toast(msg) {
    const t = el('toast');
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { t.hidden = true; }, 3500);
}

function registerServiceWorker() {
    if ('serviceWorker' in navigator && location.protocol === 'https:') {
        navigator.serviceWorker.register('sw.js').catch(err => console.warn('Service worker failed', err));
    }
}

// ==================== HELPERS ====================

function el(id) {
    return document.getElementById(id);
}

function iconFor(item) {
    if (item.stops) return CATEGORY.walks.icon;
    if (item.segments) return CATEGORY.trails.icon;
    return item.icon || KIND_ICON[item.kind] || CATEGORY[item.category].icon;
}

function colorFor(item) {
    return item.segments ? trailColor(item) : CATEGORY[item.category].color;
}

function trailColor(t) {
    return DIFFICULTY[t.difficulty]?.color || DEFAULT_TRAIL_COLOR;
}

function subtitleFor(item) {
    if (item.segments) {
        return [`${item.lengthKm} km`, item.difficulty && `difficulty ${item.difficulty}`, item.ref && `no. ${item.ref}`].filter(Boolean).join(' · ');
    }
    if (item.pick) {
        const label = CATEGORY[item.category].label;
        if (item.lat == null) return `${label} · not on map — tap for address`;
        return item.confidence === 'check' ? `${label} · check before you go` : label;
    }
    return `${item.kind} · OpenStreetMap`;
}

function distanceFrom(origin, item) {
    if (item.segments) {
        let best = Infinity;
        for (const seg of item.segments) for (const pt of seg) best = Math.min(best, distanceKm(origin, pt));
        return best;
    }
    return item.lat == null ? Infinity : distanceKm(origin, [item.lat, item.lng]);
}

function trailEntryPoint(t) {
    if (!state.user) return t.segments[0][0];
    let best = t.segments[0][0], bestKm = Infinity;
    for (const seg of t.segments) for (const pt of seg) {
        const km = distanceKm(state.user, pt);
        if (km < bestKm) { bestKm = km; best = pt; }
    }
    return best;
}

function distanceKm(a, b) {
    const R = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLng = (b[1] - a[1]) * Math.PI / 180;
    const s = Math.sin(dLat / 2) ** 2 +
        Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
}

function formatKm(km) {
    return km < 1 ? `${Math.round(km * 100) * 10} m` : `${km.toFixed(1)} km`;
}

function formatMinutes(min) {
    if (min == null) return '';
    return min < 60 ? `${min} min` : `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;
}

function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function debounce(fn, ms) {
    let t;
    return (...args) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...args), ms);
    };
}

function throttle(fn, ms) {
    let last = 0, timer;
    return () => {
        const now = Date.now();
        clearTimeout(timer);
        if (now - last >= ms) {
            last = now;
            fn();
        } else {
            timer = setTimeout(() => { last = Date.now(); fn(); }, ms - (now - last));
        }
    };
}
