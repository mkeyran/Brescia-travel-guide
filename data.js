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
        tips: "Start at Piazza della Loggia, wind through Vicolo delle Stelle, end at Piazza Vittoria. Perfect morning or evening walk."
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
        tips: "Take Via Piamarta for the prettiest route. Multiple benches for breaks. Return via different path for variety."
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
        tips: "Access from Viale Bornata. Perfect for longer walks. Bring binoculars for bird watching!"
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
        tips: "Start from Via Panoramica. Morning light is beautiful on the vineyards. Quiet on weekdays."
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
        tips: "Best in spring and autumn. Bring snacks and water. Some sections can be muddy after rain."
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
        tips: "Get early to beat crowds at Capitolium. Free entry first Sunday of month. Good audio guides available."
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
        tips: "Perfect for relaxed afternoon stroll. Ice cream vendor on weekends. Good for families."
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
        tips: "Bring good shoes and plenty of water. Incredible on clear days - Alps visible. Best spring/autumn."
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
        tips: "Lovely in spring when gardens bloom. Very quiet area. Good for early morning walks."
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
