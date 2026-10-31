// Generates data/ (committed to the repo, served by GitHub Pages as-is):
//   picks.json   picks located with Nominatim + walks routed with OSRM (foot)
//   trails.json  marked hiking routes from Waymarked Trails
//   places.json  drinking water and public toilets from Nominatim
//   meta.json
//
//   node scripts/locate.mjs
//
// Every pick's location is printed with the OpenStreetMap name it matched,
// so a wrong match is easy to spot in review.

import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { CHECKED, PICKS, WALKS, buildWalks, walkRouteUrl } from '../js/picks.mjs';
import { BBOX, distanceKm } from '../js/osm.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, 'data');
const UA = 'brescia-walking-guide (github.com/mkeyran/Brescia-travel-guide)';
const [S, W, N, E] = BBOX;
const sleep = ms => new Promise(r => setTimeout(r, ms));
const round = n => Math.round(n * 1e5) / 1e5;

async function getJson(url) {
    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const res = await fetch(url, { headers: { 'User-Agent': UA } });
            if (res.ok) return await res.json();
            if (res.status !== 429 && res.status < 500) throw new Error(`${res.status} ${url}`);
        } catch (err) {
            if (attempt === 2) throw err;
        }
        await sleep(3000 * (attempt + 1));
    }
    throw new Error(`failed ${url}`);
}

// Nominatim: max 1 request per second.
async function nominatim(q, viewbox = [W, N, E, S], limit = 1) {
    const params = new URLSearchParams({
        q, format: 'jsonv2', limit: String(limit), addressdetails: '1',
        viewbox: viewbox.join(','), bounded: '1'
    });
    const res = await getJson(`https://nominatim.openstreetmap.org/search?${params}`);
    await sleep(1100);
    return res;
}

// ---------------- picks ----------------

async function locatePick(p) {
    if (p.find.coords) {
        return { lat: p.find.coords[0], lng: p.find.coords[1], located: { by: 'source', note: 'position from the cited source' } };
    }
    for (const q of p.find.q || []) {
        const [hit] = await nominatim(q);
        if (hit && hit.category !== 'highway') {
            return { lat: round(+hit.lat), lng: round(+hit.lon), located: { by: 'osm', osm: `${hit.osm_type}/${hit.osm_id}`, osmName: hit.name || hit.display_name.split(',')[0] } };
        }
    }
    if (p.address) {
        const [hit] = await nominatim(p.address);
        if (hit) {
            const approximate = hit.category === 'highway' || !hit.address?.house_number;
            return { lat: round(+hit.lat), lng: round(+hit.lon), located: { by: 'address', approximate, match: hit.display_name.split(',').slice(0, 3).join(',') } };
        }
    }
    return { lat: null, lng: null, located: null };
}

async function locatePicks() {
    const out = [];
    for (const p of PICKS) {
        const { find, ...rest } = p;
        const loc = await locatePick(p);
        out.push({ ...rest, ...loc });
        const how = !loc.located ? 'NOT LOCATED'
            : loc.located.by === 'osm' ? `${loc.located.osm} "${loc.located.osmName}"`
            : loc.located.by === 'source' ? 'coordinates from source'
            : `address "${loc.located.match}"${loc.located.approximate ? ' (STREET ONLY)' : ''}`;
        console.log(`  ${p.id.padEnd(22)} ${loc.lat ?? ''},${loc.lng ?? ''}  ${how}`);
    }
    return out;
}

// ---------------- walks ----------------

async function routeWalks(picks) {
    const byId = Object.fromEntries(picks.map(p => [p.id, p]));
    const routes = {};
    for (const w of WALKS) {
        const points = w.stops.map(id => byId[id]).filter(p => p?.lat != null).map(p => [p.lat, p.lng]);
        if (points.length < 2) continue;
        try {
            const json = await getJson(walkRouteUrl(points));
            const r = json.routes[0];
            routes[w.id] = {
                path: r.geometry.coordinates.map(([lng, lat]) => [round(lat), round(lng)]),
                distance: r.distance,
                duration: r.duration
            };
            console.log(`  ${w.id.padEnd(22)} ${(r.distance / 1000).toFixed(1)} km, ${Math.round(r.duration / 60)} min`);
        } catch (err) {
            console.warn(`  ${w.id}: routing failed (${err.message})`);
        }
        await sleep(1100);
    }
    return buildWalks(picks, routes);
}

// ---------------- trails (Waymarked Trails) ----------------

const toLonLat = ([x, y]) => [
    round((Math.atan(Math.exp(y / 6378137)) * 360 / Math.PI) - 90),
    round(x / 20037508.34 * 180)
];
const toMercator = (lon, lat) => [lon * 20037508.34 / 180, Math.log(Math.tan((90 + lat) * Math.PI / 360)) * 6378137];

const CLIP = 0.08;
const inClip = ([lat, lng]) => lat >= S - CLIP && lat <= N + CLIP && lng >= W - CLIP && lng <= E + CLIP;

function collectWays(node, ways = []) {
    if (Array.isArray(node)) node.forEach(n => collectWays(n, ways));
    else if (node && typeof node === 'object') {
        if (node.geometry?.type === 'LineString') ways.push(node.geometry.coordinates);
        for (const key of ['main', 'appendices', 'ways']) if (node[key]) collectWays(node[key], ways);
    }
    return ways;
}

async function fetchTrails() {
    const [x1, y1] = toMercator(W, S);
    const [x2, y2] = toMercator(E, N);
    const ids = [];
    for (let page = 1; page <= 5; page++) {
        const json = await getJson(`https://hiking.waymarkedtrails.org/api/v1/list/by_area?bbox=${x1},${y1},${x2},${y2}&limit=100&page=${page}`);
        ids.push(...json.results.filter(r => r.type === 'relation').map(r => r.id));
        if (json.results.length < 100) break;
    }
    const unique = [...new Set(ids)];
    const trails = [];
    for (const id of unique) {
        try {
            const d = await getJson(`https://hiking.waymarkedtrails.org/api/v1/details/relation/${id}`);
            const t = d.tags || {};
            let clipped = false;
            const segments = [];
            for (const coords of collectWays(d.route)) {
                const seg = coords.map(toLonLat);
                if (seg.length < 2) continue;
                if (!seg.some(inClip)) { clipped = true; continue; }
                segments.push(seg);
            }
            if (!segments.length) continue;
            let km = 0;
            for (const seg of segments) for (let i = 1; i < seg.length; i++) km += distanceKm(seg[i - 1], seg[i]);
            if (km < 0.3) continue;
            trails.push({
                id: `relation/${id}`,
                name: t.name || (t.ref ? `CAI ${t.ref}` : t.from && t.to ? `${t.from} – ${t.to}` : `Trail ${id}`),
                ref: t.ref || null,
                network: t.network || null,
                operator: t.operator || null,
                from: t.from || null,
                to: t.to || null,
                difficulty: t.cai_scale || t.sac_scale || null,
                distanceTag: t.distance || null,
                description: t['description:en'] || t.description || null,
                website: t.website || null,
                osmcSymbol: t['osmc:symbol'] || null,
                lengthKm: Math.round(km * 10) / 10,
                clipped,
                segments
            });
        } catch (err) {
            console.warn(`  trail ${id}: ${err.message}`);
        }
        await sleep(300);
    }
    return trails;
}

// ---------------- water & WC ----------------

async function fetchEssentials() {
    const found = new Map();
    const tiles = 4;
    for (const [phrase, kind] of [['drinking water', 'Drinking water'], ['toilets', 'Public toilet']]) {
        for (let i = 0; i < tiles; i++) for (let j = 0; j < tiles; j++) {
            const w = W + (E - W) * i / tiles, e = W + (E - W) * (i + 1) / tiles;
            const s = S + (N - S) * j / tiles, n = S + (N - S) * (j + 1) / tiles;
            const hits = await nominatim(`${phrase} in Brescia`, [w, n, e, s], 50).catch(() => []);
            for (const h of hits) {
                if (!['drinking_water', 'toilets'].includes(h.type)) continue;
                const id = `${h.osm_type}/${h.osm_id}`;
                if (!found.has(id)) {
                    found.set(id, { id, name: kind, unnamed: true, category: 'essentials', kind, lat: round(+h.lat), lng: round(+h.lon), tags: {} });
                }
            }
        }
    }
    return [...found.values()];
}

// ---------------- main ----------------

console.log('Locating picks…');
const picks = await locatePicks();
console.log('Routing walks…');
const walks = await routeWalks(picks);
console.log('Fetching marked trails…');
const trails = await fetchTrails();
console.log(`  ${trails.length} trails`);
console.log('Fetching drinking water & toilets…');
const places = await fetchEssentials();
console.log(`  ${places.length} points`);

const located = picks.filter(p => p.lat != null).length;
const meta = {
    builtAt: new Date().toISOString(),
    picksChecked: CHECKED,
    source: 'Hand-picked; located with Nominatim, walks routed with OSRM, trails from Waymarked Trails (all OpenStreetMap data)',
    counts: { picks: located, walks: walks.length, trails: trails.length, essentials: places.length }
};
await mkdir(OUT, { recursive: true });
await writeFile(join(OUT, 'picks.json'), JSON.stringify({ picks, walks }));
await writeFile(join(OUT, 'trails.json'), JSON.stringify(trails));
await writeFile(join(OUT, 'places.json'), JSON.stringify(places));
await writeFile(join(OUT, 'meta.json'), JSON.stringify(meta, null, 2));
console.log(`Wrote data/: ${located}/${PICKS.length} picks, ${walks.length} walks, ${trails.length} trails, ${places.length} water/WC`);
