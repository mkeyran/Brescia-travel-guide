import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PICKS, WALKS, picksQuery, resolvePicks, buildWalks } from '../js/picks.mjs';

const CATEGORIES = new Set(['food', 'heritage', 'nature']);

test('every pick is complete and sourced', () => {
    const ids = new Set();
    for (const p of PICKS) {
        assert.ok(!ids.has(p.id), `duplicate id ${p.id}`);
        ids.add(p.id);
        assert.ok(CATEGORIES.has(p.category), `${p.id}: category`);
        assert.ok(p.name && p.icon && p.why, `${p.id}: name/icon/why`);
        assert.ok(['confirmed', 'check'].includes(p.confidence), `${p.id}: confidence`);
        assert.ok(p.evidence.length >= 1, `${p.id}: needs a source`);
        for (const e of p.evidence) assert.match(e.url, /^https:\/\//, `${p.id}: source url`);
        assert.ok(p.find?.name && p.find.near?.length === 2 && p.find.radius > 0, `${p.id}: find`);
        assert.ok(p.find.q?.length || p.find.coords?.length === 2, `${p.id}: needs lookup queries or sourced coordinates`);
        assert.doesNotThrow(() => new RegExp(p.find.name, 'i'), `${p.id}: regex`);
        assert.equal(p.lat, undefined, `${p.id}: no hand-typed coordinates`);
    }
});

test('walks only use existing picks', () => {
    const ids = new Set(PICKS.map(p => p.id));
    for (const w of WALKS) {
        assert.ok(w.stops.length >= 2, `${w.id}: stops`);
        for (const s of w.stops) assert.ok(ids.has(s), `${w.id}: unknown stop ${s}`);
        assert.ok(w.pitch && w.when, `${w.id}: pitch/when`);
    }
});

test('picks query has one lookup per pick', () => {
    const q = picksQuery();
    assert.equal((q.match(/around:/g) || []).length, PICKS.length);
    assert.match(q, /out center tags;/);
});

test('resolvePicks takes the nearest matching name inside the radius', () => {
    const pick = PICKS.find(p => p.id === 'san-francesco');
    const [lat, lng] = pick.find.near;
    const json = { elements: [
        { type: 'node', id: 1, lat: lat + 0.02, lon: lng, tags: { name: 'San Francesco far away' } },
        { type: 'node', id: 2, lat: lat + 0.002, lon: lng, tags: { name: 'Chiesa di San Francesco' } },
        { type: 'way', id: 3, center: { lat: lat + 0.001, lon: lng }, tags: { name: 'Chiesa di San Francesco d\'Assisi' } },
        { type: 'node', id: 4, lat, lon: lng, tags: { name: 'Bar Centrale' } }
    ] };
    const r = resolvePicks(json, [pick])[0];
    assert.equal(r.located.osm, 'way/3');
    assert.equal(r.find, undefined, 'lookup hints are not shipped');

    const none = resolvePicks({ elements: [json.elements[0]] }, [pick])[0];
    assert.equal(none.lat, null);
    assert.equal(none.located, null);
});

test('buildWalks drops unlocated stops and keeps route stats', () => {
    const picks = resolvePicks({ elements: [] }).map(p => p.id === 'pallata' || p.id === 'carmine' ? { ...p, lat: 45.54, lng: 10.21 } : p);
    const west = buildWalks(picks, { 'walk-west': { path: [[45.54, 10.21], [45.55, 10.22]], distance: 3456, duration: 2700 } })
        .find(w => w.id === 'walk-west');
    assert.deepEqual(west.stops, ['pallata', 'carmine']);
    assert.deepEqual(west.missing, ['curt-dei-puli', 'vantiniano']);
    assert.equal(west.distanceKm, 3.5);
    assert.equal(west.minutes, 45);
});
