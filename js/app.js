// Brescia on Foot — all places and trails come from data/*.json,
// which the build generates from OpenStreetMap.

const BRESCIA = [45.5398, 10.2200];
const LIST_LIMIT = 60;
const WALK_LIMIT = 9;

const CATEGORY = {
    food: { icon: '🧀', label: 'Food shops & markets', color: '#c0602b' },
    heritage: { icon: '🏛️', label: 'Heritage', color: '#6d4c9f' },
    nature: { icon: '🌄', label: 'Views & parks', color: '#2e7d4f' },
    art: { icon: '🎨', label: 'Art', color: '#b0306a' },
    essentials: { icon: '🚰', label: 'Water & WC', color: '#2a6fb0' },
    trails: { icon: '🥾', label: 'Trails', color: '#b23b2e' }
};

const KIND_ICON = {
    'Bakery (panificio)': '🥖', 'Pastry shop (pasticceria)': '🍰', 'Cheese shop (formaggeria)': '🧀',
    'Deli (salumeria / gastronomia)': '🥓', 'Greengrocer (frutta e verdura)': '🍎', 'Butcher (macelleria)': '🥩',
    'Wine shop (enoteca)': '🍷', 'Coffee shop / roaster': '☕', 'Fresh pasta (pastificio)': '🍝',
    'Gelateria': '🍨', 'Market (mercato)': '🧺', 'Farm shop': '🥚', 'Fishmonger (pescheria)': '🐟',
    'Chocolate shop': '🍫', 'Sweet shop': '🍬', 'Honey shop': '🍯',
    'Viewpoint': '🌄', 'Picnic spot': '🧺', 'Park': '🌳', 'Nature reserve': '🌿',
    'Drinking water': '🚰', 'Public toilet': '🚻', 'Church': '⛪', 'Chapel': '⛪', 'Historic church': '⛪',
    'Museum': '🖼️', 'Castle': '🏰', 'Tower': '🗼', 'Fountain': '⛲', 'Historic fountain': '⛲',
    'Archaeological site': '🏺', 'Ruins': '🏚️', 'Mural': '🎨', 'Street art': '🎨', 'Statue': '🗿'
};

// CAI hiking difficulty scale used on Italian trails.
const DIFFICULTY = {
    T: { label: 'T — tourist path', hint: 'Easy, clear paths and tracks.', color: '#2e7d32' },
    E: { label: 'E — hiking trail', hint: 'Marked footpaths, some uneven or steep ground. Proper shoes.', color: '#d84315' },
    EE: { label: 'EE — expert hikers', hint: 'Exposed or rough terrain. Experience needed.', color: '#6a1b9a' },
    EEA: { label: 'EEA — equipped route', hint: 'Via ferrata gear required.', color: '#212121' }
};
const DEFAULT_TRAIL_COLOR = '#b23b2e';

const state = {
    places: [],
    trails: [],
    meta: null,
    enabled: new Set(['trails', 'food', 'heritage', 'nature']),
    search: '',
    user: null,
    watchId: null,
    firstFix: false,
    walk: loadWalk(),
    view: 'list',
    selected: null
};

let map, userDot, userAccuracy, walkLayer, trailLayer;
const clusters = {};
const placeMarkers = new Map();
const trailLines = new Map();

// ==================== STARTUP ====================

init();

async function init() {
    initMap();
    bindUi();
    registerServiceWorker();
    try {
        const [meta, places, trails] = await Promise.all([
            fetchJson('data/meta.json'),
            fetchJson('data/places.json'),
            fetchJson('data/trails.json')
        ]);
        state.meta = meta;
        state.places = places;
        state.trails = trails;
    } catch (err) {
        console.error(err);
        setPanelTitle('Map data could not be loaded');
        el('panelBody').innerHTML = `<p class="empty">The place data is missing. If you are running this locally, build the site first with <code>node scripts/build.mjs</code>.</p>`;
        return;
    }
    buildLayers();
    applyFilters();
    renderWalkLayer();
    openFromHash();
}

async function fetchJson(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${url}: ${res.status}`);
    return res.json();
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
    walkLayer = L.layerGroup().addTo(map);
    map.on('moveend', debounce(renderList, 150));
}

function buildLayers() {
    for (const cat of Object.keys(CATEGORY)) {
        if (cat === 'trails') continue;
        clusters[cat] = L.markerClusterGroup({
            disableClusteringAtZoom: 18,
            maxClusterRadius: 45,
            showCoverageOnHover: false,
            iconCreateFunction: c => L.divIcon({
                html: `<div class="cluster" style="background:${CATEGORY[cat].color}">${c.getChildCount()}</div>`,
                className: 'cluster-wrap',
                iconSize: [36, 36]
            })
        }).addTo(map);
    }

    for (const p of state.places) {
        const marker = L.marker([p.lat, p.lng], {
            icon: L.divIcon({
                className: 'pin-wrap',
                html: `<div class="pin" style="--c:${CATEGORY[p.category].color}"><span>${iconFor(p)}</span></div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 30]
            }),
            title: p.name,
            keyboard: true
        });
        marker.on('click', () => selectItem(p.id));
        placeMarkers.set(p.id, marker);
    }

    for (const t of state.trails) {
        const color = trailColor(t);
        const line = L.polyline(t.segments, { color, weight: 4, opacity: 0.85 });
        // Wide invisible line underneath makes trails easy to tap on a phone.
        const hit = L.polyline(t.segments, { color, weight: 18, opacity: 0 });
        const group = L.featureGroup([hit, line]);
        group.on('click', () => selectItem(t.id));
        trailLines.set(t.id, { group, line });
    }
}

// ==================== FILTERING & LIST ====================

function matches(item) {
    if (!state.search) return true;
    const hay = `${item.name} ${item.kind || ''} ${item.ref || ''} ${item.network || ''} ${item.tags?.['name:en'] || ''}`.toLowerCase();
    return hay.includes(state.search);
}

function applyFilters() {
    for (const [cat, group] of Object.entries(clusters)) {
        group.clearLayers();
        if (!state.enabled.has(cat)) continue;
        const markers = state.places
            .filter(p => p.category === cat && matches(p))
            .map(p => placeMarkers.get(p.id));
        group.addLayers(markers);
    }
    trailLayer.clearLayers();
    if (state.enabled.has('trails')) {
        for (const t of state.trails) {
            if (matches(t)) trailLayer.addLayer(trailLines.get(t.id).group);
        }
    }
    renderList();
}

// With a search term, the list covers the whole area; otherwise just the map view.
function visibleItems() {
    const bounds = map.getBounds();
    const inView = item => state.search || (item.segments
        ? bounds.intersects(trailLines.get(item.id).line.getBounds())
        : bounds.contains([item.lat, item.lng]));
    const items = [];
    for (const p of state.places) {
        if (state.enabled.has(p.category) && matches(p) && inView(p)) items.push(p);
    }
    if (state.enabled.has('trails')) {
        for (const t of state.trails) {
            if (matches(t) && inView(t)) items.push(t);
        }
    }
    const origin = state.user || [map.getCenter().lat, map.getCenter().lng];
    for (const item of items) item._dist = distanceFrom(origin, item);
    return items.sort((a, b) => a._dist - b._dist);
}

function renderList() {
    if (state.view !== 'list' || !state.places.length) return;
    const items = visibleItems();
    const where = state.user ? 'from you' : 'from map centre';
    const scope = state.search ? 'found' : 'in view';
    setPanelTitle(items.length
        ? `${items.length} ${scope} · nearest first`
        : state.search ? 'No matches' : 'Nothing here — zoom out or change filters');

    if (!items.length) {
        el('panelBody').innerHTML = `<p class="empty">${state.search
            ? 'Nothing matches your search in the enabled categories.'
            : 'No matching places in this part of the map.'}</p>`;
        return;
    }
    el('panelBody').innerHTML = `
        <ul class="list">
            ${items.slice(0, LIST_LIMIT).map(item => `
                <li><button class="row" data-id="${esc(item.id)}">
                    <span class="row-icon" style="--c:${colorFor(item)}">${iconFor(item)}</span>
                    <span class="row-text">
                        <strong>${esc(item.name)}</strong>
                        <small>${esc(subtitleFor(item))}</small>
                    </span>
                    <span class="row-dist" title="Straight-line distance ${where}">${formatKm(item._dist)}</span>
                </button></li>`).join('')}
        </ul>
        ${items.length > LIST_LIMIT ? `<p class="hint">Showing the nearest ${LIST_LIMIT}. Zoom in to see the rest.</p>` : ''}
        <p class="hint">Distances are straight-line ${where}.</p>`;
}

// ==================== DETAIL ====================

function findItem(id) {
    return state.places.find(p => p.id === id) || state.trails.find(t => t.id === id);
}

function selectItem(id, { fly = false } = {}) {
    const item = findItem(id);
    if (!item) return;
    highlightTrail(item.segments ? id : null);
    state.selected = id;
    state.view = 'detail';
    history.replaceState(null, '', `#${id}`);

    if (fly) {
        if (item.segments) map.fitBounds(trailLines.get(id).line.getBounds(), { padding: [40, 40] });
        else map.setView([item.lat, item.lng], Math.max(map.getZoom(), 17));
    }
    if (item.segments) renderTrailDetail(item);
    else renderPlaceDetail(item);
    expandPanel(true);
}

function backToList() {
    highlightTrail(null);
    state.selected = null;
    state.view = 'list';
    history.replaceState(null, '', location.pathname + location.search);
    renderList();
}

function renderPlaceDetail(p) {
    const t = p.tags;
    const address = [t['addr:street'], t['addr:housenumber']].filter(Boolean).join(' ');
    const website = safeUrl(t.website || t['contact:website']);
    const phone = t.phone || t['contact:phone'];
    const wiki = wikipediaUrl(t.wikipedia);
    const inWalk = state.walk.includes(p.id);
    const dist = state.user ? `<p class="dist">📍 ${formatKm(distanceFrom(state.user, p))} from you (straight line)</p>` : '';

    setPanelTitle(`${iconFor(p)} ${p.kind}`);
    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <h2>${esc(p.name)}</h2>
        ${t['name:en'] && t['name:en'] !== p.name ? `<p class="muted">${esc(t['name:en'])}</p>` : ''}
        ${p.unnamed ? `<p class="muted">No name in OpenStreetMap.</p>` : ''}
        ${dist}
        <dl class="facts">
            ${address ? fact('Address', esc(address)) : ''}
            ${t.opening_hours ? fact('Opening hours', `${esc(t.opening_hours)}<br><small>From OpenStreetMap — may be out of date.</small>`) : ''}
            ${t.description || t['description:en'] ? fact('Description', esc(t['description:en'] || t.description)) : ''}
            ${t.artist_name ? fact('Artist', esc(t.artist_name)) : ''}
            ${t.start_date ? fact('Dates from', esc(t.start_date)) : ''}
            ${t.fee ? fact('Fee', esc(t.fee)) : ''}
            ${t.drinking_water === 'no' ? fact('Water', 'Not drinkable') : ''}
            ${phone ? fact('Phone', `<a href="tel:${esc(phone.replace(/\s/g, ''))}">${esc(phone)}</a>`) : ''}
            ${website ? fact('Website', `<a href="${esc(website)}" target="_blank" rel="noopener">${esc(website.replace(/^https?:\/\//, ''))}</a>`) : ''}
            ${wiki ? fact('Wikipedia', `<a href="${esc(wiki)}" target="_blank" rel="noopener">Read article</a>`) : ''}
        </dl>
        <div class="actions">
            <a class="btn primary" href="${walkingDirectionsUrl([p.lat, p.lng])}" target="_blank" rel="noopener">🧭 Walking directions</a>
            <button class="btn" data-action="toggle-walk" data-id="${esc(p.id)}">${inWalk ? '✓ In my walk' : '➕ Add to my walk'}</button>
            <button class="btn" data-action="zoom" data-id="${esc(p.id)}">🔍 Zoom to</button>
            <a class="btn subtle" href="https://www.openstreetmap.org/${esc(p.id)}" target="_blank" rel="noopener">View or fix on OpenStreetMap</a>
        </div>`;
}

function renderTrailDetail(t) {
    const diff = DIFFICULTY[t.difficulty];
    const start = trailEntryPoint(t);
    const dist = state.user ? `<p class="dist">📍 Nearest point is ${formatKm(distanceFrom(state.user, t))} from you</p>` : '';
    const website = safeUrl(t.website);

    setPanelTitle(`🥾 ${t.network === 'lwn' ? 'Local trail' : 'Hiking trail'}`);
    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <h2>${esc(t.name)}</h2>
        ${dist}
        <dl class="facts">
            ${t.ref ? fact('Trail number', esc(t.ref)) : ''}
            ${t.from || t.to ? fact('Route', `${esc(t.from || '?')} → ${esc(t.to || '?')}`) : ''}
            ${fact('Length on map', `${t.lengthKm} km${t.clipped ? ' (only the part near Brescia is shown)' : ''}`)}
            ${t.distanceTag ? fact('Signposted length', esc(t.distanceTag)) : ''}
            ${diff ? fact('Difficulty', `<span class="diff" style="--c:${diff.color}">${esc(diff.label)}</span><br><small>${esc(diff.hint)}</small>`)
                   : t.difficulty ? fact('Difficulty', esc(t.difficulty)) : fact('Difficulty', '<small>Not recorded in OpenStreetMap</small>')}
            ${t.operator ? fact('Maintained by', esc(t.operator)) : ''}
            ${t.description ? fact('Description', esc(t.description)) : ''}
            ${website ? fact('Website', `<a href="${esc(website)}" target="_blank" rel="noopener">${esc(website.replace(/^https?:\/\//, ''))}</a>`) : ''}
        </dl>
        <div class="actions">
            <button class="btn primary" data-action="gpx" data-id="${esc(t.id)}">⬇️ Download GPX</button>
            <a class="btn" href="${walkingDirectionsUrl(start)}" target="_blank" rel="noopener">🧭 Directions to ${state.user ? 'nearest point' : 'trail'}</a>
            <button class="btn" data-action="zoom" data-id="${esc(t.id)}">🔍 Show whole trail</button>
            <a class="btn subtle" href="https://www.openstreetmap.org/${esc(t.id)}" target="_blank" rel="noopener">View or fix on OpenStreetMap</a>
        </div>
        <p class="hint">GPX files open in offline hiking apps such as Organic Maps, OsmAnd or Komoot. Always follow the painted trail marks on the ground.</p>`;
}

function fact(label, html) {
    return `<div><dt>${label}</dt><dd>${html}</dd></div>`;
}

function highlightTrail(id) {
    for (const [tid, { line }] of trailLines) {
        const on = tid === id;
        line.setStyle({ weight: on ? 7 : 4, opacity: id && !on ? 0.45 : 0.85 });
        if (on) line.bringToFront();
    }
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
    localStorage.setItem('walk', JSON.stringify(state.walk));
    const count = el('walkCount');
    count.textContent = state.walk.length;
    count.hidden = !state.walk.length;
    renderWalkLayer();
}

function toggleWalk(id) {
    if (state.walk.includes(id)) {
        state.walk = state.walk.filter(w => w !== id);
    } else {
        if (state.walk.length >= WALK_LIMIT) {
            toast(`A walk can have up to ${WALK_LIMIT} stops.`);
            return;
        }
        state.walk.push(id);
        toast('Added to your walk');
    }
    saveWalk();
}

function walkStops() {
    return state.walk.map(id => state.places.find(p => p.id === id)).filter(Boolean);
}

function renderWalkLayer() {
    if (!walkLayer) return;
    walkLayer.clearLayers();
    walkStops().forEach((p, i) => {
        L.marker([p.lat, p.lng], {
            icon: L.divIcon({ className: 'stop-wrap', html: `<div class="stop">${i + 1}</div>`, iconSize: [26, 26] }),
            zIndexOffset: 1000
        }).on('click', () => selectItem(p.id)).addTo(walkLayer);
    });
}

function renderWalk() {
    state.view = 'walk';
    highlightTrail(null);
    const stops = walkStops();
    setPanelTitle(`🚶 My walk · ${stops.length} stop${stops.length === 1 ? '' : 's'}`);
    if (!stops.length) {
        el('panelBody').innerHTML = `
            <button class="link-btn" data-action="back">← Back to list</button>
            <p class="empty">Open a place and tap <b>Add to my walk</b> to collect stops — a bakery, a viewpoint, a fountain to refill your bottle. Then open the whole walk in Google Maps for walking directions.</p>`;
        expandPanel(true);
        return;
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
                        <span class="row-text"><strong>${esc(p.name)}</strong><small>${esc(p.kind)}</small></span>
                    </button>
                    <span class="stop-tools">
                        <button class="icon-btn" data-action="move" data-id="${esc(p.id)}" data-dir="-1" aria-label="Move up" ${i === 0 ? 'disabled' : ''}>↑</button>
                        <button class="icon-btn" data-action="move" data-id="${esc(p.id)}" data-dir="1" aria-label="Move down" ${i === stops.length - 1 ? 'disabled' : ''}>↓</button>
                        <button class="icon-btn" data-action="toggle-walk" data-id="${esc(p.id)}" aria-label="Remove">✕</button>
                    </span>
                </li>`).join('')}
        </ol>
        <p class="muted">At least ${formatKm(km)} ${state.user ? 'from where you are' : ''} — measured in straight lines, so the real walk is longer.</p>
        <div class="actions">
            <a class="btn primary" href="${walkUrl(stops)}" target="_blank" rel="noopener">🧭 Open walk in Google Maps</a>
            <button class="btn" data-action="fit-walk">🔍 Show on map</button>
            <button class="btn subtle" data-action="clear-walk">Clear walk</button>
        </div>
        <p class="hint">On phones Google Maps may only take the first few stops; split long walks in two.</p>`;
    expandPanel(true);
}

function moveStop(id, dir) {
    const i = state.walk.indexOf(id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= state.walk.length) return;
    [state.walk[i], state.walk[j]] = [state.walk[j], state.walk[i]];
    saveWalk();
    renderWalk();
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
    if (!('geolocation' in navigator)) {
        toast('This browser cannot share your location.');
        return;
    }
    setLocateState('searching');
    state.firstFix = true;
    state.watchId = navigator.geolocation.watchPosition(onPosition, onPositionError, {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 20000
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
        if (distanceKm(state.user, BRESCIA) > 25) toast('You seem to be far from Brescia — distances are measured from you.');
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

// Live re-render while moving, but only for views that show distances.
const renderCurrentView = throttle(() => {
    if (state.view === 'list') renderList();
    else if (state.view === 'detail' && state.selected) {
        const item = findItem(state.selected);
        if (item?.segments) renderTrailDetail(item);
        else if (item) renderPlaceDetail(item);
    }
}, 3000);

// ==================== ABOUT ====================

function renderAbout() {
    state.view = 'about';
    highlightTrail(null);
    const m = state.meta;
    const counts = m ? Object.entries(m.counts).map(([k, v]) => `${CATEGORY[k]?.label || k}: ${v}`).join(' · ') : '';
    setPanelTitle('ⓘ About this map');
    el('panelBody').innerHTML = `
        <button class="link-btn" data-action="back">← Back to list</button>
        <h2>Where the data comes from</h2>
        <p>Every place and trail on this map comes from <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener">OpenStreetMap</a>, mapped by volunteers. The map is rebuilt automatically every week. Nothing has been added by hand, and nothing is ranked or reviewed. Each place has a link to its OpenStreetMap entry, so you can check it there or fix it yourself.</p>
        ${m ? `<p class="muted">Last update: ${esc(new Date(m.fetchedAt).toLocaleDateString())} · ${esc(counts)}</p>` : ''}
        <p>Shops close and hours change. Check opening hours before you walk across town for something.</p>

        <h2>Brescian food to look out for</h2>
        <p>Things to buy in shops and markets and eat on the go:</p>
        <ul class="guide">
            <li><b>Casoncelli (casonsèi)</b> — Brescia's stuffed pasta. Pastifici sell it fresh to cook at home with butter and sage.</li>
            <li><b>Bagòss</b> — a long-aged, saffron-tinted cheese from Bagolino, in the Brescian mountains.</li>
            <li><b>Silter DOP</b> — a hard mountain cheese from Val Camonica and Sebino.</li>
            <li><b>Grana Padano</b> — much of it is made in the Brescia province.</li>
            <li><b>Salame di Monte Isola</b> — a cured salame from the island in Lake Iseo.</li>
            <li><b>Garda DOP olive oil</b> — from the groves on the Brescian shore of Lake Garda.</li>
            <li><b>Franciacorta</b> — the sparkling wine from the hills west of the city. <b>Lugana</b> and <b>Valtènesi</b> (Chiaretto) come from around Lake Garda.</li>
            <li><b>Bossolà</b> — a ring-shaped sweet bread that bakeries make around Christmas.</li>
            <li><b>Spiedo bresciano</b> — meats slowly roasted on a spit, a Sunday and holiday dish. Ask at a gastronomia whether they sell it to take away.</li>
        </ul>

        <h2>Tips for walkers</h2>
        <ul class="guide">
            <li>Turn on <b>🚰 Water &amp; WC</b> to see public drinking fountains for refilling bottles.</li>
            <li>Italian hiking trails (CAI) are marked with red and white paint. Match the trail number on the map to the one on the signposts.</li>
            <li>Many small shops close for a long lunch break and on Sundays.</li>
        </ul>
        <p class="muted">Map tiles and data © OpenStreetMap contributors, ODbL. Built with Leaflet.</p>`;
    expandPanel(true);
}

// ==================== GPX ====================

function downloadGpx(t) {
    const xml = s => String(s).replace(/[<>&"']/g, c => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' }[c]));
    const segs = t.segments.map(seg =>
        `<trkseg>${seg.map(([lat, lng]) => `<trkpt lat="${lat}" lon="${lng}"/>`).join('')}</trkseg>`).join('\n');
    const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Brescia on Foot" xmlns="http://www.topografix.com/GPX/1/1">
<metadata><name>${xml(t.name)}</name><link href="https://www.openstreetmap.org/${t.id}"><text>OpenStreetMap</text></link><copyright author="OpenStreetMap contributors"><license>https://opendatacommons.org/licenses/odbl/</license></copyright></metadata>
<trk><name>${xml(t.name)}</name>
${segs}
</trk>
</gpx>`;
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([gpx], { type: 'application/gpx+xml' }));
    a.download = `${t.name.replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-') || 'trail'}.gpx`;
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
    el('walkBtn').addEventListener('click', () => state.view === 'walk' ? backToList() : renderWalk());
    el('aboutBtn').addEventListener('click', () => state.view === 'about' ? backToList() : renderAbout());
    el('panelHandle').addEventListener('click', () => expandPanel(el('panel').dataset.expanded !== 'true'));

    el('panelBody').addEventListener('click', e => {
        const target = e.target.closest('[data-action], .row');
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
            return renderWalk();
        }
        if (action === 'fit-walk') {
            const stops = walkStops();
            if (stops.length) map.fitBounds(L.latLngBounds(stops.map(p => [p.lat, p.lng])), { padding: [50, 50], maxZoom: 17 });
            return expandPanel(false);
        }
        if (action === 'toggle-walk') {
            toggleWalk(id);
            if (state.view === 'walk') renderWalk();
            else renderPlaceDetail(findItem(id));
        }
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
    if (item.segments) return CATEGORY.trails.icon;
    return KIND_ICON[item.kind] || CATEGORY[item.category].icon;
}

function colorFor(item) {
    return item.segments ? trailColor(item) : CATEGORY[item.category].color;
}

function trailColor(t) {
    return DIFFICULTY[t.difficulty]?.color || DEFAULT_TRAIL_COLOR;
}

function subtitleFor(item) {
    if (item.segments) {
        return [`${item.lengthKm} km`, item.difficulty && `difficulty ${item.difficulty}`, item.ref && item.name !== `Trail ${item.ref}` && `no. ${item.ref}`]
            .filter(Boolean).join(' · ');
    }
    const street = item.tags['addr:street'];
    return street ? `${item.kind} · ${street}` : item.kind;
}

// For trails: distance to the closest vertex.
function distanceFrom(origin, item) {
    if (!item.segments) return distanceKm(origin, [item.lat, item.lng]);
    let best = Infinity;
    for (const seg of item.segments) for (const pt of seg) best = Math.min(best, distanceKm(origin, pt));
    return best;
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
    return km < 1 ? `${Math.round(km * 1000 / 10) * 10} m` : `${km.toFixed(1)} km`;
}

function esc(s) {
    return String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function safeUrl(url) {
    if (!url) return null;
    const withScheme = /^https?:\/\//i.test(url) ? url : `https://${url}`;
    try {
        const u = new URL(withScheme);
        return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null;
    } catch {
        return null;
    }
}

function wikipediaUrl(tag) {
    const m = /^([a-z-]{2,12}):(.+)$/.exec(tag || '');
    return m ? `https://${m[1]}.wikipedia.org/wiki/${encodeURIComponent(m[2].replace(/ /g, '_'))}` : null;
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
