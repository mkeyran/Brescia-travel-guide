// OpenStreetMap queries and transforms for the Brescia guide.
// Everything shown in the app comes from here: no hand-written place data.

// south, west, north, east — the city plus the hills around it
// (Colle Cidneo, Monte Maddalena, Sant'Eufemia, Colle San Giuseppe).
export const BBOX = [45.49, 10.15, 45.6, 10.33];

const FOOD_SHOPS = [
    'bakery', 'pastry', 'cheese', 'deli', 'greengrocer', 'butcher', 'wine',
    'coffee', 'confectionery', 'chocolate', 'pasta', 'farm', 'ice_cream',
    'dairy', 'tea', 'spices', 'honey', 'seafood'
];

export function placesQuery(bbox = BBOX) {
    const b = bbox.join(',');
    return `[out:json][timeout:180][bbox:${b}];
(
  nwr["shop"~"^(${FOOD_SHOPS.join('|')})$"];
  nwr["amenity"="ice_cream"];
  nwr["amenity"="marketplace"];
  nwr["tourism"="viewpoint"];
  nwr["tourism"="picnic_site"];
  nwr["historic"]["name"];
  nwr["tourism"~"^(museum|attraction|artwork)$"]["name"];
  nwr["amenity"="place_of_worship"]["wikidata"];
  nwr["amenity"="fountain"]["name"];
  nwr["leisure"~"^(park|nature_reserve)$"]["name"];
  nwr["amenity"="drinking_water"];
  nwr["amenity"="toilets"];
);
out center tags;`;
}

// Relations come without geometry (long-distance routes like the E-paths
// would be enormous); only their ways inside the area come with geometry.
export function trailsQuery(bbox = BBOX) {
    const b = bbox.join(',');
    return `[out:json][timeout:180];
relation["type"="route"]["route"~"^(hiking|foot)$"](${b})->.r;
.r out body;
way(r.r)(${b});
out geom;`;
}

// Overpass reports timeouts and memory errors as HTTP 200 with a "remark".
export function checkOverpassResponse(json) {
    if (json?.remark && /error/i.test(json.remark)) throw new Error(`Overpass: ${json.remark}`);
    return json;
}

const FOOD_LABELS = {
    bakery: 'Bakery (panificio)',
    pastry: 'Pastry shop (pasticceria)',
    cheese: 'Cheese shop (formaggeria)',
    deli: 'Deli (salumeria / gastronomia)',
    greengrocer: 'Greengrocer (frutta e verdura)',
    butcher: 'Butcher (macelleria)',
    wine: 'Wine shop (enoteca)',
    coffee: 'Coffee shop / roaster',
    confectionery: 'Sweet shop',
    chocolate: 'Chocolate shop',
    pasta: 'Fresh pasta (pastificio)',
    farm: 'Farm shop',
    ice_cream: 'Gelateria',
    dairy: 'Dairy (latteria)',
    tea: 'Tea shop',
    spices: 'Spice shop',
    honey: 'Honey shop',
    seafood: 'Fishmonger (pescheria)'
};

const HISTORIC_LABELS = {
    castle: 'Castle', fort: 'Fortification', tower: 'Tower', city_gate: 'City gate',
    citywalls: 'City walls', archaeological_site: 'Archaeological site', ruins: 'Ruins',
    monument: 'Monument', memorial: 'Memorial', church: 'Historic church',
    chapel: 'Chapel', monastery: 'Monastery', palace: 'Palazzo', manor: 'Villa',
    building: 'Historic building', aqueduct: 'Aqueduct', wayside_shrine: 'Wayside shrine',
    wayside_cross: 'Wayside cross', fountain: 'Historic fountain', bridge: 'Historic bridge',
    milestone: 'Milestone', mine: 'Old mine', lime_kiln: 'Lime kiln', mill: 'Mill',
    yes: 'Historic site'
};

// Skip things that are numerous but not worth a walk.
function isNoise(t) {
    if (t.historic === 'memorial' && ['plaque', 'stolperstein', 'blue_plaque'].includes(t.memorial)) return true;
    if (['boundary_stone', 'district', 'tomb', 'grave'].includes(t.historic)) return true;
    return false;
}

export function classifyPlace(t) {
    if (isNoise(t)) return null;
    if (FOOD_SHOPS.includes(t.shop)) {
        return t.name ? { category: 'food', kind: FOOD_LABELS[t.shop] } : null;
    }
    if (t.amenity === 'ice_cream') {
        return t.name ? { category: 'food', kind: FOOD_LABELS.ice_cream } : null;
    }
    if (t.amenity === 'marketplace') return { category: 'food', kind: 'Market (mercato)' };
    if (t.tourism === 'viewpoint') return { category: 'nature', kind: 'Viewpoint' };
    if (t.tourism === 'picnic_site') return { category: 'nature', kind: 'Picnic spot' };
    if (t.leisure === 'nature_reserve') return { category: 'nature', kind: 'Nature reserve' };
    if (t.leisure === 'park') return { category: 'nature', kind: 'Park' };
    if (t.tourism === 'artwork') return { category: 'art', kind: artworkLabel(t.artwork_type) };
    if (t.historic) return { category: 'heritage', kind: HISTORIC_LABELS[t.historic] || 'Historic site' };
    if (t.tourism === 'museum') return { category: 'heritage', kind: 'Museum' };
    if (t.amenity === 'place_of_worship') return { category: 'heritage', kind: 'Church' };
    if (t.amenity === 'fountain') return { category: 'heritage', kind: 'Fountain' };
    if (t.tourism === 'attraction') return { category: 'heritage', kind: 'Sight' };
    if (t.amenity === 'drinking_water') return { category: 'essentials', kind: 'Drinking water' };
    if (t.amenity === 'toilets') return { category: 'essentials', kind: 'Public toilet' };
    return null;
}

function artworkLabel(type) {
    const labels = {
        mural: 'Mural', graffiti: 'Street art', statue: 'Statue', sculpture: 'Sculpture',
        relief: 'Relief', fresco: 'Fresco', mosaic: 'Mosaic', installation: 'Installation',
        bust: 'Bust'
    };
    return labels[type] || 'Artwork';
}

const KEEP_TAGS = [
    'opening_hours', 'website', 'contact:website', 'phone', 'contact:phone',
    'addr:street', 'addr:housenumber', 'wikipedia', 'wikidata', 'description',
    'description:en', 'fee', 'wheelchair', 'organic', 'artist_name', 'start_date',
    'heritage', 'denomination', 'name:en', 'artwork_type', 'drinking_water'
];

const round = n => Math.round(n * 1e5) / 1e5;

export function transformPlaces(overpassJson) {
    const places = [];
    for (const el of overpassJson.elements || []) {
        const t = el.tags || {};
        const lat = el.lat ?? el.center?.lat;
        const lng = el.lon ?? el.center?.lon;
        if (lat == null || lng == null) continue;
        const cls = classifyPlace(t);
        if (!cls) continue;
        const tags = {};
        for (const k of KEEP_TAGS) if (t[k]) tags[k] = t[k];
        places.push({
            id: `${el.type}/${el.id}`,
            name: t.name || cls.kind,
            unnamed: !t.name,
            category: cls.category,
            kind: cls.kind,
            lat: round(lat),
            lng: round(lng),
            tags
        });
    }
    return places;
}

// Haversine distance in km.
export function distanceKm(a, b) {
    const R = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLng = (b[1] - a[1]) * Math.PI / 180;
    const s = Math.sin(dLat / 2) ** 2 +
        Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
}

function lineLengthKm(coords) {
    let km = 0;
    for (let i = 1; i < coords.length; i++) km += distanceKm(coords[i - 1], coords[i]);
    return km;
}

// Long-distance routes passing through get clipped to the area around the city.
const CLIP_MARGIN = 0.08;

function inClipBox([lat, lng], bbox) {
    return lat >= bbox[0] - CLIP_MARGIN && lat <= bbox[2] + CLIP_MARGIN &&
        lng >= bbox[1] - CLIP_MARGIN && lng <= bbox[3] + CLIP_MARGIN;
}

// Accepts member geometry inline (out geom on relations) or as separate
// way elements (the current query).
export function transformTrails(overpassJson, bbox = BBOX) {
    const elements = overpassJson.elements || [];
    const wayGeometry = new Map();
    for (const el of elements) {
        if (el.type === 'way' && el.geometry) wayGeometry.set(el.id, el.geometry);
    }

    const trails = [];
    for (const el of elements) {
        if (el.type !== 'relation') continue;
        const t = el.tags || {};
        const segments = [];
        let clipped = false;
        for (const m of el.members || []) {
            if (m.type !== 'way') continue;
            const geometry = (m.geometry || wayGeometry.get(m.ref) || []).filter(p => p && p.lat != null);
            if (geometry.length < 2) {
                clipped = true;
                continue;
            }
            const coords = geometry.map(p => [round(p.lat), round(p.lon)]);
            if (!coords.some(c => inClipBox(c, bbox))) {
                clipped = true;
                continue;
            }
            segments.push(coords);
        }
        if (!segments.length) continue;
        const lengthKm = segments.reduce((sum, s) => sum + lineLengthKm(s), 0);
        if (lengthKm < 0.3) continue;
        trails.push({
            id: `relation/${el.id}`,
            name: trailName(t, el.id),
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
            lengthKm: Math.round(lengthKm * 10) / 10,
            clipped,
            segments
        });
    }
    return trails;
}

function trailName(t, id) {
    if (t.name) return t.name;
    if (t.ref && t.operator) return `${t.operator} ${t.ref}`;
    if (t.ref) return `Trail ${t.ref}`;
    if (t.from && t.to) return `${t.from} – ${t.to}`;
    return `Trail (OSM ${id})`;
}
