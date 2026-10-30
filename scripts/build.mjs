// Builds the static site into _site/.
//
// Hand-picked places and walks come from js/picks.mjs. The build only looks
// up where they are (OpenStreetMap by name, then the verified address) and
// routes the walks along real streets. CAI trails and drinking water come
// from OpenStreetMap as optional extras.
//
//   node scripts/build.mjs                    live lookups (GitHub Pages workflow)
//   node scripts/build.mjs --fixtures <dir>   saved responses instead (tests only)

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { checkOverpassResponse, placesQuery, trailsQuery, transformPlaces, transformTrails } from '../js/osm.mjs';
import { CHECKED, PICKS, WALKS, buildWalks, picksQuery, resolvePicks, walkRouteUrl } from '../js/picks.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, '_site');
const STATIC = ['index.html', 'styles.css', 'sw.js', 'manifest.webmanifest', '.nojekyll', 'js', 'vendor', 'icons'];
const UA = 'brescia-walking-guide (GitHub Pages build; github.com/mkeyran/Brescia-travel-guide)';

const ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
];

// Fewer located picks than this means the lookup is broken; keep the old site.
const MIN_LOCATED = 12;

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function overpass(query) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
        for (const url of ENDPOINTS) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded', 'User-Agent': UA },
                    body: new URLSearchParams({ data: query })
                });
                if (!res.ok) throw new Error(`${url} responded ${res.status}`);
                return checkOverpassResponse(await res.json());
            } catch (err) {
                lastError = err;
                console.warn(`Overpass request failed: ${err.message}`);
            }
        }
        await sleep(10000 * (attempt + 1));
    }
    throw lastError;
}

// Nominatim fallback for picks OSM doesn't know by name. Max 1 request/s.
async function geocodeAddress(address) {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=it&addressdetails=1&q=${encodeURIComponent(address)}`;
    const res = await fetch(url, { headers: { 'User-Agent': UA } });
    await sleep(1100);
    if (!res.ok) throw new Error(`Nominatim ${res.status}`);
    const [hit] = await res.json();
    if (!hit) return null;
    return {
        lat: Math.round(Number(hit.lat) * 1e5) / 1e5,
        lng: Math.round(Number(hit.lon) * 1e5) / 1e5,
        // Without a house number the hit is just the street: say so in the app.
        approximate: !hit.address?.house_number
    };
}

async function routeWalk(points) {
    const res = await fetch(walkRouteUrl(points), { headers: { 'User-Agent': UA } });
    if (!res.ok) throw new Error(`routing ${res.status}`);
    const json = await res.json();
    const r = json.routes?.[0];
    if (!r) throw new Error(`routing: ${json.code || 'no route'}`);
    return {
        path: r.geometry.coordinates.map(([lng, lat]) => [Math.round(lat * 1e5) / 1e5, Math.round(lng * 1e5) / 1e5]),
        distance: r.distance,
        duration: r.duration
    };
}

async function loadFixture(dir, name) {
    const file = join(dir, name);
    return existsSync(file) ? JSON.parse(await readFile(file, 'utf8')) : { elements: [] };
}

async function main() {
    const fixturesIdx = process.argv.indexOf('--fixtures');
    const fixtures = fixturesIdx > -1 ? process.argv[fixturesIdx + 1] : null;

    // ---- picks ----
    const picksJson = fixtures ? await loadFixture(fixtures, 'picks.json') : await overpass(picksQuery());
    const picks = resolvePicks(picksJson);
    for (const p of picks) {
        if (p.lat != null || !p.address || fixtures) continue;
        try {
            const hit = await geocodeAddress(p.address);
            if (hit) Object.assign(p, { lat: hit.lat, lng: hit.lng, located: { by: 'address', approximate: hit.approximate } });
        } catch (err) {
            console.warn(`Geocoding ${p.id} failed: ${err.message}`);
        }
    }
    for (const p of picks) {
        const how = !p.located ? 'NOT LOCATED' : p.located.by === 'osm' ? `osm ${p.located.osm} "${p.located.osmName}"` : `address${p.located.approximate ? ' (street only)' : ''}`;
        console.log(`  ${p.id.padEnd(18)} ${how}`);
    }
    const located = picks.filter(p => p.lat != null).length;
    if (!fixtures && located < MIN_LOCATED) {
        throw new Error(`Only ${located}/${PICKS.length} picks located; refusing to publish.`);
    }

    // ---- walks ----
    const routes = {};
    const byId = Object.fromEntries(picks.map(p => [p.id, p]));
    for (const w of WALKS) {
        const points = w.stops.map(id => byId[id]).filter(p => p?.lat != null).map(p => [p.lat, p.lng]);
        if (fixtures || points.length < 2) continue;
        try {
            routes[w.id] = await routeWalk(points);
        } catch (err) {
            console.warn(`Routing ${w.id} failed: ${err.message} (the app will show stop order only)`);
        }
        await sleep(1100);
    }
    const walks = buildWalks(picks, routes);

    // ---- optional OSM extras ----
    let placesJson, trailsJson;
    if (fixtures) {
        placesJson = await loadFixture(fixtures, 'places.json');
        trailsJson = await loadFixture(fixtures, 'trails.json');
    } else {
        placesJson = await overpass(placesQuery());
        trailsJson = await overpass(trailsQuery());
    }
    const places = transformPlaces(placesJson).filter(p => p.category === 'essentials');
    const trails = transformTrails(trailsJson);
    if (!trails.length) console.warn('No CAI trails returned; the trails layer will be empty.');

    // ---- write ----
    await rm(OUT, { recursive: true, force: true });
    await mkdir(join(OUT, 'data'), { recursive: true });
    for (const entry of STATIC) await cp(join(ROOT, entry), join(OUT, entry), { recursive: true });

    const meta = {
        builtAt: new Date().toISOString(),
        picksChecked: CHECKED,
        source: fixtures ? 'test fixtures' : 'Hand-picked; located and routed with OpenStreetMap',
        counts: { picks: located, walks: walks.length, trails: trails.length, essentials: places.length }
    };
    await writeFile(join(OUT, 'data', 'picks.json'), JSON.stringify({ picks, walks }));
    await writeFile(join(OUT, 'data', 'places.json'), JSON.stringify(places));
    await writeFile(join(OUT, 'data', 'trails.json'), JSON.stringify(trails));
    await writeFile(join(OUT, 'data', 'meta.json'), JSON.stringify(meta, null, 2));

    const swPath = join(OUT, 'sw.js');
    const sw = await readFile(swPath, 'utf8');
    await writeFile(swPath, sw.replace('__BUILD_ID__', Date.now().toString(36)));

    console.log(`Built _site: ${located}/${PICKS.length} picks located, ${Object.keys(routes).length}/${WALKS.length} walks routed, ${trails.length} trails, ${places.length} water/WC`);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
