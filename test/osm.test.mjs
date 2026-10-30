import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { transformPlaces, transformTrails, placesQuery, trailsQuery, distanceKm, checkOverpassResponse } from '../js/osm.mjs';

const fixture = name => JSON.parse(readFileSync(new URL(`fixtures/${name}`, import.meta.url)));

test('places: keeps named food shops, markets, views, heritage, water', () => {
    const places = transformPlaces(fixture('places.json'));
    const byId = Object.fromEntries(places.map(p => [p.id, p]));

    assert.equal(byId['node/1'].category, 'food');
    assert.equal(byId['node/1'].kind, 'Bakery (panificio)');
    assert.equal(byId['node/1'].tags.opening_hours, 'Mo-Sa 07:00-13:00');
    assert.equal(byId['node/3'].kind, 'Market (mercato)');
    assert.equal(byId['node/3'].unnamed, true);
    assert.equal(byId['node/4'].category, 'nature');
    assert.equal(byId['way/6'].category, 'heritage');
    assert.equal(byId['way/6'].lat, 45.539);
    assert.equal(byId['node/7'].category, 'essentials');
    assert.equal(byId['way/8'].kind, 'Park');
    assert.equal(byId['node/9'].kind, 'Mural');
    assert.equal(byId['node/10'].tags['shop:extra'], undefined);
});

test('places: drops unnamed shops, plaques and elements without coordinates', () => {
    const ids = transformPlaces(fixture('places.json')).map(p => p.id);
    assert.ok(!ids.includes('node/2'));
    assert.ok(!ids.includes('node/5'));
    assert.ok(!ids.includes('way/11'));
});

test('trails: builds segments, computes length, clips far-away parts, drops tiny ones', () => {
    const trails = transformTrails(fixture('trails.json'));
    const byId = Object.fromEntries(trails.map(t => [t.id, t]));

    const t1 = byId['relation/100'];
    assert.equal(t1.name, 'TEST CAI T1');
    assert.equal(t1.difficulty, 'E');
    assert.equal(t1.segments.length, 2);
    assert.equal(t1.clipped, false);
    assert.ok(t1.lengthKm > 1.5 && t1.lengthKm < 3, `length ${t1.lengthKm}`);

    const long = byId['relation/101'];
    assert.equal(long.segments.length, 1);
    assert.equal(long.clipped, true);

    assert.equal(byId['relation/102'], undefined);
});

test('queries target the Brescia bounding box', () => {
    assert.match(placesQuery(), /\[bbox:45\.49,10\.15,45\.6,10\.33\]/);
    assert.match(trailsQuery(), /\(45\.49,10\.15,45\.6,10\.33\)/);

});

test('distanceKm is roughly right', () => {
    // 0.01 degrees of latitude is about 1.11 km
    assert.ok(Math.abs(distanceKm([45.5, 10.2], [45.51, 10.2]) - 1.112) < 0.01);
});

test('trails: joins relation members with separately returned ways', () => {
    const [t] = transformTrails(fixture('trails-split.json'));
    assert.equal(t.id, 'relation/200');
    assert.equal(t.name, 'Trail S2');
    assert.equal(t.segments.length, 2);
    assert.equal(t.clipped, true, 'way 99 is outside the area');
    assert.ok(t.lengthKm > 0.5);
});

test('Overpass error remarks are treated as failures', () => {
    assert.throws(() => checkOverpassResponse({ elements: [], remark: 'runtime error: Query run out of memory using about 2048 MB of RAM.' }), /out of memory/);
    assert.doesNotThrow(() => checkOverpassResponse({ elements: [] }));
});

test('trails query fetches relation bodies and clipped ways', () => {
    assert.match(trailsQuery(), /\.r out body;/);
    assert.match(trailsQuery(), /way\(r\.r\)\(45\.49,10\.15,45\.6,10\.33\);\s*out geom;/);
});
