// Brescia Travel Guide - Places Data
// All coordinates are for Brescia, Italy and surrounding areas

const placesData = [
    // ========== HIDDEN GEMS & ATTRACTIONS ==========
    {
        id: 1,
        name: "Vicolo delle Stelle",
        category: "attractions",
        type: "Hidden Alley",
        icon: "✨",
        lat: 45.5396,
        lng: 10.2192,
        description: "A charming medieval alley in the historic center with ancient stone arches. Local legend says wishes made here under the stars come true. Best visited at dawn or dusk.",
        details: [
            "📍 In the heart of old town",
            "🕐 Best time: Early morning or sunset",
            "💡 Look up to see the star-shaped skylight",
            "🚶 Part of the medieval walking route"
        ],
        tips: "Brings you to hidden courtyards rarely seen by tourists"
    },
    {
        id: 2,
        name: "Monastero di San Cristo",
        category: "attractions",
        type: "Quiet Monastery",
        icon: "⛪",
        lat: 45.5381,
        lng: 10.2145,
        description: "A peaceful 15th-century monastery with stunning cloisters and gardens. Often empty, offering a tranquil escape from the city buzz.",
        details: [
            "🕐 Open: 9:00-12:00, 15:00-18:00",
            "💰 Free entry",
            "🤫 Very quiet, perfect for contemplation",
            "📸 Beautiful Renaissance courtyard"
        ],
        tips: "The gardens are maintained by local volunteers - absolutely serene"
    },
    {
        id: 3,
        name: "Contrada delle Grazie",
        category: "attractions",
        type: "Historic Quarter",
        icon: "🏘️",
        lat: 45.5365,
        lng: 10.2201,
        description: "An authentic residential neighborhood with colorful facades, artisan workshops, and locals chatting on doorsteps. Real Brescia life.",
        details: [
            "🎨 Several artisan workshops",
            "🏠 Traditional Brescian architecture",
            "☕ Small local cafés frequented by residents",
            "📷 Photogenic colorful buildings"
        ],
        tips: "Visit on weekday mornings to see the neighborhood come alive"
    },
    {
        id: 4,
        name: "Torre della Pallata",
        category: "attractions",
        type: "Medieval Tower",
        icon: "🗼",
        lat: 45.5415,
        lng: 10.2175,
        description: "A lesser-known medieval tower with clock mechanism dating to 1546. Climb it for panoramic views without the crowds.",
        details: [
            "🕐 Open: Weekends 10:00-17:00",
            "💰 €2 entry",
            "📏 93 steps to the top",
            "🌄 360° city views"
        ],
        tips: "Much quieter than Castello viewpoint, locals' favorite spot"
    },
    {
        id: 5,
        name: "Piazzetta Bruno Boni",
        category: "attractions",
        type: "Secret Square",
        icon: "🌳",
        lat: 45.5388,
        lng: 10.2167,
        description: "A tiny hidden square with a ancient fountain, surrounded by ivy-covered walls. Popular with local students and artists.",
        details: [
            "🪑 Quiet benches for resting",
            "🎨 Occasional street art",
            "📚 Near the university area",
            "☀️ Sunny spot most of the day"
        ],
        tips: "Bring a book and enjoy the peaceful atmosphere"
    },

    // ========== VIEWPOINTS ==========
    {
        id: 6,
        name: "Castello di Brescia - Eastern Wall",
        category: "viewpoints",
        type: "Panoramic View",
        icon: "🌄",
        lat: 45.5443,
        lng: 10.2198,
        description: "The less-visited eastern side of the castle offers breathtaking views over the city and Alps. Especially magical at sunrise.",
        details: [
            "🌅 Best at: Sunrise (6:30-7:30)",
            "🥾 15-min uphill walk",
            "📸 Incredible photo opportunities",
            "🏔️ Clear days: See Monte Rosa"
        ],
        tips: "Pack breakfast and watch the city wake up - unforgettable!"
    },
    {
        id: 7,
        name: "Parco delle Cave - Belvedere",
        category: "viewpoints",
        type: "Natural Viewpoint",
        icon: "🌲",
        lat: 45.5289,
        lng: 10.2087,
        description: "A hidden viewpoint in the quarry park with views over green valleys. Peaceful and rarely crowded.",
        details: [
            "🚶 20-min walk from center",
            "🌳 Surrounded by nature",
            "🦋 Butterflies in spring/summer",
            "🎒 Bring water"
        ],
        tips: "Combine with the valley walking route for a half-day adventure"
    },
    {
        id: 8,
        name: "San Pietro in Oliveto - Terrace",
        category: "viewpoints",
        type: "Church Terrace",
        icon: "⛪",
        lat: 45.5428,
        lng: 10.2156,
        description: "Small church with an accessible terrace offering lovely views. Usually deserted, perfect for quiet reflection.",
        details: [
            "🕐 Open: Daily 8:00-18:00",
            "💰 Free",
            "🤫 Almost always empty",
            "🌆 Beautiful at golden hour"
        ],
        tips: "Ring the bell if the door is closed - caretaker is very friendly"
    },

    // ========== LOCAL FOOD SPOTS ==========
    {
        id: 9,
        name: "Mercato Piazza della Loggia",
        category: "food",
        type: "Local Market",
        icon: "🧺",
        lat: 45.5402,
        lng: 10.2183,
        description: "Wednesday and Saturday market with fresh produce, cheeses, and local specialties. Buy ingredients for a perfect picnic.",
        details: [
            "📅 Wednesday & Saturday",
            "🕐 7:00-13:00",
            "🧀 Excellent local cheese vendors",
            "🥖 Fresh bread and focaccia"
        ],
        tips: "Try the Bagoss cheese from Val Camonica and fresh porchetta"
    },
    {
        id: 10,
        name: "Forno Bresciano Pasticceria",
        category: "food",
        type: "Historic Bakery",
        icon: "🥖",
        lat: 45.5391,
        lng: 10.2178,
        description: "Family bakery since 1923. Famous for 'Bossolà' (traditional Brescian sweet bread) and fresh focaccia. Morning queues of locals tell the story.",
        details: [
            "🕐 Open: 6:30-13:00, 16:00-19:30",
            "🥐 Must-try: Bossolà bread",
            "💰 Very affordable",
            "👨‍🍳 Third generation bakers"
        ],
        tips: "Go early for warm focaccia - it sells out by 10am!"
    },
    {
        id: 11,
        name: "Salumeria Gussago",
        category: "food",
        type: "Deli & Cheese Shop",
        icon: "🧀",
        lat: 45.5375,
        lng: 10.2195,
        description: "Historic delicatessen with incredible local salumi, cheeses, and prepared foods. Perfect for picnic supplies.",
        details: [
            "🕐 Mon-Sat: 8:00-13:00, 16:00-19:30",
            "🥓 Amazing local salami",
            "🧀 Over 50 regional cheeses",
            "🥪 Fresh-made sandwiches"
        ],
        tips: "Ask for 'spiedo' samples and recommendations from Maria"
    },
    {
        id: 12,
        name: "Bottega del Vino Bresciano",
        category: "food",
        type: "Wine Shop",
        icon: "🍷",
        lat: 45.5409,
        lng: 10.2171,
        description: "Small wine shop specializing in local Franciacorta and Garda wines. Owner provides tastings and stories.",
        details: [
            "🕐 Tue-Sat: 10:00-13:00, 16:30-20:00",
            "🍾 Franciacorta specialists",
            "👴 Owner very knowledgeable",
            "🎁 Great for souvenirs"
        ],
        tips: "Mention you're a walker - he'll recommend wines perfect for picnics"
    },
    {
        id: 13,
        name: "Pasticceria Veneto",
        category: "food",
        type: "Pastry Shop",
        icon: "🍰",
        lat: 45.5384,
        lng: 10.2189,
        description: "Legendary pastry shop known for 'Spongada' (traditional almond cake) and fresh cream pastries.",
        details: [
            "🕐 Daily: 7:00-20:00",
            "🍰 Must-try: Spongada cake",
            "☕ Excellent espresso",
            "👵 Family recipes since 1950s"
        ],
        tips: "Perfect for morning sweet with coffee or afternoon pick-me-up"
    },
    {
        id: 14,
        name: "Ortofrutta da Michele",
        category: "food",
        type: "Fruit & Vegetable Stand",
        icon: "🍎",
        lat: 45.5397,
        lng: 10.2164,
        description: "Small fruit stand with seasonal produce from local farms. Michele knows all his farmers personally.",
        details: [
            "🕐 Mon-Sat: 7:30-13:30",
            "🌱 100% local & seasonal",
            "💰 Very fair prices",
            "🚜 Direct from nearby farms"
        ],
        tips: "Perfect fresh fruit for your walks - try the local apples!"
    },
    {
        id: 15,
        name: "Pane e Olio - Focacceria",
        category: "food",
        type: "Focaccia Shop",
        icon: "🫓",
        lat: 45.5368,
        lng: 10.2182,
        description: "Tiny shop making fresh focaccia all day. Choose your toppings - the rosemary and olive oil version is divine.",
        details: [
            "🕐 Tue-Sun: 10:00-14:00, 17:00-21:00",
            "🫒 Made-to-order focaccia",
            "🌿 Fresh herbs daily",
            "💚 Also sells quality olive oil"
        ],
        tips: "Order the 'focaccia ripiena' (stuffed) for a complete meal on-the-go"
    },
    {
        id: 16,
        name: "Latteria Sociale Brescia",
        category: "food",
        type: "Dairy Cooperative",
        icon: "🥛",
        lat: 45.5342,
        lng: 10.2201,
        description: "Local dairy cooperative selling fresh milk, yogurt, and cheese from nearby Alpine farms.",
        details: [
            "🕐 Mon-Sat: 8:00-12:30, 16:00-19:00",
            "🐄 Direct from mountain farms",
            "🧈 Fresh butter & ricotta",
            "📦 Bring your own containers"
        ],
        tips: "The fresh ricotta is incredible - perfect with honey for breakfast"
    },

    // ========== WALKING ROUTES ==========
    {
        id: 17,
        name: "Medieval Heart Circuit",
        category: "walks",
        type: "Urban Walk",
        icon: "🥾",
        lat: 45.5390,
        lng: 10.2180,
        description: "A 3km loop through Brescia's medieval center, including hidden alleys, ancient courtyards, and quiet piazzas. Mostly flat, easy walking.",
        details: [
            "📏 Distance: 3 km",
            "⏱️ Duration: 1.5-2 hours",
            "🎯 Difficulty: Easy",
            "🗺️ Mostly pedestrian zones",
            "🏛️ Passes 8 historical sites",
            "☕ Café stops available"
        ],
        tips: "Start at Piazza della Loggia, wind through Vicolo delle Stelle, end at Piazza Vittoria. Perfect morning or evening walk.",
        route: [
            [45.5402, 10.2183], // Start: Piazza della Loggia
            [45.5396, 10.2192], // Vicolo delle Stelle
            [45.5388, 10.2167], // Piazzetta Bruno Boni
            [45.5382, 10.2187], // Vicolo del Forno
            [45.5375, 10.2195], // Historic quarter
            [45.5381, 10.2145], // San Cristo area
            [45.5390, 10.2155], // Residential streets
            [45.5405, 10.2170], // Via Musei
            [45.5410, 10.2190], // Piazza Vittoria
            [45.5402, 10.2183]  // Back to start
        ]
    },
    {
        id: 18,
        name: "Castle Hill Ascent",
        category: "walks",
        type: "Hill Climb",
        icon: "⛰️",
        lat: 45.5420,
        lng: 10.2170,
        description: "Scenic climb from city center to Castello di Brescia via ancient paths. Steep but rewarding views. About 150m elevation gain.",
        details: [
            "📏 Distance: 2 km one-way",
            "⏱️ Duration: 30-40 min up",
            "🎯 Difficulty: Moderate",
            "⛰️ Elevation: +150m",
            "🌳 Shaded most of the way",
            "💦 Bring water"
        ],
        tips: "Take Via Piamarta for the prettiest route. Multiple benches for breaks. Return via different path for variety.",
        route: [
            [45.5405, 10.2188], // Start: Via Musei
            [45.5410, 10.2185], // Start of climb
            [45.5415, 10.2180], // Via Piamarta
            [45.5422, 10.2175], // Midway climb
            [45.5428, 10.2170], // Upper path
            [45.5435, 10.2180], // Approach castle
            [45.5443, 10.2198]  // Castle entrance
        ]
    },
    {
        id: 19,
        name: "Mella River Trail",
        category: "walks",
        type: "Riverside Path",
        icon: "🌊",
        lat: 45.5310,
        lng: 10.2089,
        description: "Peaceful 5km path along the Mella river, south from city center. Flat, green, great for bird watching. Connects to cycle paths.",
        details: [
            "📏 Distance: 5 km one-way",
            "⏱️ Duration: 1-1.5 hours",
            "🎯 Difficulty: Easy",
            "🌳 Shaded riverside path",
            "🦆 Wildlife spotting",
            "🚲 Bike-friendly too"
        ],
        tips: "Access from Viale Bornata. Perfect for longer walks. Bring binoculars for bird watching!",
        route: [
            [45.5350, 10.2095], // Start: Viale Bornata
            [45.5330, 10.2090], // Along river
            [45.5310, 10.2089], // Mid-trail
            [45.5290, 10.2087], // Continue south
            [45.5270, 10.2085], // Natural area
            [45.5250, 10.2080], // End point
        ]
    },
    {
        id: 20,
        name: "Ronchi to Castello Loop",
        category: "walks",
        type: "Urban-Nature Mix",
        icon: "🏞️",
        lat: 45.5450,
        lng: 10.2250,
        description: "4.5km loop combining residential neighborhoods, vineyards, and castle grounds. Local favorite. Some hills.",
        details: [
            "📏 Distance: 4.5 km",
            "⏱️ Duration: 1.5-2 hours",
            "🎯 Difficulty: Moderate",
            "🍇 Passes old vineyards",
            "🏘️ Authentic neighborhoods",
            "📸 Multiple viewpoints"
        ],
        tips: "Start from Via Panoramica. Morning light is beautiful on the vineyards. Quiet on weekdays.",
        route: [
            [45.5450, 10.2250], // Start: Ronchi
            [45.5460, 10.2270], // Residential area
            [45.5470, 10.2240], // Vineyard path
            [45.5465, 10.2210], // Approach castle
            [45.5455, 10.2195], // Castle grounds
            [45.5443, 10.2198], // Castle viewpoint
            [45.5435, 10.2220], // Return path
            [45.5445, 10.2245], // Back through neighborhood
            [45.5450, 10.2250]  // Return to start
        ]
    },
    {
        id: 21,
        name: "Cidneo Hill Circle",
        category: "walks",
        type: "Nature Walk",
        icon: "🌲",
        lat: 45.5465,
        lng: 10.2205,
        description: "6km circular trail around Cidneo hill, through parks and woods. Excellent exercise with nature immersion.",
        details: [
            "📏 Distance: 6 km",
            "⏱️ Duration: 2-2.5 hours",
            "🎯 Difficulty: Moderate",
            "🌲 Forest paths",
            "⛰️ Rolling hills",
            "🦊 Occasional wildlife"
        ],
        tips: "Best in spring and autumn. Bring snacks and water. Some sections can be muddy after rain.",
        route: [
            [45.5465, 10.2205], // Start: Main park entrance
            [45.5475, 10.2215], // North through park
            [45.5485, 10.2218], // Forest section
            [45.5488, 10.2200], // East side woods
            [45.5480, 10.2185], // Southeast path
            [45.5468, 10.2180], // South through forest
            [45.5458, 10.2195], // Southwest woods
            [45.5460, 10.2210], // Return via west
            [45.5465, 10.2205]  // Back to start
        ]
    },
    {
        id: 22,
        name: "Via Musei to Castello Heritage Walk",
        category: "walks",
        type: "Cultural Walk",
        icon: "🏛️",
        lat: 45.5405,
        lng: 10.2188,
        description: "Short but culturally rich walk connecting Roman ruins, medieval buildings, and the castle. Great introduction to Brescia.",
        details: [
            "📏 Distance: 2.5 km",
            "⏱️ Duration: 1 hour",
            "🎯 Difficulty: Easy-Moderate",
            "🏛️ Roman & Medieval sites",
            "📚 Very educational",
            "🎟️ Some sites have entry fees"
        ],
        tips: "Get early to beat crowds at Capitolium. Free entry first Sunday of month. Good audio guides available.",
        route: [
            [45.5405, 10.2188], // Start: Via Musei area (Capitolium district)
            [45.5410, 10.2183], // Along Via Musei
            [45.5415, 10.2177], // Toward castle approach
            [45.5420, 10.2172], // Via Piamarta ascent
            [45.5428, 10.2168], // Medieval street level
            [45.5435, 10.2175], // Historic buildings
            [45.5441, 10.2188], // Castle grounds approach
            [45.5443, 10.2198]  // Castle viewpoint/entrance
        ]
    },
    {
        id: 23,
        name: "Sanpolino Park Ramble",
        category: "walks",
        type: "Park Walk",
        icon: "🌳",
        lat: 45.5520,
        lng: 10.2345,
        description: "Easy 3km loop in a large park on city's edge. Playgrounds, ponds, and meadows. Popular with locals on weekends.",
        details: [
            "📏 Distance: 3 km",
            "⏱️ Duration: 45-60 min",
            "🎯 Difficulty: Easy",
            "🦆 Duck ponds",
            "🏃‍♀️ Jogging paths",
            "🧺 Picnic areas with tables"
        ],
        tips: "Perfect for relaxed afternoon stroll. Ice cream vendor on weekends. Good for families.",
        route: [
            [45.5520, 10.2345], // Start: Main park entrance
            [45.5525, 10.2355], // Along east path
            [45.5530, 10.2352], // Duck ponds area
            [45.5528, 10.2335], // South through meadow
            [45.5520, 10.2328], // Playground area
            [45.5515, 10.2335], // West side path
            [45.5515, 10.2348], // Jogging path return
            [45.5520, 10.2345]  // Back to entrance
        ]
    },
    {
        id: 24,
        name: "Colli di Sant'Eufemia Trek",
        category: "walks",
        type: "Hill Trek",
        icon: "⛰️",
        lat: 45.5580,
        lng: 10.2420,
        description: "More challenging 8km route in hills northeast of city. Panoramic views, olive groves, and small chapels.",
        details: [
            "📏 Distance: 8 km",
            "⏱️ Duration: 2.5-3 hours",
            "🎯 Difficulty: Challenging",
            "⛰️ Elevation: +280m",
            "🫒 Olive groves",
            "⛪ Historic chapels"
        ],
        tips: "Bring good shoes and plenty of water. Incredible on clear days - Alps visible. Best spring/autumn.",
        route: [
            [45.5580, 10.2420], // Start: Trail head (northeastern hills)
            [45.5585, 10.2430], // Initial climb
            [45.5590, 10.2440], // Higher elevation through olive groves
            [45.5600, 10.2445], // Chapel area with views
            [45.5610, 10.2440], // Peak section
            [45.5608, 10.2420], // Alpine vista area
            [45.5600, 10.2410], // Descent path through groves
            [45.5590, 10.2405], // Mid-descent
            [45.5585, 10.2415], // Final return section
            [45.5580, 10.2420]  // Back to trail head
        ]
    },
    {
        id: 25,
        name: "Garden District Stroll",
        category: "walks",
        type: "Neighborhood Walk",
        icon: "🌺",
        lat: 45.5355,
        lng: 10.2230,
        description: "Gentle 2.5km walk through residential area with beautiful gardens and Art Nouveau villas. Very peaceful.",
        details: [
            "📏 Distance: 2.5 km",
            "⏱️ Duration: 45-60 min",
            "🎯 Difficulty: Easy",
            "🏡 Art Nouveau architecture",
            "🌸 Private gardens visible",
            "📷 Photogenic streets"
        ],
        tips: "Lovely in spring when gardens bloom. Very quiet area. Good for early morning walks.",
        route: [
            [45.5355, 10.2230], // Start: Garden district entrance
            [45.5358, 10.2240], // Along residential avenue
            [45.5365, 10.2245], // Art Nouveau villas
            [45.5370, 10.2235], // Garden section of street
            [45.5368, 10.2220], // Through quiet neighborhood
            [45.5360, 10.2218], // Among gardens
            [45.5355, 10.2225], // Return path
            [45.5355, 10.2230]  // Back to start
        ]
    },

    // ========== MORE HIDDEN GEMS & ATTRACTIONS ==========
    {
        id: 26,
        name: "Libreria Tarantola",
        category: "attractions",
        type: "Historic Bookshop",
        icon: "📚",
        lat: 45.5399,
        lng: 10.2176,
        description: "Enchanting 19th-century bookshop with floor-to-ceiling shelves, sliding ladders, and rare books. Cat included. A literary treasure.",
        details: [
            "🕐 Mon-Sat: 9:30-12:30, 15:30-19:30",
            "📖 New & antiquarian books",
            "🐱 Resident cat named Dante",
            "🪜 Original wooden ladders"
        ],
        tips: "The owner speaks English and loves recommending Italian literature"
    },
    {
        id: 27,
        name: "Fontana dei Delfini",
        category: "attractions",
        type: "Hidden Fountain",
        icon: "⛲",
        lat: 45.5378,
        lng: 10.2193,
        description: "16th-century fountain tucked in a quiet courtyard. Dolphins carved in marble, surrounded by jasmine in summer.",
        details: [
            "💰 Free access",
            "📸 Beautiful photo spot",
            "🌺 Jasmine blooms June-August",
            "🤫 Very few tourists"
        ],
        tips: "Access through Via delle Battaglie - look for the small archway"
    },
    {
        id: 28,
        name: "Bottega del Liutaio Bianchi",
        category: "attractions",
        type: "Violin Maker",
        icon: "🎻",
        lat: 45.5372,
        lng: 10.2169,
        description: "Traditional violin maker's workshop. Watch master craftsman shape instruments using 18th-century techniques. Sometimes you can listen to testing.",
        details: [
            "🕐 By appointment or lucky timing",
            "🎶 Active workshop since 1987",
            "👨‍🔧 Master craftsman trained in Cremona",
            "👀 Can watch through window"
        ],
        tips: "Mornings he often works with door open - respectfully peek in"
    },
    {
        id: 29,
        name: "Oratorio di San Giovanni",
        category: "attractions",
        type: "Frescoed Chapel",
        icon: "🎨",
        lat: 45.5394,
        lng: 10.2151,
        description: "Small 15th-century chapel with stunning Renaissance frescoes. Often overlooked, absolutely breathtaking inside.",
        details: [
            "🕐 Open: Tue-Sun 10:00-13:00",
            "💰 €1 donation suggested",
            "🎨 Frescoes by Ferramola",
            "⏱️ 15-20 min visit"
        ],
        tips: "Almost never crowded - you might have it all to yourself"
    },
    {
        id: 30,
        name: "Vicolo del Forno",
        category: "attractions",
        type: "Medieval Lane",
        icon: "🏛️",
        lat: 45.5382,
        lng: 10.2187,
        description: "Narrow medieval lane with original cobblestones and hanging flower boxes. Leads to unexpected courtyards.",
        details: [
            "📍 Off Via dei Musei",
            "🌸 Gorgeous in spring",
            "📷 Instagram-worthy",
            "🚶 Part of old bread-makers' quarter"
        ],
        tips: "Walk all the way through - three connected courtyards, each more beautiful"
    },
    {
        id: 31,
        name: "Botanical Corner - Villa Fenaroli",
        category: "attractions",
        type: "Garden Oasis",
        icon: "🌿",
        lat: 45.5358,
        lng: 10.2214,
        description: "Small botanical garden attached to historic villa. Medicinal herbs, rare plants, peaceful benches.",
        details: [
            "🕐 Open: Sat-Sun 14:00-18:00",
            "💰 Free entry",
            "🌱 Over 300 plant species",
            "🪑 Shaded benches"
        ],
        tips: "Volunteer guides on Sundays share fascinating plant stories"
    },
    {
        id: 32,
        name: "Chiesa di Sant'Agata",
        category: "attractions",
        type: "Baroque Church",
        icon: "⛪",
        lat: 45.5387,
        lng: 10.2202,
        description: "Intimate Baroque church with trompe-l'oeil ceiling that seems infinite. Hidden gem of architecture.",
        details: [
            "🕐 Open: Daily 8:00-11:00, 16:00-18:30",
            "💰 Free",
            "🎨 Stunning illusionistic ceiling",
            "🕯️ Still used for morning mass"
        ],
        tips: "Enter quietly if service ongoing. Sit and look up - the ceiling is magical"
    },

    // ========== MORE VIEWPOINTS ==========
    {
        id: 33,
        name: "Viale Venezia Overlook",
        category: "viewpoints",
        type: "Street Viewpoint",
        icon: "🌇",
        lat: 45.5435,
        lng: 10.2142,
        description: "Less-known viewpoint along the hillside road. Benches under trees, sunset views over the city.",
        details: [
            "🌅 Best at: Sunset",
            "🪑 Multiple benches",
            "🌳 Shaded in afternoon",
            "🚶 Easy access from Via Castello"
        ],
        tips: "Locals gather here for evening passeggiata (stroll)"
    },
    {
        id: 34,
        name: "Torre del Popolo - Ramparts",
        category: "viewpoints",
        type: "Historic Rampart",
        icon: "🗼",
        lat: 45.5447,
        lng: 10.2183,
        description: "Ancient defensive walls with walking path and views. Part of castle complex but quieter section.",
        details: [
            "🕐 Accessible dawn to dusk",
            "💰 Free",
            "📏 200m walkable rampart",
            "🏔️ North-facing Alpine views"
        ],
        tips: "Morning fog creates mystical atmosphere over the city below"
    },

    // ========== MORE LOCAL FOOD SPOTS ==========
    {
        id: 35,
        name: "Frantoio Bonamini",
        category: "food",
        type: "Olive Oil Mill",
        icon: "🫒",
        lat: 45.5363,
        lng: 10.2208,
        description: "Small olive oil producer with tasting room. Extra virgin oil from Lake Garda groves. Buy directly from producer.",
        details: [
            "🕐 Thu-Sat: 10:00-13:00, 16:00-19:00",
            "🫒 Cold-pressed extra virgin",
            "👅 Free tastings",
            "🎁 Beautiful gift bottles"
        ],
        tips: "Try the lemon-infused oil - perfect with fish or vegetables"
    },
    {
        id: 36,
        name: "Il Fornaio di Via Gramsci",
        category: "food",
        type: "Neighborhood Bakery",
        icon: "🥐",
        lat: 45.5348,
        lng: 10.2195,
        description: "No-frills bakery where locals buy daily bread. Incredible whole grain loaves and pizza by the slice at lunch.",
        details: [
            "🕐 Mon-Sat: 6:00-13:30, 17:00-20:00",
            "🍕 Hot pizza 12:00-13:30",
            "🌾 Stone-ground flour",
            "💰 Very cheap"
        ],
        tips: "The 'pane di segale' (rye bread) stays fresh for days - perfect for hiking"
    },
    {
        id: 37,
        name: "Torrefazione Duomo",
        category: "food",
        type: "Coffee Roaster",
        icon: "☕",
        lat: 45.5401,
        lng: 10.2191,
        description: "Historic coffee roaster since 1962. Beans roasted daily on-site. Intoxicating aroma fills the street.",
        details: [
            "🕐 Mon-Sat: 7:30-19:00",
            "☕ Fresh roasted daily",
            "🌍 Direct trade beans",
            "🎒 Vacuum-sealed for travel"
        ],
        tips: "Buy the 'Brescia blend' - perfect espresso. Owner gives brewing tips"
    },
    {
        id: 38,
        name: "Apicoltura Valcamonica",
        category: "food",
        type: "Honey Producer",
        icon: "🍯",
        lat: 45.5369,
        lng: 10.2176,
        description: "Small stand selling honey from mountain beekeepers. Acacia, chestnut, and rare alpine flower varieties.",
        details: [
            "📅 Tuesday & Friday mornings",
            "🕐 8:00-12:00",
            "🐝 Raw, unfiltered honey",
            "🏔️ From alpine meadows"
        ],
        tips: "The chestnut honey is dark and rich - locals love it with aged cheese"
    },
    {
        id: 39,
        name: "Macelleria Sociale",
        category: "food",
        type: "Butcher Co-op",
        icon: "🥩",
        lat: 45.5385,
        lng: 10.2158,
        description: "Butcher cooperative with local, pasture-raised meat. Perfect for buying supplies for 'spiedo' (local rotisserie).",
        details: [
            "🕐 Tue-Sat: 8:00-13:00, 16:30-19:30",
            "🐄 Local farms only",
            "🥩 Excellent quality",
            "💬 Helpful staff"
        ],
        tips: "Ask about 'spiedo' cuts - they'll explain the traditional preparation"
    },
    {
        id: 40,
        name: "Gelateria Artigiana Cioccolat",
        category: "food",
        type: "Artisan Gelato",
        icon: "🍨",
        lat: 45.5395,
        lng: 10.2185,
        description: "Tiny gelateria making small-batch gelato daily. Real ingredients, creative flavors. Often a queue of locals.",
        details: [
            "🕐 Daily: 12:00-23:00 (summer)",
            "🍨 Made fresh daily",
            "🌰 Try: Marrons glacés",
            "💰 €2.50 for cone"
        ],
        tips: "The pistachio is incredible, but the ricotta with fig is a hidden treasure"
    },
    {
        id: 41,
        name: "Pasta Fresca da Nonna Rosa",
        category: "food",
        type: "Fresh Pasta Shop",
        icon: "🍝",
        lat: 45.5376,
        lng: 10.2199,
        description: "Grandmother Rosa makes pasta by hand every morning. Casoncelli (local ravioli), tagliatelle, and filled pastas.",
        details: [
            "🕐 Mon-Sat: 8:30-12:30",
            "👵 Handmade daily",
            "🥟 Local specialties",
            "💰 Affordable portions"
        ],
        tips: "Buy casoncelli and cook at your accommodation - she includes butter & sage"
    },
    {
        id: 42,
        name: "Norcineria del Centro",
        category: "food",
        type: "Cured Meats Shop",
        icon: "🥓",
        lat: 45.5392,
        lng: 10.2172,
        description: "Specializes in cured meats and sausages. Vacuum-packing available. Perfect picnic supplies.",
        details: [
            "🕐 Mon-Sat: 9:00-13:00, 16:00-19:30",
            "🥓 House-cured meats",
            "📦 Vacuum packing",
            "🎁 Gift packages"
        ],
        tips: "The coppa and bresaola are exceptional - ask for thin slicing"
    },
    {
        id: 43,
        name: "Erbette e Spezie",
        category: "food",
        type: "Herb & Spice Shop",
        icon: "🌿",
        lat: 45.5383,
        lng: 10.2181,
        description: "Tiny shop selling local herbs, mountain teas, and spices. Everything from wild mint to rare medicinal plants.",
        details: [
            "🕐 Tue-Sat: 10:00-13:00, 16:00-19:00",
            "🌿 Wild-harvested herbs",
            "☕ Mountain herbal teas",
            "💊 Natural remedies"
        ],
        tips: "Buy the 'alpine tisane' blend - perfect for evening relaxation after walking"
    },
    {
        id: 44,
        name: "Cascina San Zeno - Farmstand",
        category: "food",
        type: "Farm Products",
        icon: "🥚",
        lat: 45.5412,
        lng: 10.2165,
        description: "Urban farm selling eggs, vegetables, and preserves. All from their small holding just outside the city.",
        details: [
            "📅 Wednesday & Saturday",
            "🕐 8:00-12:00",
            "🥚 Fresh eggs daily",
            "🥒 Seasonal vegetables & preserves"
        ],
        tips: "The fruit preserves are wonderful - try the plum jam"
    },

    // ========== MORE WALKING ROUTES ==========
    {
        id: 45,
        name: "Artisan Quarter Wander",
        category: "walks",
        type: "Craft District",
        icon: "🎨",
        lat: 45.5375,
        lng: 10.2180,
        description: "2.5km loop through the old artisan district. Pass workshops of furniture restorers, bookbinders, violin makers, and more.",
        details: [
            "📏 Distance: 2.5 km",
            "⏱️ Duration: 1.5-2 hours",
            "🎯 Difficulty: Easy",
            "🛠️ Active workshops",
            "📸 Photogenic streets",
            "☕ Artisan cafés"
        ],
        tips: "Weekday mornings workshops are active - you'll see craftspeople at work",
        route: [
            [45.5375, 10.2180], // Start: Artisan quarter entrance
            [45.5378, 10.2190], // Bookbinder's street
            [45.5385, 10.2195], // Through workshop district
            [45.5388, 10.2185], // Central artisan area
            [45.5383, 10.2175], // Craft maker lane
            [45.5378, 10.2172], // Furniture restoration
            [45.5370, 10.2180], // Violin maker area
            [45.5373, 10.2188], // Through center
            [45.5375, 10.2180]  // Back to start
        ]
    },
    {
        id: 46,
        name: "Dawn Market to Castle Walk",
        category: "walks",
        type: "Early Morning Route",
        icon: "🌅",
        lat: 45.5398,
        lng: 10.2179,
        description: "Early morning 4km route combining market visit, breakfast stops, and castle sunrise. Best on market days.",
        details: [
            "📏 Distance: 4 km",
            "⏱️ Duration: 2-3 hours (with stops)",
            "🎯 Difficulty: Easy-Moderate",
            "🌅 Start: 6:30am",
            "🥐 Multiple food stops",
            "🏰 Ends at castle for sunrise"
        ],
        tips: "Start at market, buy breakfast supplies, eat at castle viewpoint - magical!",
        route: [
            [45.5398, 10.2179], // Start: Market area
            [45.5402, 10.2183], // Piazza della Loggia market
            [45.5405, 10.2180], // First café stop area
            [45.5410, 10.2185], // Toward castle path
            [45.5418, 10.2175], // Climb begins
            [45.5425, 10.2170], // Mid-climb
            [45.5435, 10.2180], // Upper path
            [45.5440, 10.2195], // Approach castle grounds
            [45.5443, 10.2198]  // Castle viewpoint/sunrise spot
        ]
    },
    {
        id: 47,
        name: "Lake Garda Trail Connection",
        category: "walks",
        type: "Long Distance Path",
        icon: "🥾",
        lat: 45.5180,
        lng: 10.2045,
        description: "10km route connecting Brescia to the Lake Garda trail system. For serious walkers. Public transport return.",
        details: [
            "📏 Distance: 10 km one-way",
            "⏱️ Duration: 3-3.5 hours",
            "🎯 Difficulty: Moderate-Challenging",
            "🚌 Bus return available",
            "🏞️ Rural landscapes",
            "💦 Limited water sources"
        ],
        tips: "Take bus back from Lonato. Spring and autumn best. Bring packed lunch.",
        route: [
            [45.5180, 10.2045], // Start: South Brescia area
            [45.5170, 10.2050], // Heading south
            [45.5155, 10.2055], // Rural transition
            [45.5140, 10.2060], // Agricultural lands
            [45.5125, 10.2060], // Toward Lonato region
            [45.5110, 10.2065], // Approaching plains
            [45.5095, 10.2070], // Near Garda influence area
            [45.5080, 10.2070], // Trail junction area
            [45.5065, 10.2075], // Garda connection point
            [45.5050, 10.2080]  // Final trail system link
        ]
    },
    {
        id: 48,
        name: "Franciacorta Vineyard Approach",
        category: "walks",
        type: "Vineyard Trail",
        icon: "🍇",
        lat: 45.5590,
        lng: 10.1980,
        description: "7km walk toward famous Franciacorta wine region. Vineyards, small wineries, rolling hills.",
        details: [
            "📏 Distance: 7 km one-way",
            "⏱️ Duration: 2.5 hours",
            "🎯 Difficulty: Moderate",
            "🍷 Pass several wineries",
            "🚌 Bus return from Erbusco",
            "📸 Beautiful landscapes"
        ],
        tips: "Some wineries allow walk-in tastings - bring ID and cash. Best Sept-Oct harvest",
        route: [
            [45.5590, 10.1980], // Start: Brescia northeast area toward wine region
            [45.5585, 10.1970], // Initial descent
            [45.5575, 10.1955], // First vineyard area
            [45.5560, 10.1940], // Through vineyards (winery #1)
            [45.5545, 10.1930], // Rolling wine hills
            [45.5530, 10.1925], // Franciacorta region center
            [45.5515, 10.1920]  // Final winery area/Erbusco approach
        ]
    }
];

// Center of Brescia for map initialization
const BRESCIA_CENTER = {
    lat: 45.5416,
    lng: 10.2118,
    zoom: 14
};

// Category configurations
const CATEGORIES = {
    all: {
        name: "All Places",
        icon: "✨",
        color: "#2c5f8d"
    },
    attractions: {
        name: "Hidden Gems",
        icon: "🏛️",
        color: "#9b59b6"
    },
    food: {
        name: "Local Food",
        icon: "🥖",
        color: "#e67e22"
    },
    walks: {
        name: "Walking Routes",
        icon: "🥾",
        color: "#27ae60"
    },
    viewpoints: {
        name: "Viewpoints",
        icon: "🌄",
        color: "#3498db"
    }
};

// Export data
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { placesData, BRESCIA_CENTER, CATEGORIES };
}
