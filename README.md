# 🏔️ Brescia Walking Guide

A rich, mobile-friendly web application for exploring Brescia, Italy - designed for travelers who love hidden gems, local cuisine, and walking adventures.

## ✨ Features

### 🗺️ Interactive Map
- **OpenStreetMap** integration via Leaflet.js
- Custom markers for different place categories
- Smooth zoom and pan controls
- Mobile-optimized touch gestures

### 🚶 Walking Routes
- **9 curated walking routes** ranging from easy strolls to challenging treks
- Distance, duration, and difficulty ratings
- Scenic paths through medieval quarters, riverside trails, and hill climbs
- Perfect for exploring Brescia on foot

### 🏛️ Hidden Gems
- **Lesser-known attractions** away from tourist crowds
- Medieval alleys, quiet monasteries, and secret squares
- Local viewpoints with stunning panoramas
- Authentic neighborhoods and historic sites

### 🥖 Local Food (No Restaurants!)
- **Markets, bakeries, and delis** where locals shop
- Fresh produce stands and traditional pastry shops
- Cheese shops, wine stores, and focaccerias
- Perfect for picnic supplies and authentic experiences

### 📱 Mobile-First Design
- Fully responsive on all devices
- Touch-friendly interface
- PWA-ready for installation on mobile
- Geolocation support to find places near you

### 🔍 Search & Filter
- Filter by category (attractions, food, walks, viewpoints)
- Real-time search across all places
- Easy-to-use category buttons
- Dynamic place list with detailed cards

## 🚀 Live Demo

Visit the app: [Your GitHub Pages URL]

## 🛠️ Technology Stack

- **HTML5** - Semantic structure
- **CSS3** - Modern styling with CSS variables
- **Vanilla JavaScript** - No frameworks, pure performance
- **Leaflet.js** - Interactive maps
- **OpenStreetMap** - Map tiles
- **Progressive Web App** - Mobile installation support

## 📦 Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Brescia-travel-guide.git
   cd Brescia-travel-guide
   ```

2. Open in your browser:
   ```bash
   # Simple HTTP server with Python
   python -m http.server 8000
   # Or with Node.js
   npx serve
   ```

3. Visit `http://localhost:8000`

## 🌍 Deployment

### GitHub Pages

The app is deployed automatically via GitHub Pages:

1. Push to the main branch
2. GitHub Actions will deploy automatically
3. Access at `https://yourusername.github.io/Brescia-travel-guide/`

### Manual Deployment

Simply upload all files to any static hosting service:
- Netlify
- Vercel
- Cloudflare Pages
- Any web server

## 📂 File Structure

```
brescia-travel-guide/
├── index.html          # Main HTML structure
├── styles.css          # Responsive CSS styling
├── app.js             # Application logic
├── data.js            # Places data (routes, attractions, food)
├── manifest.json      # PWA manifest
└── README.md          # Documentation
```

## 🎯 Target Audience

This app is perfect for travelers who:
- ✅ Love exploring on foot
- ✅ Prefer local, authentic experiences
- ✅ Want to avoid tourist traps
- ✅ Enjoy discovering hidden gems
- ✅ Like buying food from markets/shops (not restaurants)
- ✅ Value detailed walking routes

## 🗺️ Places Included

- **Hidden Attractions**: 8 lesser-known sites
- **Viewpoints**: 3 panoramic spots
- **Food Locations**: 8 markets, bakeries, and shops
- **Walking Routes**: 9 routes (3-8km each)

## 🔄 Future Enhancements

- [ ] Offline map caching
- [ ] User reviews and ratings
- [ ] Photo galleries for each location
- [ ] Route tracking via GPS
- [ ] Multiple language support
- [ ] Weather integration
- [ ] Downloadable walking route GPX files

## 📱 Mobile Installation

On iOS or Android:
1. Open the app in your mobile browser
2. Tap "Add to Home Screen"
3. Launch like a native app

## 🤝 Contributing

Contributions are welcome! To add new places or routes:

1. Edit `data.js`
2. Follow the existing data structure
3. Submit a pull request

## 📄 License

MIT License - feel free to use and modify for your own city!

## 🙏 Acknowledgments

- OpenStreetMap contributors
- Leaflet.js developers
- Local Brescian guides who shared hidden gems

## 📧 Contact

Questions or suggestions? Open an issue on GitHub!

---

**Made with ❤️ for exploring Brescia on foot**
