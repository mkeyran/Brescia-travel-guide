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
        find: { q: ['Santi Nazaro e Celso, Brescia'], name: 'Nazar[i]?o e Celso', near: [45.5352, 10.2130], radius: 900 }
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
        find: { q: ['Chiesa di San Giovanni Evangelista, Brescia'], name: 'San Giovanni Evangelista', near: [45.5425, 10.2160], radius: 900 }
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
        find: { q: ['Chiesa di Santa Maria dei Miracoli, Brescia'], name: 'Miracoli', near: [45.5365, 10.2145], radius: 900 }
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
        find: { q: ['Chiesa di San Francesco d\'Assisi, Brescia'], name: 'San Francesco', near: [45.5375, 10.2155], radius: 700, filter: '["amenity"="place_of_worship"]' }
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
        find: { q: ['Chiesa di Santa Maria del Carmine, Brescia'], name: 'Santa Maria del Carmine', near: [45.5428, 10.2140], radius: 900 }
    },
    {
        id: 'duomo-vecchio',
        category: 'heritage',
        icon: '⭕',
        name: 'Duomo Vecchio (La Rotonda)',
        why: 'A round Romanesque cathedral that sits below the level of the square, with the crypt of San Filastrio underneath, reached by two small staircases under the presbytery. It\'s unlike any other church you\'ll see on this trip.',
        tip: 'Outside, look between two of the windows on the curved wall: there is a fossil shell in the stone blocks.',
        caution: 'One undated listing gives 8:00–12:00 and 15:00–19:00 daily.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Old_Cathedral,_Brescia' },
            { label: 'Giornale di Brescia: 10 hidden corners', url: 'https://www.giornaledibrescia.it/storie/10-cose-fare-brescia-b8wynt0o' },
            { label: 'Visit Brescia', url: 'https://visitbrescia.it/attivita/piazza-paolo-vi-brescia' }
        ],
        find: { q: ['Concattedrale invernale di Santa Maria Assunta, Brescia', 'Duomo Vecchio, Brescia'], name: 'Duomo Vecchio|Rotonda|Santa Maria Assunta', near: [45.5388, 10.2219], radius: 600 }
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
        find: { q: ['Torre della Pallata, Brescia'], name: 'Pallata', near: [45.5406, 10.2163], radius: 700 }
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
        find: { q: ['Tempio Capitolino, Brescia', 'Capitolium, Brescia'], name: 'Capitolium|Tempio Capitolino', near: [45.5404, 10.2238], radius: 600 }
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
        find: { q: ['Castello di Brescia'], name: 'Castello di Brescia|^Castello$', near: [45.5430, 10.2240], radius: 800 }
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
        find: { q: ['Cimitero Vantiniano, Brescia'], name: 'Vantiniano|Cimitero Monumentale', near: [45.5435, 10.2000], radius: 1500 }
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
        find: { q: ['Museo Mille Miglia, Brescia'], name: 'Mille Miglia', near: [45.5290, 10.2760], radius: 2500 }
    },

    {
        id: 'underground',
        category: 'heritage',
        icon: '🔦',
        name: 'Brescia Underground — the rivers under the centre',
        why: 'The Bova, Garza and other streams still run in tunnels under the old town, and a volunteer association takes small groups through them. "Il Sottosopra per tutti" is dry and easy (about 2 h, €5). The wet routes, with waders and a helmet provided, finish by climbing out of a manhole in the Carmine (about 3 h, €20, ages 14–70). This is the most memorable thing you can do in Brescia that almost no visitor knows about.',
        caution: 'Booking only. Tours meet in the lower level of metro San Faustino. Book via bresciaunderground.com or info@bresciaunderground.com; dates vary.',
        confidence: 'confirmed',
        evidence: [
            { label: 'idealista (Oct 2026)', url: 'https://www.idealista.it/news/vacanze/mete-turistiche/2026/10/23/477327-brescia-sotterranea-come-camminare-nei-fiumi-sotto-il-centro' },
            { label: 'Brescia Underground', url: 'https://www.bresciaunderground.com/' }
        ],
        find: { q: ['Metro San Faustino, Brescia'], name: 'San Faustino', near: [45.5450, 10.2202], radius: 600 }
    },
    {
        id: 'san-cristo',
        category: 'heritage',
        icon: '🎨',
        name: 'San Cristo — the "Sistine Chapel" of Brescia',
        address: 'Via Giovanni Piamarta 9, Brescia',
        why: 'At the top of the steps from Via dei Musei, on the way up to the castle, is a church whose walls and vaults are entirely covered in frescoes. Locals call it the Brescian Sistine Chapel. It belongs to the Saverian missionaries, whose monastery next door has three cloisters.',
        caution: 'One listing (2024) gives 8:30–18:30 daily, free. Confirm before going.',
        confidence: 'confirmed',
        evidence: [
            { label: 'museionline', url: 'https://www.museionline.info/lombardia-musei-monumenti/chiesa-di-san-cristo-brescia' },
            { label: 'Giornale di Brescia: 10 hidden corners', url: 'https://www.giornaledibrescia.it/storie/10-cose-fare-brescia-b8wynt0o' }
        ],
        find: { q: ['Chiesa del Santissimo Corpo di Cristo, Brescia'], name: 'Corpo di Cristo', near: [45.5407, 10.2279], radius: 500 }
    },
    {
        id: 'san-pietro-oliveto',
        category: 'heritage',
        icon: '🫒',
        name: 'San Pietro in Oliveto — cloister below the castle',
        address: 'Via del Castello 10, Brescia',
        why: 'An 11th-century church and Carmelite convent on the castle hill, with a Doric cloister. It\'s the natural pause halfway up to the castle, and far quieter than the walls above.',
        caution: 'One listing gives 7:00–11:30 and 16:00–19:30 daily, free.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/San_Pietro_in_Oliveto' },
            { label: 'museionline', url: 'https://www.museionline.info/lombardia-musei-monumenti/chiesa-di-san-pietro-in-oliveto' }
        ],
        find: { q: ['Chiesa di San Pietro in Oliveto, Brescia'], name: 'San Pietro in Oliveto', near: [45.5424, 10.2294], radius: 500 }
    },
    {
        id: 'san-faustino-riposo',
        category: 'heritage',
        icon: '🛖',
        name: 'San Faustino in Riposo — the "Trullo"',
        why: 'A tiny round church with a conical roof, tucked against the Porta Bruciata tower. Brescians call it the Trullo. Tradition says the patron saints\' relics "rested" here during a procession in the 9th century. It takes 30 seconds to see and is easy to walk past without noticing.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Comune di Brescia', url: 'https://www.comune.brescia.it/node/17213' },
            { label: 'Giornale di Brescia: 10 hidden corners', url: 'https://www.giornaledibrescia.it/storie/10-cose-fare-brescia-b8wynt0o' }
        ],
        find: { q: ['Chiesa di Santa Rita, Via dei Musei, Brescia'], name: 'Santa Rita|San Faustino in Riposo', near: [45.5402, 10.2208], radius: 400 }
    },
    {
        id: 'curt-dei-puli',
        category: 'heritage',
        icon: '⛲',
        name: 'Curt dei Pulì — a hidden courtyard',
        address: 'Corso Goffredo Mameli, Brescia',
        why: 'A courtyard off Corso Mameli with a five-arched portico, Ionic capitals and two fountains: one medieval, for animals, and one neoclassical set into the wall. It gave its name to a classic of Brescian dialect theatre. It\'s one of the few places in the centre that still feels like a neighbourhood yard.',
        caution: 'It\'s a residential courtyard, so keep your voice down. I found no information on access hours.',
        confidence: 'confirmed',
        evidence: [
            { label: 'in-lombardia', url: 'https://www.in-lombardia.it/en/piazzetta-curt-dei-pul%C3%AC' },
            { label: 'Civiltà Bresciana (PDF)', url: 'https://www.civiltabresciana.it/iniziative/2017/06-CurtDeiPuli.pdf' }
        ],
        // Not in OpenStreetMap: position from the in-lombardia page.
        find: { coords: [45.54065, 10.21821], name: 'Pulì', near: [45.5407, 10.2182], radius: 300 }
    },
    {
        id: 'san-clemente',
        category: 'heritage',
        icon: '🖌️',
        name: 'San Clemente — Moretto\'s own church',
        why: 'Moretto\'s parish church, where he is buried, still hung with his paintings, including the altarpiece of St Clement in its original place, plus a Romanino. It works as a small, free gallery of the painter who is everywhere in Brescia.',
        caution: 'Access is the problem: a 2023 source said it opened only one hour a week. Check before going.',
        confidence: 'check',
        evidence: [
            { label: 'Visit Brescia', url: 'https://visitbrescia.it/attivita/chiesa-san-clemente-brescia' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/San_Clemente,_Brescia' }
        ],
        find: { q: ['Chiesa di San Clemente, Brescia'], name: 'San Clemente', near: [45.5377, 10.2262], radius: 400 }
    },
    {
        id: 'martinengo-courtyard',
        category: 'heritage',
        icon: '🐙',
        name: 'Palazzo Martinengo — the octopus courtyard',
        address: 'Via dei Musei 30, Brescia',
        why: 'Walk in from Via dei Musei 30 and down the cobbled path: the courtyard has artworks including an octopus rising out of a pond. If an exhibition is on, there\'s a small window on the first floor at the Piazza del Foro corner that looks straight out at the Capitolium without anyone seeing you.',
        caution: 'The interior, including the window, is only open during exhibitions.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Giornale di Brescia: 10 hidden corners', url: 'https://www.giornaledibrescia.it/storie/10-cose-fare-brescia-b8wynt0o' }
        ],
        find: { q: ['Via dei Musei 30, Brescia'], name: 'Martinengo', near: [45.5395, 10.2248], radius: 300 }
    },

    // ---------- Outdoors ----------
    {
        id: 'maddalena',
        category: 'nature',
        icon: '⛰️',
        name: 'Monte Maddalena from the city',
        why: 'Brescia\'s own mountain, and you can climb it straight from town. Take CAI trail 901 from Sant\'Eufemia (Via Cesare Noventa) to the former Rifugio Maddalena: 4.5 km and 775 m of climbing, about 2 h 40 up and 1 h 50 down, grade E (a real mountain path, so wear proper shoes). For a shorter outing, trail 915 is a 5.1 km loop from Doss del Brüch with 235 m of climb, about 1 h 30, also grade E. It\'s known as the Path of the Brescian Resistance.',
        tip: 'Tap "Show trail 901" below for the exact path and a GPX. If you come up by the road instead, look near the ninth hairpin for a giant yew woven from branches, part of the Bosco dell\'Arte land-art project.',
        trail: 'relation/1963369',
        confidence: 'confirmed',
        evidence: [
            { label: 'Trail 901 (CAI survey 2023, on Waymarked Trails)', url: 'https://hiking.waymarkedtrails.org/#route?id=1963369' },
            { label: 'Trail 915 (CAI survey 2025, on Waymarked Trails)', url: 'https://hiking.waymarkedtrails.org/#route?id=2396484' },
            { label: 'Giornale di Brescia: 10 hidden corners', url: 'https://www.giornaledibrescia.it/storie/10-cose-fare-brescia-b8wynt0o' }
        ],
        find: { q: ['Monte Maddalena, Brescia'], name: 'Maddalena', near: [45.5480, 10.2850], radius: 3500, filter: '["natural"="peak"]' }
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
        find: { q: ['Lago del Canneto, Brescia', 'Parco delle Cave, Brescia'], name: 'Parco delle Cave', near: [45.5150, 10.2600], radius: 4000 }
    },

    // ---------- Food (shops and markets, no restaurants) ----------
    {
        id: 'mercato-loggia',
        category: 'food',
        icon: '🧺',
        name: 'Saturday market — Piazza della Loggia',
        why: 'The city\'s big Saturday market fills the Loggia and the streets around it. It\'s the best place to put together a picnic: cheese, salumi and fruit from the food stalls, eaten an hour later on the castle walls.',
        caution: 'Saturday 7:00–14:00, per the city (page updated October 2026). Since January 2026 some stalls have moved between Piazza Vittoria and Piazza della Loggia.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Comune di Brescia', url: 'https://www.comune.brescia.it/it/vivere/mercato-piazza-loggia-emporium' },
            { label: 'Giornale di Brescia', url: 'https://www.giornaledibrescia.it/cronaca/mercato-sabato-piazza-vittoria-trasloco-bancarelle-qh6xq1be' }
        ],
        find: { q: ['Palazzo della Loggia, Brescia'], name: 'Loggia', near: [45.5398, 10.2201], radius: 300 }
    },
    {
        id: 'mercato-coperto',
        category: 'food',
        icon: '🥬',
        name: 'Campagna Amica covered farmers\' market',
        address: 'Piazzale Cremona 14, Brescia',
        why: 'An indoor market where local farmers sell their own produce, cheese and meat directly. It\'s the closest thing in the city to buying from the farm.',
        caution: 'Listed as Friday 9:00–18:00 and Saturday 8:00–14:00, but that page is undated. Confirm before going.',
        confidence: 'confirmed',
        evidence: [
            { label: 'Brescia a Tavola', url: 'https://www.bresciaatavola.it/it/il-mercato-di-campagna-amica-prodotti-stagionali-di-qualita-a-km0/' },
            { label: 'Coldiretti Brescia', url: 'https://brescia.coldiretti.it/news/le-attivita-di-campagna-amica/' }
        ],
        find: { q: ['Mercato Agricolo Coperto, Brescia'], name: 'Mercato Agricolo Coperto|Campagna Amica', near: [45.5320, 10.2234], radius: 400 }
    },
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
        find: { q: ['Pasticceria Veneto, Brescia'], name: 'Veneto|Massari', near: [45.5300, 10.2280], radius: 3000, filter: '["shop"]' }
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
        find: { q: ['Pastificio Boglioni, Brescia'], name: 'Boglioni', near: [45.5408, 10.2215], radius: 1000 }
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
        find: { q: ['Il Pane di Maurizio Sarioli, Brescia'], name: 'Sarioli', near: [45.5402, 10.2225], radius: 1000 }
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
        find: { q: ['Gastronomia Gigola, Brescia'], name: 'Gigola', near: [45.5440, 10.2080], radius: 3000 }
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
        find: { q: ['Lanzani Bottega, Via Albertano da Brescia, Brescia'], name: 'Lanzani', near: [45.5370, 10.1990], radius: 3000 }
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
        find: { q: ['Pan per Focaccia, Brescia'], name: 'Pan per Focaccia', near: [45.5470, 10.2150], radius: 3000 }
    },
    {
        id: 'bedont',
        category: 'food',
        icon: '🍨',
        name: 'Bedont — gelato',
        address: 'Via Trento 18/b, Brescia',
        why: 'An artisan gelateria in Borgo Trento with a 70s feel, which appeared in Dissapore\'s top-100 gelaterie list.',
        caution: 'The ranking dates from 2015. It is still listed in OpenStreetMap at Via Trento 18, but I found no recent review. Phone +39 030 338 5581.',
        confidence: 'check',
        evidence: [
            { label: 'Dissapore 2015', url: 'https://www.dissapore.com/grande-notizia/100-migliori-gelaterie-artigianali-2015/' },
            { label: 'Wanderlog', url: 'https://wanderlog.com/place/details/3269683/bedont-di-roberto-bedont' }
        ],
        find: { q: ['Bedont, Via Trento, Brescia'], name: 'Bedont', near: [45.5490, 10.2150], radius: 3000 }
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
        id: 'walk-castle',
        name: 'Up to the castle the quiet way',
        when: 'Any morning; Saturdays, shop at the market first',
        stops: ['mercato-loggia', 'san-faustino-riposo', 'sarioli', 'martinengo-courtyard', 'capitolium', 'san-cristo', 'san-pietro-oliveto', 'castello'],
        pitch: 'Fill a bag at the Loggia market (Saturday) or at Sarioli, then climb Colle Cidneo past the small things most people miss: the Trullo church, the octopus courtyard, the Roman temple, the frescoed San Cristo and the cloister of San Pietro in Oliveto. Eat on the castle walls.'
    },
    {
        id: 'walk-west',
        name: 'The quiet west: Carmine to the Vantiniano',
        when: 'Any day; the cemetery closes in the late afternoon',
        stops: ['curt-dei-puli', 'pallata', 'carmine', 'vantiniano'],
        pitch: 'From a hidden courtyard on Corso Mameli, past the tower, through the Carmine and out to the monumental cemetery, the least touristy great sight in Brescia.'
    },
    {
        id: 'walk-maddalena',
        name: 'The long one: castle to the Maddalena',
        when: 'A clear, dry day; start early and carry water and food',
        stops: ['castello', 'maddalena'],
        effort: 'About 700 m of climbing (city about 150 m, summit 870 m). Allow around 3 hours up.',
        pitch: 'A full day on foot. Leave the castle eastwards on the first stretch of the Sentiero 3V, the 120 km trail that starts here (white-and-blue marks), continue on "La Via delle Sorelle", and finish on CAI 906 to the summit. Most of it is on marked paths. Come back down by trail 901 to Sant\'Eufemia, where the Mille Miglia museum and the metro are, to make it a loop.'
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
