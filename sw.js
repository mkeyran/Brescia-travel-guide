// Offline support: the app and its data are cached on first visit,
// and map tiles are cached as you look at them.

const VERSION = '__BUILD_ID__';
const APP_CACHE = `app-${VERSION}`;
const TILE_CACHE = 'tiles-v1';
const MAX_TILES = 3000;

const APP_FILES = [
    './',
    'index.html',
    'styles.css',
    'js/app.js',
    'manifest.webmanifest',
    'icons/icon-192.png',
    'vendor/leaflet/leaflet.js',
    'vendor/leaflet/leaflet.css',
    'vendor/markercluster/leaflet.markercluster.js',
    'vendor/markercluster/MarkerCluster.css',
    'vendor/markercluster/MarkerCluster.Default.css',
    'data/places.json',
    'data/trails.json',
    'data/meta.json'
];

self.addEventListener('install', event => {
    event.waitUntil(caches.open(APP_CACHE).then(c => c.addAll(APP_FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(k => k.startsWith('app-') && k !== APP_CACHE).map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    if (event.request.method !== 'GET') return;

    if (url.hostname === 'tile.openstreetmap.org') {
        event.respondWith(tile(event.request));
    } else if (url.origin === self.location.origin) {
        event.respondWith(networkFirst(event.request));
    }
});

// Fresh when online, cached copy when offline.
async function networkFirst(request) {
    const cache = await caches.open(APP_CACHE);
    try {
        const res = await fetch(request);
        if (res.ok) cache.put(request, res.clone());
        return res;
    } catch {
        const cached = await cache.match(request, { ignoreSearch: true });
        if (cached) return cached;
        throw new Error('offline');
    }
}

async function tile(request) {
    const cache = await caches.open(TILE_CACHE);
    const cached = await cache.match(request);
    if (cached) return cached;
    const res = await fetch(request);
    if (res.ok) {
        await cache.put(request, res.clone());
        trimTiles(cache);
    }
    return res;
}

async function trimTiles(cache) {
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - MAX_TILES; i++) await cache.delete(keys[i]);
}
