// Brescia Travel Guide - Main Application
// Author: Claude Code
// Mobile-first interactive travel guide

let map;
let markers = [];
let currentCategory = 'all';
let userMarker = null;
let userAccuracyCircle = null;
let userPosition = null;
let watchId = null;
let searchTerm = '';

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    initializeMap();
    initializeEventListeners();
    displayPlaces(placesData);
    hideLoading();
});

// ==================== MAP FUNCTIONS ====================

function initializeMap() {
    // Create map centered on Brescia
    map = L.map('map', {
        zoomControl: false, // We'll use custom controls
        attributionControl: true
    }).setView([BRESCIA_CENTER.lat, BRESCIA_CENTER.lng], BRESCIA_CENTER.zoom);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19
    }).addTo(map);

    // Add all place markers
    addMarkers(placesData);

    // Mobile: disable scroll zoom, enable on click
    if (window.innerWidth <= 768) {
        map.scrollWheelZoom.disable();
        map.on('click', () => {
            map.scrollWheelZoom.enable();
            setTimeout(() => map.scrollWheelZoom.disable(), 3000);
        });
    }
}

function addMarkers(places) {
    // Clear existing markers and routes
    markers.forEach(item => {
        if (item.marker) item.marker.remove();
        if (item.polyline) item.polyline.remove();
        if (item.startMarker) item.startMarker.remove();
        if (item.endMarker) item.endMarker.remove();
    });
    markers = [];

    places.forEach(place => {
        // Check if this is a walking route with a path
        if (place.route && place.route.length > 1) {
            // Draw the route as a polyline
            const polyline = L.polyline(place.route, {
                color: CATEGORIES[place.category].color,
                weight: 4,
                opacity: 0.8,
                smoothFactor: 1
            }).addTo(map);

            // Add popup to polyline
            polyline.bindPopup(createPopupContent(place));
            polyline.on('click', () => {
                openPlaceModal(place);
            });

            // Add start marker (green flag)
            const startIcon = L.divIcon({
                className: 'route-marker',
                html: `<div class="route-marker-pin start" style="background-color: ${CATEGORIES[place.category].color}">
                         <span class="route-marker-icon">🚩</span>
                       </div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 32],
                popupAnchor: [0, -32]
            });

            const startMarker = L.marker(place.route[0], { icon: startIcon })
                .addTo(map)
                .bindPopup(`<strong>START:</strong> ${place.name}`);

            startMarker.on('click', () => {
                openPlaceModal(place);
            });

            // Add end marker for one-way routes (checkered flag)
            let endMarker = null;
            const isLoop = place.route[0][0] === place.route[place.route.length - 1][0] &&
                          place.route[0][1] === place.route[place.route.length - 1][1];

            if (!isLoop) {
                const endIcon = L.divIcon({
                    className: 'route-marker',
                    html: `<div class="route-marker-pin end" style="background-color: ${CATEGORIES[place.category].color}">
                             <span class="route-marker-icon">🏁</span>
                           </div>`,
                    iconSize: [32, 32],
                    iconAnchor: [16, 32],
                    popupAnchor: [0, -32]
                });

                endMarker = L.marker(place.route[place.route.length - 1], { icon: endIcon })
                    .addTo(map)
                    .bindPopup(`<strong>END:</strong> ${place.name}`);

                endMarker.on('click', () => {
                    openPlaceModal(place);
                });
            }

            markers.push({
                polyline,
                startMarker,
                endMarker,
                place
            });

        } else {
            // Regular point marker (not a route)
            const icon = L.divIcon({
                className: 'custom-marker',
                html: `<div class="marker-pin" style="background-color: ${CATEGORIES[place.category].color}">
                         <span class="marker-icon">${place.icon}</span>
                       </div>`,
                iconSize: [40, 40],
                iconAnchor: [20, 40],
                popupAnchor: [0, -40]
            });

            const marker = L.marker([place.lat, place.lng], { icon })
                .addTo(map)
                .bindPopup(createPopupContent(place));

            marker.on('click', () => {
                openPlaceModal(place);
            });

            markers.push({ marker, place });
        }
    });
}

function createPopupContent(place) {
    return `
        <div class="popup-content">
            <h3>${place.icon} ${place.name}</h3>
            <p><strong>${place.type}</strong></p>
            <p>${place.description.substring(0, 100)}...</p>
            <button class="popup-btn" onclick="openPlaceModal(${place.id})">
                View Details →
            </button>
        </div>
    `;
}

// ==================== FILTER & SEARCH ====================

function filterPlaces(category) {
    currentCategory = category;

    // Update filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.category === category) {
            btn.classList.add('active');
        }
    });

    // Filter places
    applyFilters();
}

function searchPlaces(term) {
    searchTerm = term.toLowerCase();
    applyFilters();
}

function applyFilters() {
    let filtered = placesData;

    // Apply category filter
    if (currentCategory !== 'all') {
        filtered = filtered.filter(place => place.category === currentCategory);
    }

    // Apply search filter
    if (searchTerm) {
        filtered = filtered.filter(place =>
            place.name.toLowerCase().includes(searchTerm) ||
            place.description.toLowerCase().includes(searchTerm) ||
            place.type.toLowerCase().includes(searchTerm)
        );
    }

    // Update map markers
    updateMarkerVisibility(filtered);

    // Update places list
    displayPlaces(filtered);

    // Fit map to show filtered places
    if (filtered.length > 0 && filtered.length < placesData.length) {
        fitMapToPlaces(filtered);
    }
}

function updateMarkerVisibility(visiblePlaces) {
    const visibleIds = visiblePlaces.map(p => p.id);

    markers.forEach(item => {
        const isVisible = visibleIds.includes(item.place.id);

        // Handle regular markers
        if (item.marker) {
            if (isVisible) {
                item.marker.addTo(map);
            } else {
                item.marker.remove();
            }
        }

        // Handle route polylines and markers
        if (item.polyline) {
            if (isVisible) {
                item.polyline.addTo(map);
                if (item.startMarker) item.startMarker.addTo(map);
                if (item.endMarker) item.endMarker.addTo(map);
            } else {
                item.polyline.remove();
                if (item.startMarker) item.startMarker.remove();
                if (item.endMarker) item.endMarker.remove();
            }
        }
    });
}

function fitMapToPlaces(places) {
    if (places.length === 0) return;

    const bounds = L.latLngBounds();

    places.forEach(place => {
        if (place.route && place.route.length > 1) {
            // For routes, include all waypoints
            place.route.forEach(coord => bounds.extend(coord));
        } else {
            // For regular markers, include the point
            bounds.extend([place.lat, place.lng]);
        }
    });

    if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
}

// ==================== DISPLAY PLACES LIST ====================

function displayPlaces(places) {
    const container = document.getElementById('placesContainer');
    const countEl = document.getElementById('placesCount');

    countEl.textContent = `(${places.length})`;

    if (places.length === 0) {
        container.innerHTML = `
            <div style="padding: 2rem; text-align: center; color: var(--text-light);">
                <p>No places found 😔</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try a different filter or search term</p>
            </div>
        `;
        return;
    }

    container.innerHTML = places.map(place => `
        <div class="place-card" onclick="focusOnPlace(${place.id})">
            <div class="place-card-header">
                <div class="place-icon">${place.icon}</div>
                <div class="place-info">
                    <h4>${place.name}</h4>
                    <span class="place-type">${place.type}</span>
                </div>
            </div>
            <p class="place-description">${place.description.substring(0, 120)}${place.description.length > 120 ? '...' : ''}</p>
            ${place.details && place.details.length > 0 ? `
                <div class="place-meta">
                    <span>${place.details[0]}</span>
                </div>
            ` : ''}
        </div>
    `).join('');
}

// ==================== PLACE INTERACTIONS ====================

function focusOnPlace(placeId) {
    const place = placesData.find(p => p.id === placeId);
    if (!place) return;

    // Pan to place on map
    map.setView([place.lat, place.lng], 16, { animate: true });

    // Find and open marker popup
    const markerObj = markers.find(m => m.place.id === placeId);
    if (markerObj) {
        markerObj.marker.openPopup();
    }

    // Close sidebar on mobile
    if (window.innerWidth <= 768) {
        closeSidebar();
    }
}

function openPlaceModal(placeIdOrPlace) {
    const place = typeof placeIdOrPlace === 'number'
        ? placesData.find(p => p.id === placeIdOrPlace)
        : placeIdOrPlace;

    if (!place) return;

    const modal = document.getElementById('placeModal');
    const modalBody = document.getElementById('modalBody');

    modalBody.innerHTML = `
        <div class="modal-header">
            <div class="modal-icon">${place.icon}</div>
            <div class="modal-title">
                <h2>${place.name}</h2>
                <span class="modal-category">${place.type}</span>
            </div>
        </div>

        <p class="modal-description">${place.description}</p>

        ${place.details && place.details.length > 0 ? `
            <div class="modal-details">
                <h3>📋 Details</h3>
                ${place.details.map(detail => `
                    <div class="detail-item">
                        <div class="detail-text">${detail}</div>
                    </div>
                `).join('')}
            </div>
        ` : ''}

        ${place.tips ? `
            <div class="modal-details">
                <h3>💡 Local Tip</h3>
                <div class="detail-item">
                    <div class="detail-icon">💬</div>
                    <div class="detail-text">${place.tips}</div>
                </div>
            </div>
        ` : ''}

        <div class="modal-actions">
            <button class="modal-btn" onclick="showOnMap(${place.id})">
                <span>🗺️</span> Show on Map
            </button>
            <button class="modal-btn secondary" onclick="getDirections(${place.lat}, ${place.lng})">
                <span>🧭</span> Directions
            </button>
        </div>
    `;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('placeModal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function showOnMap(placeId) {
    closeModal();
    focusOnPlace(placeId);
}

function getDirections(lat, lng) {
    // Open Google Maps with directions
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, '_blank');
}

// ==================== USER LOCATION ====================

function locateUser() {
    const btn = document.getElementById('locateBtn');

    // If already tracking, stop tracking
    if (watchId !== null) {
        stopTracking();
        return;
    }

    btn.innerHTML = '<span>⏳</span> Finding location...';
    btn.disabled = true;

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        resetLocateButton();
        return;
    }

    // Get initial position
    navigator.geolocation.getCurrentPosition(
        (position) => {
            updateUserPosition(position);
            btn.innerHTML = '<span>🔴</span> Tracking On';
            btn.disabled = false;
            btn.classList.add('tracking');

            // Start continuous tracking
            watchId = navigator.geolocation.watchPosition(
                updateUserPosition,
                (error) => {
                    console.error('Error tracking location:', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                }
            );
        },
        (error) => {
            console.error('Error getting location:', error);
            let errorMsg = 'Could not get your location. ';
            if (error.code === 1) {
                errorMsg += 'Please enable location permissions.';
            } else if (error.code === 2) {
                errorMsg += 'Position unavailable.';
            } else if (error.code === 3) {
                errorMsg += 'Request timeout.';
            }
            alert(errorMsg);
            resetLocateButton();
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function updateUserPosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const accuracy = position.coords.accuracy;

    // Store user position
    userPosition = { lat, lng };

    // Remove old markers/circles
    if (userMarker) userMarker.remove();
    if (userAccuracyCircle) userAccuracyCircle.remove();

    // Add accuracy circle
    userAccuracyCircle = L.circle([lat, lng], {
        radius: accuracy,
        color: '#27ae60',
        fillColor: '#27ae60',
        fillOpacity: 0.1,
        weight: 2
    }).addTo(map);

    // Add user location marker
    const icon = L.divIcon({
        className: 'user-marker',
        html: '<div class="user-marker-dot">📍</div>',
        iconSize: [30, 30],
        iconAnchor: [15, 15]
    });

    // Find nearest place
    const nearestPlace = findNearestPlace(lat, lng);
    const nearestDistance = nearestPlace ? calculateDistance(lat, lng, nearestPlace.lat, nearestPlace.lng) : null;

    let popupContent = `
        <div style="text-align: center;">
            <strong>You are here! 📍</strong><br>
            <small>Accuracy: ±${Math.round(accuracy)}m</small>
    `;

    if (nearestPlace && nearestDistance) {
        popupContent += `
            <br><br>
            <strong>Nearest:</strong><br>
            ${nearestPlace.icon} ${nearestPlace.name}<br>
            <span style="color: var(--primary-color); font-weight: bold;">
                ${formatDistance(nearestDistance)} away
            </span><br>
            <button onclick="showOnMap(${nearestPlace.id})" class="popup-btn" style="margin-top: 0.5rem;">
                Show →
            </button>
        `;
    }

    popupContent += '</div>';

    userMarker = L.marker([lat, lng], { icon })
        .addTo(map)
        .bindPopup(popupContent)
        .openPopup();

    // Pan to user location (only first time or if far away)
    if (!map.getBounds().contains([lat, lng]) || !userPosition) {
        map.setView([lat, lng], 15, { animate: true });
    }

    // Update distances in place cards
    updatePlaceDistances(lat, lng);
}

function stopTracking() {
    if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        watchId = null;
    }
    resetLocateButton();
}

function resetLocateButton() {
    const btn = document.getElementById('locateBtn');
    btn.innerHTML = '<span>📍</span> Find My Location';
    btn.disabled = false;
    btn.classList.remove('tracking');
}

function findNearestPlace(lat, lng) {
    let nearest = null;
    let minDistance = Infinity;

    placesData.forEach(place => {
        const distance = calculateDistance(lat, lng, place.lat, place.lng);
        if (distance < minDistance) {
            minDistance = distance;
            nearest = place;
        }
    });

    return nearest;
}

function calculateDistance(lat1, lng1, lat2, lng2) {
    // Haversine formula for distance calculation
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

function formatDistance(km) {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
}

function updatePlaceDistances(userLat, userLng) {
    if (!userLat || !userLng) return;

    const placeCards = document.querySelectorAll('.place-card');
    placeCards.forEach((card, index) => {
        const place = placesData.find(p => p.name === card.querySelector('h4')?.textContent);
        if (place) {
            const distance = calculateDistance(userLat, userLng, place.lat, place.lng);

            // Add or update distance badge
            let distanceBadge = card.querySelector('.distance-badge');
            if (!distanceBadge) {
                distanceBadge = document.createElement('div');
                distanceBadge.className = 'distance-badge';
                card.querySelector('.place-card-header').appendChild(distanceBadge);
            }
            distanceBadge.textContent = formatDistance(distance);
        }
    });
}

// ==================== MAP CONTROLS ====================

function zoomIn() {
    map.zoomIn();
}

function zoomOut() {
    map.zoomOut();
}

function centerMap() {
    map.setView([BRESCIA_CENTER.lat, BRESCIA_CENTER.lng], BRESCIA_CENTER.zoom, { animate: true });
}

// ==================== MOBILE MENU ====================

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');

    sidebar.classList.toggle('active');
    menuToggle.classList.toggle('active');
}

function closeSidebar() {
    const sidebar = document.getElementById('sidebar');
    const menuToggle = document.getElementById('menuToggle');

    sidebar.classList.remove('active');
    menuToggle.classList.remove('active');
}

// ==================== EVENT LISTENERS ====================

function initializeEventListeners() {
    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            filterPlaces(btn.dataset.category);
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    searchInput.addEventListener('input', (e) => {
        searchPlaces(e.target.value);
    });

    searchBtn.addEventListener('click', () => {
        searchPlaces(searchInput.value);
    });

    // Enter key for search
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            searchPlaces(searchInput.value);
        }
    });

    // Location button
    document.getElementById('locateBtn').addEventListener('click', locateUser);

    // Map controls
    document.getElementById('zoomIn').addEventListener('click', zoomIn);
    document.getElementById('zoomOut').addEventListener('click', zoomOut);
    document.getElementById('centerMap').addEventListener('click', centerMap);

    // Mobile menu
    document.getElementById('menuToggle').addEventListener('click', toggleSidebar);

    // Modal close
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('placeModal').addEventListener('click', (e) => {
        if (e.target.id === 'placeModal') {
            closeModal();
        }
    });

    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    });

    // Close sidebar when clicking on map (mobile)
    if (window.innerWidth <= 768) {
        map.on('click', closeSidebar);
    }
}

// ==================== UTILITY FUNCTIONS ====================

function hideLoading() {
    const loading = document.getElementById('loading');
    setTimeout(() => {
        loading.classList.add('hidden');
    }, 500);
}

// Add custom marker styles
const style = document.createElement('style');
style.textContent = `
    .custom-marker {
        background: none;
        border: none;
    }

    .marker-pin {
        width: 35px;
        height: 35px;
        border-radius: 50% 50% 50% 0;
        background: #2c5f8d;
        position: absolute;
        transform: rotate(-45deg);
        left: 50%;
        top: 50%;
        margin: -20px 0 0 -20px;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
    }

    .marker-pin:hover {
        transform: rotate(-45deg) scale(1.1);
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
    }

    .marker-icon {
        position: absolute;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        transform: rotate(45deg);
        font-size: 1.2rem;
    }

    /* Route markers */
    .route-marker {
        background: none;
        border: none;
    }

    .route-marker-pin {
        width: 28px;
        height: 28px;
        border-radius: 50%;
        position: absolute;
        left: 50%;
        top: 50%;
        margin: -14px 0 0 -14px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
    }

    .route-marker-pin:hover {
        transform: scale(1.15);
        box-shadow: 0 3px 10px rgba(0,0,0,0.4);
    }

    .route-marker-icon {
        font-size: 1rem;
    }

    /* Polyline styling */
    .leaflet-interactive {
        cursor: pointer;
    }

    .leaflet-interactive:hover {
        stroke-width: 6;
    }

    .user-marker {
        background: none;
        border: none;
    }

    .user-marker-dot {
        width: 30px;
        height: 30px;
        background: white;
        border: 3px solid #27ae60;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1rem;
        box-shadow: 0 3px 10px rgba(0,0,0,0.3);
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0% {
            box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7);
        }
        70% {
            box-shadow: 0 0 0 15px rgba(39, 174, 96, 0);
        }
        100% {
            box-shadow: 0 0 0 0 rgba(39, 174, 96, 0);
        }
    }

    /* Mobile menu toggle animation */
    .menu-toggle.active span:nth-child(1) {
        transform: rotate(45deg) translate(5px, 5px);
    }

    .menu-toggle.active span:nth-child(2) {
        opacity: 0;
    }

    .menu-toggle.active span:nth-child(3) {
        transform: rotate(-45deg) translate(5px, -5px);
    }
`;
document.head.appendChild(style);

// ==================== MAKE FUNCTIONS GLOBAL ====================
// (Needed for onclick handlers in HTML strings)
window.openPlaceModal = openPlaceModal;
window.closeModal = closeModal;
window.showOnMap = showOnMap;
window.getDirections = getDirections;
window.focusOnPlace = focusOnPlace;
window.zoomIn = zoomIn;
window.zoomOut = zoomOut;
window.centerMap = centerMap;

console.log('🏔️ Brescia Travel Guide loaded successfully!');
console.log(`📍 Showing ${placesData.length} amazing places to explore`);
