# 🚀 Quick Start Guide

## Immediate Testing (Local)

### Option 1: Python (Easiest)
```bash
cd Brescia-travel-guide
python -m http.server 8000
```
Open: http://localhost:8000

### Option 2: Node.js
```bash
npx serve
```
Open the URL shown

### Option 3: PHP
```bash
php -S localhost:8000
```
Open: http://localhost:8000

### Option 4: Just Double-Click
Open `index.html` directly in your browser (some features like geolocation may not work without a server)

## Deploy to GitHub Pages (5 minutes)

### Step 1: Push to Main Branch
```bash
# If you want to use main branch for GitHub Pages
git checkout -b main
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to: `https://github.com/[username]/Brescia-travel-guide/settings/pages`
2. Under "Source":
   - Branch: `main` (or your current branch)
   - Folder: `/ (root)`
3. Click **Save**

### Step 3: Wait 1-2 Minutes
GitHub will deploy automatically. Check:
```
https://[username].github.io/Brescia-travel-guide/
```

## What You'll See

### Desktop View
- **Left sidebar** with filters, search, and place list
- **Right side** with interactive map
- Click markers or cards to see details

### Mobile View
- **Hamburger menu** (☰) to open sidebar
- **Full-screen map** for easy navigation
- Touch-friendly controls

## Test Checklist

- [ ] Map loads with Brescia centered
- [ ] 25 markers appear on map
- [ ] Click a marker → popup appears
- [ ] Click "View Details" → modal opens
- [ ] Search for "bakery" → results filter
- [ ] Click filter buttons → map updates
- [ ] Click "Find My Location" → asks permission
- [ ] Mobile: Menu toggle works
- [ ] Mobile: Sidebar slides in/out
- [ ] All place cards are clickable

## Features to Try

### 🗺️ Explore the Map
1. Zoom in/out with controls or mouse wheel
2. Click markers to preview places
3. Click "View Details" for full information

### 🔍 Search & Filter
1. Try searching: "market", "view", "walk"
2. Click category filters to narrow down
3. Clear search to see all places again

### 📍 Find Yourself
1. Click "Find My Location"
2. Allow browser location access
3. See your position on the map

### 🚶 Plan a Walk
1. Filter by "Walking Routes"
2. Choose a route (view details)
3. Click "Directions" for Google Maps navigation

### 🥖 Find Food Spots
1. Filter by "Local Food"
2. Browse markets and bakeries
3. Plan your picnic shopping route

## Customization Ideas

### Add Your Own Places
Edit `data.js` and add entries like:
```javascript
{
    id: 26,
    name: "My Favorite Spot",
    category: "attractions",
    type: "Secret Place",
    icon: "✨",
    lat: 45.5416,
    lng: 10.2118,
    description: "A hidden gem...",
    details: [
        "🕐 Best time: Morning",
        "💰 Free"
    ],
    tips: "Bring a camera!"
}
```

### Change Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --primary-color: #2c5f8d;  /* Change to your color */
    --secondary-color: #e67e22;
}
```

### Add Your City
1. Copy all files to new folder
2. Update `data.js` with your city's data
3. Change `BRESCIA_CENTER` coordinates
4. Update text in `index.html`

## Mobile Installation

### iOS
1. Open in Safari
2. Tap Share button
3. "Add to Home Screen"
4. Launch like an app!

### Android
1. Open in Chrome
2. Tap menu (⋮)
3. "Add to Home screen"
4. Icon appears on home screen

## Troubleshooting

### Map is blank
- Check internet connection (needs to load Leaflet.js)
- Open browser console (F12) for errors
- Try refreshing page

### No markers showing
- Verify `data.js` is loaded
- Check browser console for errors
- Clear cache and reload

### Location not working
- HTTPS is required for geolocation
- Check browser permissions
- Must allow location access

### GitHub Pages shows 404
- Wait 2 minutes after first deploy
- Check Settings → Pages is configured
- Verify branch name is correct

## Need Help?

- Check `README.md` for full documentation
- See `DEPLOYMENT.md` for hosting options
- Open an issue on GitHub

## Share Your Guide

Once deployed, share your link:
```
https://[username].github.io/Brescia-travel-guide/
```

Perfect for:
- Sending to friends visiting Brescia
- Booking.com/Airbnb descriptions
- Social media
- Travel blogs
- Mobile bookmarks

---

**Enjoy exploring Brescia! 🏔️**
