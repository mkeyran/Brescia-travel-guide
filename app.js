// Brescia Travel Guide - Main Application
// Author: Claude Code
// Mobile-first interactive travel guide

let map;
let markers = [];
let currentCategory = 'all';
let userMarker = null;
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
    // Clear existing markers
    markers.forEach(marker => marker.remove());
    markers = [];

    places.forEach(place => {
        // Create custom icon based on category
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="marker-pin" style="background-color: ${CATEGORIES[place.category].color}">
                     <span class="marker-icon">${place.icon}</span>
                   </div>`,
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40]
        });

        // Create marker
        const marker = L.marker([place.lat, place.lng], { icon })
            .addTo(map)
            .bindPopup(createPopupContent(place));

        // Add click handler
        marker.on('click', () => {
            openPlaceModal(place);
        });

        markers.push({ marker, place });
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

    markers.forEach(({ marker, place }) => {
        if (visibleIds.includes(place.id)) {
            marker.addTo(map);
        } else {
            marker.remove();
        }
    });
}

function fitMapToPlaces(places) {
    if (places.length === 0) return;

    const bounds = L.latLngBounds(places.map(p => [p.lat, p.lng]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
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
    btn.innerHTML = '<span>⏳</span> Finding location...';
    btn.disabled = true;

    if (!navigator.geolocation) {
        alert('Geolocation is not supported by your browser');
        resetLocateButton();
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;

            // Remove old user marker if exists
            if (userMarker) {
                userMarker.remove();
            }

            // Add user location marker
            const icon = L.divIcon({
                className: 'user-marker',
                html: '<div class="user-marker-dot">📍</div>',
                iconSize: [30, 30],
                iconAnchor: [15, 15]
            });

            userMarker = L.marker([lat, lng], { icon })
                .addTo(map)
                .bindPopup('You are here! 📍');

            // Pan to user location
            map.setView([lat, lng], 15, { animate: true });

            btn.innerHTML = '<span>✅</span> Location Found';
            setTimeout(resetLocateButton, 2000);
        },
        (error) => {
            console.error('Error getting location:', error);
            alert('Could not get your location. Please enable location services.');
            resetLocateButton();
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

function resetLocateButton() {
    const btn = document.getElementById('locateBtn');
    btn.innerHTML = '<span>📍</span> Find My Location';
    btn.disabled = false;
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
