// Builds the static site into _site/ and fetches fresh OpenStreetMap data.
//
//   node scripts/build.mjs                    fetch live data (used by the GitHub Pages workflow)
//   node scripts/build.mjs --fixtures <dir>   use saved Overpass responses instead (tests only)

import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { checkOverpassResponse, placesQuery, trailsQuery, transformPlaces, transformTrails } from '../js/osm.mjs';

const ROOT = new URL('..', import.meta.url).pathname;
const OUT = join(ROOT, '_site');
const STATIC = ['index.html', 'styles.css', 'sw.js', 'manifest.webmanifest', '.nojekyll', 'js', 'vendor', 'icons'];

const ENDPOINTS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter'
];

// Fewer than this many places means the query or the transform is broken.
const MIN_PLACES = 50;

async function overpass(query) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt++) {
        for (const url of ENDPOINTS) {
            try {
                const res = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'User-Agent': 'brescia-walking-guide (GitHub Pages build)'
                    },
                    body: new URLSearchParams({ data: query })
                });
                if (!res.ok) throw new Error(`${url} responded ${res.status}`);
                return checkOverpassResponse(await res.json());
            } catch (err) {
                lastError = err;
                console.warn(`Overpass request failed: ${err.message}`);
            }
        }
        await new Promise(r => setTimeout(r, 10000 * (attempt + 1)));
    }
    throw lastError;
}

async function main() {
    const fixturesIdx = process.argv.indexOf('--fixtures');
    const fixtures = fixturesIdx > -1 ? process.argv[fixturesIdx + 1] : null;

    let placesJson, trailsJson;
    if (fixtures) {
        placesJson = JSON.parse(await readFile(join(fixtures, 'places.json'), 'utf8'));
        trailsJson = JSON.parse(await readFile(join(fixtures, 'trails.json'), 'utf8'));
    } else {
        placesJson = await overpass(placesQuery());
        trailsJson = await overpass(trailsQuery());
    }

    const places = transformPlaces(placesJson);
    const trails = transformTrails(trailsJson);
    console.log(`Overpass: ${placesJson.elements?.length} place elements, ${trailsJson.elements?.length} trail elements`);

    if (!fixtures && places.length < MIN_PLACES) {
        throw new Error(`Only ${places.length} places returned; refusing to publish.`);
    }
    if (!fixtures && !trails.length) {
        throw new Error(`No trails returned (${trailsJson.elements?.length ?? 0} elements); refusing to publish.`);
    }

    const counts = {};
    for (const p of places) counts[p.category] = (counts[p.category] || 0) + 1;

    await rm(OUT, { recursive: true, force: true });
    await mkdir(join(OUT, 'data'), { recursive: true });
    for (const entry of STATIC) {
        await cp(join(ROOT, entry), join(OUT, entry), { recursive: true });
    }

    const meta = {
        fetchedAt: new Date().toISOString(),
        source: fixtures ? 'test fixtures' : 'OpenStreetMap via Overpass API',
        counts: { ...counts, trails: trails.length }
    };
    await writeFile(join(OUT, 'data', 'places.json'), JSON.stringify(places));
    await writeFile(join(OUT, 'data', 'trails.json'), JSON.stringify(trails));
    await writeFile(join(OUT, 'data', 'meta.json'), JSON.stringify(meta, null, 2));

    // Give the service worker a new cache name on every build.
    const swPath = join(OUT, 'sw.js');
    const sw = await readFile(swPath, 'utf8');
    await writeFile(swPath, sw.replace('__BUILD_ID__', Date.now().toString(36)));

    console.log(`Built _site: ${places.length} places, ${trails.length} trails`, counts);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
