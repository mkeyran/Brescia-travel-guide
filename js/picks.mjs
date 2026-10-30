// Hand-picked places and walks: the opinion layer of the guide.
//
// Rules for this file:
// - Every place must be backed by the sources in `evidence` (checked October 2026).
// - Facts (dates, addresses, hours) come from those sources; opinions are
//   in `why` and `tip` and are labelled as such in the app.
// - `confidence: 'check'` means the place is documented but the evidence is
//   old or incomplete; the app tells people to confirm before walking there.
// - No coordinates are typed in by hand. `find.near` is only a rough hint
//   used to pick the right OpenStreetMap match; the build resolves the real
//   position (and falls back to the verified `address`).

export const CHECKED = '2026-10';

export const PICKS = [
    // ---------- See ----------
    {
        id: 'nazaro-celso',
        category: 'heritage',
        icon: '🖼️',
        name: 'Santi Nazaro e Celso — Titian\'s Averoldi Polyptych',
        address: 'Corso Matteotti 31, Brescia',
        why: 'A Titian altarpiece, signed and dated 1522, still on the high altar it was painted for, in a church most visitors never enter. If you plan one morning around a single thing in Brescia, make it this.',
        caution: 'Opening is very limited: one listing gives Sunday 8:30–9:30 and 11:00–12:00 only. Confirm with the parish (+39 030 3754387) before going.',
        confidence: 'confirmed',
        evidence: [
            { label: 'italia.it', url: 'https://www.italia.it/en/lombardy/brescia/chiesa-dei-santi-nazario-e-celso' },
            { label: 'Finestre sull\'Arte', url: 'https://www.finestresullarte.info/mostre/brescia-mostra-a-tu-per-tu-con-tiziano' }
        ],
        find: { name: 'Nazar[i]?o e Celso', near: [45.5352, 10.2130], radius: 900 }
    },
    {
        id: 'san-giovanni',
        category: 'heritage',
        icon: '🎨',
        name: 'San Giovanni Evangelista — Moretto vs Romanino',
        why: 'The Chapel of the Sacrament: in 1521 two Brescian painters were hired to decorate it side by side, and it became the emblem of their rivalry. Romanino has the left wall, Moretto the right. Stand in the middle and decide who won.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Comune di Brescia', url: 'https://comune.brescia.it/node/17195' },
            { label: 'Wikipedia (Romanino\'s Supper)', url: 'https://en.wikipedia.org/wiki/The_Feast_in_the_House_of_Simon_the_Pharisee_(Romanino)' }
        ],
        find: { name: 'San Giovanni Evangelista', near: [45.5425, 10.2160], radius: 900 }
    },
    {
        id: 'miracoli',
        category: 'heritage',
        icon: '⛪',
        name: 'Santa Maria dei Miracoli — the carved façade',
        address: 'Corso Martiri della Libertà, Brescia',
        why: 'A marble Renaissance façade from 1487–90, carved so densely it reads like lace. Seeing it from the street takes two minutes, but don\'t skip it.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Santa_Maria_dei_Miracoli,_Brescia' },
            { label: 'Visit Brescia', url: 'https://visitbrescia.it/attivita/chiesa-di-santa-maria-dei-miracoli' }
        ],
        find: { name: 'Miracoli', near: [45.5365, 10.2145], radius: 900 }
    },
    {
        id: 'san-francesco',
        category: 'heritage',
        icon: '🕊️',
        name: 'San Francesco d\'Assisi — the cloisters',
        address: 'Via San Francesco d\'Assisi 1, Brescia',
        why: 'A Romanesque-Gothic Franciscan church with a Moretto altarpiece. The real reason to come is the cloisters of the convent next door, which are a good place to sit for ten quiet minutes in the middle of town.',
        caution: 'Hours differ between sources (one says 7:00–19:00 Mon–Sat, 15:00–19:00 Sun).',
        confidence: 'confirmed',
        evidence: [
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/San_Francesco,_Brescia' },
            { label: 'in-lombardia', url: 'https://www.in-lombardia.it/en/church-san-francesco-dassisi' }
        ],
        find: { name: 'San Francesco', near: [45.5375, 10.2155], radius: 700, filter: '["amenity"="place_of_worship"]' }
    },
    {
        id: 'carmine',
        category: 'heritage',
        icon: '🏘️',
        name: 'Contrada del Carmine',
        why: 'The old popular quarter: social housing, young artisans\' workshops, noble palazzi and the city\'s multi-ethnic heart, all in a few streets. It\'s best for wandering without a plan. Its church, Santa Maria del Carmine, is second in size only to the Duomo Nuovo.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Brescia Tourism', url: 'https://bresciatourism.it/en/things-to-do/carmine-old-district' },
            { label: 'in-lombardia', url: 'https://www.in-lombardia.it/en/church-santa-maria-del-carmine' }
        ],
        find: { name: 'Santa Maria del Carmine', near: [45.5428, 10.2140], radius: 900 }
    },
    {
        id: 'duomo-vecchio',
        category: 'heritage',
        icon: '⭕',
        name: 'Duomo Vecchio (La Rotonda)',
        why: 'A round Romanesque cathedral that sits below the level of the square, with the crypt of San Filastrio underneath, reached by two small staircases under the presbytery. It\'s unlike any other church you\'ll see on this trip.',
        caution: 'One undated listing gives 8:00–12:00 and 15:00–19:00 daily.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Old_Cathedral,_Brescia' },
            { label: 'Visit Brescia', url: 'https://visitbrescia.it/attivita/piazza-paolo-vi-brescia' }
        ],
        find: { name: 'Duomo Vecchio|Rotonda|Santa Maria Assunta', near: [45.5388, 10.2219], radius: 600 }
    },
    {
        id: 'pallata',
        category: 'heritage',
        icon: '🗼',
        name: 'Torre della Pallata & the two-rivers fountain',
        why: 'A 13th-century stone tower that once guarded a city gate, with a 1597 fountain at its foot whose statues are the Mella and Garza rivers. It marks the edge of the centre and makes an easy meeting point.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Pallata_Tower,_Brescia' },
            { label: 'Comune di Brescia', url: 'https://www.comune.brescia.it/node/17219' }
        ],
        find: { name: 'Pallata', near: [45.5406, 10.2163], radius: 700 }
    },
    {
        id: 'capitolium',
        category: 'heritage',
        icon: '🏛️',
        name: 'Capitolium & Roman theatre (Brixia)',
        address: 'Via dei Musei 55, Brescia',
        why: 'This one is famous and worth it anyway: a Roman temple and theatre with the Winged Victory bronze, in the largest archaeological park in northern Italy. Get the combined UNESCO ticket with Santa Giulia.',
        caution: 'Listed as closed Mondays, open Tue–Sun 10:00–18:00; combined ticket about €15. Check bresciamusei.com.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Brescia Musei', url: 'https://www.bresciamusei.com/en/museums-and-venues/brixia-roman-archaeological-area/' },
            { label: 'italia.it', url: 'https://italia.it/en/lombardy/brescia/brixia-parco-archeologico-di-brescia-romana' }
        ],
        find: { name: 'Capitolium|Tempio Capitolino', near: [45.5404, 10.2238], radius: 600 }
    },
    {
        id: 'castello',
        category: 'heritage',
        icon: '🏰',
        name: 'Castello — walls, observatory, relief passage',
        why: 'The castle grounds are free, and the walls have the best view over the roofs. Look for the Specola Cidnea on the San Marco bastion, Italy\'s first public astronomical observatory (1953). Ask about the Strada del Soccorso, the castle\'s historic relief passage, which you can visit with a guide.',
        caution: 'Grounds hours differ between sources (8:00–20:00 or 7:00–23:00). The passage and underground tunnels need a guided visit; book ahead.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Brescia Tourism: castle secrets', url: 'https://bresciatourism.it/en/things-to-do/discover-secrets-brescia-castle' },
            { label: 'Museo di Scienze: Specola', url: 'https://museoscienze.comune.brescia.it/en/?p=1139' }
        ],
        find: { name: 'Castello di Brescia|^Castello$', near: [45.5430, 10.2240], radius: 800 }
    },
    {
        id: 'vantiniano',
        category: 'heritage',
        icon: '🕯️',
        name: 'Cimitero Vantiniano',
        address: 'Via Milano 17, Brescia',
        why: 'Brescia\'s monumental cemetery by the architect Rodolfo Vantini, with a 60 m "lighthouse" tower that holds his statue and arcades full of 19th-century sculpture. Almost no tourists come here. It\'s a working cemetery, so be quiet and respectful.',
        caution: 'One listing gives 8:30–17:30 daily. Parts are under restoration (2026–28 programme).',
        confidence: 'confirmed',
        evidence: [
            { label: 'museionline', url: 'https://museionline.info/lombardia-musei-monumenti/cimitero-monumentale-di-brescia' },
            { label: 'Ministero della Cultura', url: 'https://cultura.gov.it/evento/patrimonio-monumentale-a-rischio-cimitero-vantiniano-di-brescia' }
        ],
        find: { name: 'Vantiniano|Cimitero Monumentale', near: [45.5435, 10.2000], radius: 1500 }
    },
    {
        id: 'mille-miglia',
        category: 'heritage',
        icon: '🏎️',
        name: 'Museo Mille Miglia',
        address: 'Viale della Bornata 123, Brescia',
        why: 'The old road race\'s cars, shown inside the former monastery of Sant\'Eufemia, founded in 1008. It\'s on the eastern edge of the city, so pair it with Monte Maddalena.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Museo Mille Miglia', url: 'https://museomillemiglia.it/it/contatti.php' },
            { label: 'Lonely Planet', url: 'https://www.lonelyplanet.com/points-of-interest/museo-mille-miglia/1256720' }
        ],
        find: { name: 'Mille Miglia', near: [45.5290, 10.2760], radius: 2500 }
    },

    // ---------- Outdoors ----------
    {
        id: 'maddalena',
        category: 'nature',
        icon: '⛰️',
        name: 'Monte Maddalena from the city',
        why: 'Brescia\'s own mountain, which you can climb straight from town. The serious way up is CAI trails 901 and 902: about 9.7 km and 690 m of climb, around 4¼ h, rated hard. For an easier day, the 915 "Fiamme Verdi" loop is about 9 km with 200 m of climb, graded T (easy).',
        tip: 'Turn on 🥾 CAI trails and search "901" to see the path and download a GPX.',
        caution: 'Distances and times come from hiking sites (Komoot, Gulliver) and are approximate.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Gulliver: Maddalena from Parco Leopardi', url: 'https://www.gulliver.it/itinerari/maddalena-colle-della-dal-parco-leopardi-percorso-n-16/2019/10/06/187566/' },
            { label: 'Climbfinder', url: 'https://climbfinder.com/en/climbs/monte-maddalena-brescia' }
        ],
        find: { name: 'Maddalena', near: [45.5480, 10.2850], radius: 3500, filter: '["natural"="peak"]' }
    },
    {
        id: 'parco-cave',
        category: 'nature',
        icon: '🦆',
        name: 'Parco delle Cave — the quarry lakes',
        why: 'Old gravel quarries turned into about 960 ha of lakes and paths on the south-east edge of the city; the first lakes opened in 2018. The city\'s own "Giro del Parco delle Cave" trek takes about 3¼ hours. It\'s the best long flat walk Brescia has.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Comune: urban treks (PDF)', url: 'https://comune.brescia.it/sites/default/files/2025-02/59.%20TREKKING%20URBANI.pdf' },
            { label: 'Comune: Parco delle Cave (PDF)', url: 'https://comune.brescia.it/sites/default/files/2025-02/43.%20B%20PARCO%20TERRITORIALE%20DELLE%20CAVE.pdf' }
        ],
        find: { name: 'Parco delle Cave', near: [45.5150, 10.2600], radius: 4000 }
    },

    // ---------- Food (shops and markets, no restaurants) ----------
    {
        id: 'veneto',
        category: 'food',
        icon: '🍰',
        name: 'Pasticceria Veneto (Iginio Massari)',
        address: 'Via Salvo D\'Acquisto 8, Brescia',
        why: 'The first shop of Italy\'s best-known pastry chef, open since 1971. Take something with you for the walk. In the weeks before Christmas, the panettone queue is part of the experience.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Iginio Massari', url: 'https://www.iginiomassari.it/en/pages/pasticceria-veneto-brescia' },
            { label: 'Gambero Rosso', url: 'https://www.gamberorosso.it/ristoranti/pasticceria/pasticceria-veneto/' }
        ],
        find: { name: 'Veneto|Massari', near: [45.5300, 10.2280], radius: 3000, filter: '["shop"]' }
    },
    {
        id: 'boglioni',
        category: 'food',
        icon: '🍝',
        name: 'Pastificio Boglioni — fresh casoncelli',
        address: 'Via Carlo Cattaneo 28/A, Brescia',
        why: 'If you have a kitchen, this is the move: fresh casoncelli from a family pastificio by the Roman forum (same family since 1986). Cook them with butter and sage.',
        caution: 'Mornings only, closed Monday, per one listing. Phone +39 030 375 7243.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Brescia DUC', url: 'https://www.brescia.eu/it/duc/pastificio-boglioni' },
            { label: 'Reviews', url: 'https://italiarecensioni.com/lombardy/pastificio-boglioni-265890' }
        ],
        find: { name: 'Boglioni', near: [45.5408, 10.2215], radius: 1000 }
    },
    {
        id: 'sarioli',
        category: 'food',
        icon: '🥖',
        name: 'Il Pane di Maurizio Sarioli',
        address: 'Via dei Musei 18A, Brescia',
        why: 'Gambero Rosso gave it a top "Tre Pani" rating in the 2025 bread guide. It\'s on the way up to the castle, so buy your picnic bread and focaccia here.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Gambero Rosso: Pane e panettieri 2025', url: 'https://www.gamberorosso.it/notizie/migliori-panifici-italia/' },
            { label: 'Tripadvisor', url: 'https://www.tripadvisor.it/ShowUserReviews-g194702-d6572105-r367314980-Il_Pane_di_Maurizio_Sarioli-Brescia_Province_of_Brescia_Lombardy.html' }
        ],
        find: { name: 'Sarioli', near: [45.5402, 10.2225], radius: 1000 }
    },
    {
        id: 'gigola',
        category: 'food',
        icon: '🧀',
        name: 'Gastronomia Gigola — Bagòss',
        address: 'Via Marcantonio Ducco 15, Brescia',
        why: 'A gastronomia that sells Bagòss d\'alpeggio DOP and Nostrano Valtrompia DOP, the two local cheeses to try. Ask for a piece to take away.',
        caution: 'I couldn\'t find current opening hours, and the shop\'s own page is a few years old.',
        confidence: 'check',
        evidence: [
            { label: 'Gastronomia Gigola', url: 'https://www.gastronomiagigola.it/salumi-e-formaggi/' }
        ],
        find: { name: 'Gigola', near: [45.5440, 10.2080], radius: 3000 }
    },
    {
        id: 'lanzani',
        category: 'food',
        icon: '🍷',
        name: 'Lanzani Bottega',
        address: 'Via Albertano da Brescia 41, Brescia',
        why: 'A former family butcher\'s, now a gourmet shop, bistro and wine bar. Treat it as a shop: salumi, prosciutto and a bottle to take away.',
        caution: 'italia.it lists Wednesday–Saturday only.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Michelin Guide', url: 'https://guide.michelin.com/en/lombardia/brescia/restaurant/lanzani-bottega-bistrot' },
            { label: 'italia.it', url: 'https://www.italia.it/de/lombardei/brescia/gastronomie/lanzani-bottega---bistrot' }
        ],
        find: { name: 'Lanzani', near: [45.5370, 10.1990], radius: 3000 }
    },
    {
        id: 'pan-per-focaccia',
        category: 'food',
        icon: '🫓',
        name: 'Pan per Focaccia',
        address: 'Via Sabotino 6, Brescia',
        why: 'A sourdough bakery that is good for focaccia. It\'s a useful alternative north of the centre.',
        caution: 'The sources list two addresses (Via Sabotino 6 and Via Vittorio Veneto 57); confirm which is the shop.',
        confidence: 'check',
        evidence: [
            { label: 'Italian Gourmet', url: 'https://www.italiangourmet.it/pan-per-focaccia-a-brescia-il-pane-come-una-volta/' },
            { label: 'Pagine Gialle', url: 'https://www.paginegialle.it/panperfocaccia-brescia' }
        ],
        find: { name: 'Pan per Focaccia', near: [45.5470, 10.2150], radius: 3000 }
    },
    {
        id: 'bedont',
        category: 'food',
        icon: '🍨',
        name: 'Bedont — gelato',
        address: 'Via Trento 18/b, Brescia',
        why: 'An artisan gelateria in Borgo Trento with a 70s feel, which appeared in Dissapore\'s top-100 gelaterie list.',
        caution: 'That ranking dates from 2015; I found no recent confirmation that it is still open. Phone +39 030 338 5581.',
        confidence: 'check',
        evidence: [
            { label: 'Dissapore 2015', url: 'https://www.dissapore.com/grande-notizia/100-migliori-gelaterie-artigianali-2015/' },
            { label: 'Wanderlog', url: 'https://wanderlog.com/place/details/3269683/bedont-di-roberto-bedont' }
        ],
        find: { name: 'Bedont', near: [45.5490, 10.2150], radius: 3000 }
    },
    {
        id: 'porteri',
        category: 'food',
        icon: '🥓',
        name: 'Salumeria Porteri',
        address: 'Via Trento, Brescia',
        why: 'A salumeria next to the old Trattoria Porteri, stocked almost entirely from local historic producers, including Bagòss.',
        caution: 'The source is an older article; I found no street number or current hours.',
        confidence: 'check',
        evidence: [
            { label: 'Weekend Premium', url: 'https://www.weekendpremium.it/weekend-gourmet-a-brescia-golosita-e-2-ricette-cucina-di-famiglia/' }
        ],
        find: { name: 'Porteri', near: [45.5490, 10.2150], radius: 3000 }
    },
    {
        id: 'cascina-maggia',
        category: 'food',
        icon: '🧺',
        name: 'Cascina Maggia — Saturday organic market',
        address: 'Via della Maggia 3, Brescia',
        why: 'A farm courtyard that hosts an organic market every Saturday morning, the closest thing to a real farmers\' market I could document in the city.',
        caution: 'The only listing is from 2015 (Saturday 8:00–12:30). Confirm it still runs before going.',
        confidence: 'check',
        evidence: [
            { label: 'Provincia di Brescia (2015 PDF)', url: 'https://old.provincia.brescia.it/sites/default/files/allegati/documenti/7207/mercati_contadini_bio_km0.pdf' }
        ],
        find: { name: 'Maggia', near: [45.5600, 10.2100], radius: 5000 }
    }
];

export const WALKS = [
    {
        id: 'walk-renaissance',
        name: 'Titian, Moretto & Romanino',
        when: 'Sunday morning, starting at 11:00',
        stops: ['nazaro-celso', 'miracoli', 'san-francesco', 'pallata', 'san-giovanni', 'carmine'],
        pitch: 'Brescia\'s best Renaissance painting is in its churches, not its museums. Start at Santi Nazaro e Celso during its short Sunday opening, then walk north through the centre, take in the Miracoli façade and the Franciscan cloisters on the way, and end by wandering the Carmine.'
    },
    {
        id: 'walk-picnic',
        name: 'Bread, ruins & a castle picnic',
        when: 'Any day except Monday (Capitolium closed); bakery mornings',
        stops: ['duomo-vecchio', 'sarioli', 'capitolium', 'castello'],
        pitch: 'Look into the Rotonda, buy bread at Sarioli, pass the Roman temple, and climb Colle Cidneo to eat on the castle walls. It\'s short, but the climb at the end is real.'
    },
    {
        id: 'walk-west',
        name: 'The quiet west: Carmine to the Vantiniano',
        when: 'Wednesday–Saturday, so Lanzani is open',
        stops: ['pallata', 'carmine', 'vantiniano', 'lanzani'],
        pitch: 'From the tower through the Carmine and out to the monumental cemetery, which is the least touristy great sight in Brescia. End by shopping for salumi and wine at Lanzani.'
    }
];

const esc = s => s.replace(/"/g, '\\"');

// One Overpass request that looks up every pick by name near its hint.
export function picksQuery(picks = PICKS) {
    const parts = picks.map(p => {
        const [lat, lng] = p.find.near;
        return `  nwr["name"~"${esc(p.find.name)}",i]${p.find.filter || ''}(around:${p.find.radius},${lat},${lng});`;
    });
    return `[out:json][timeout:120];\n(\n${parts.join('\n')}\n);\nout center tags;`;
}

function km(a, b) {
    const R = 6371;
    const dLat = (b[0] - a[0]) * Math.PI / 180;
    const dLng = (b[1] - a[1]) * Math.PI / 180;
    const s = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * Math.PI / 180) * Math.cos(b[0] * Math.PI / 180) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(s));
}

// Picks the OSM element nearest to each pick's hint whose name matches.
export function resolvePicks(overpassJson, picks = PICKS) {
    const elements = (overpassJson.elements || []).map(el => ({
        el,
        pos: el.lat != null ? [el.lat, el.lon] : el.center ? [el.center.lat, el.center.lon] : null
    })).filter(e => e.pos && e.el.tags?.name);

    return picks.map(p => {
        const re = new RegExp(p.find.name, 'i');
        let best = null;
        for (const e of elements) {
            if (!re.test(e.el.tags.name)) continue;
            const d = km(p.find.near, e.pos) * 1000;
            if (d <= p.find.radius && (!best || d < best.d)) best = { ...e, d };
        }
        const { find, ...rest } = p;
        if (!best) return { ...rest, lat: null, lng: null, located: null };
        return {
            ...rest,
            lat: Math.round(best.pos[0] * 1e5) / 1e5,
            lng: Math.round(best.pos[1] * 1e5) / 1e5,
            located: { by: 'osm', osm: `${best.el.type}/${best.el.id}`, osmName: best.el.tags.name }
        };
    });
}

// FOSSGIS public OSRM server, foot profile.
export function walkRouteUrl(points) {
    const coords = points.map(([lat, lng]) => `${lng},${lat}`).join(';');
    return `https://routing.openstreetmap.de/routed-foot/route/v1/driving/${coords}?overview=full&geometries=geojson`;
}

export function buildWalks(resolvedPicks, routes = {}, walks = WALKS) {
    const byId = Object.fromEntries(resolvedPicks.map(p => [p.id, p]));
    return walks.map(w => {
        const stops = w.stops.map(id => byId[id]).filter(p => p && p.lat != null).map(p => p.id);
        const route = routes[w.id] || null;
        return {
            ...w,
            stops,
            missing: w.stops.filter(id => !stops.includes(id)),
            path: route?.path || null,
            distanceKm: route ? Math.round(route.distance / 100) / 10 : null,
            minutes: route ? Math.round(route.duration / 60) : null
        };
    });
}
