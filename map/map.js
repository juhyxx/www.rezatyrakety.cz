const ICON_BASE_PATH = 'https://cdn.jsdelivr.net/npm/leaflet-awesome-markers@2.0.5/dist/images/markers/'

const currentYear = new Date().getFullYear();
let window_marks = [];
let currentFilter = 'all';

// DOM Elements
const yearSelect = document.getElementById('yearSelect');
const clearFilterBtn = document.getElementById('clearFilterBtn');
const venuesListContainer = document.getElementById('venuesList');
const filterWaitingBtn = document.getElementById('filterWaiting');
const filterContactBtn = document.getElementById('filterContact');
const filterAllBtn = document.getElementById('filterAll');

// Get or create venues-list component
let venuesList = venuesListContainer.querySelector('venues-list');
if (!venuesList) {
    venuesList = document.createElement('venues-list');
    venuesListContainer.innerHTML = '';
    venuesListContainer.appendChild(venuesList);
}

function convertToDecimal(coord) {
    if (coord.includes('°')) {
        const [degrees, minutes, seconds] = coord.match(/\d+(?:\.\d+)?/g).map(Number);
        return degrees + minutes / 60 + seconds / 3600;
    }
    return parseFloat(coord);
}

function convertGPS(input) {
    if (input) {
        const parts = input.split(',');
        const decimalLat = convertToDecimal(parts[0].trim().replace('N', ''));
        const decimalLon = convertToDecimal(parts[1].trim().replace('E', ''));
        return { lat: decimalLat, lon: decimalLon };
    }
}

function getStatusColor(status) {
    const colors = {
        'WAITING': 'text-blue-600',
        'CONTACT': 'text-orange-600',
        'CANCELED': 'text-gray-500'
    };
    return colors[status] || 'text-gray-600';
}

function createAwesomeMarker(color, icon, iconColor = "white") {
    return L.AwesomeMarkers.icon({
        icon: icon,
        markerColor: color,
        prefix: 'fa',
        iconColor: iconColor
    })
}

// Initialize year selector
function initYearSelector() {
    for (let year = currentYear; year >= 2005; year--) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year.toString();
        yearSelect.appendChild(option);
    }
    yearSelect.value = 'all';
}

function getMarkerIcon(mark) {
    let color = "gray";
    let icon = mark.festival ? "repeat" : "coffee";
    let iconColor = "white";

    try {
        switch (mark.status) {
            case "WAITING":
                color = "blue";
                break;
            case "CONTACT":
                color = "orange";
                break;
            case "CANCELED":
                color = "lightgray";
                iconColor = "gray";
                break;
            default:
                break;
        }
    } catch (e) {
    }

    if (mark.current) {
        color = "green";
    }

    return createAwesomeMarker(color, icon, iconColor);
}


function renderMarks(marks) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    marks.forEach(function (mark) {
        const marker = L.marker([mark.lat, mark.lon], { icon: getMarkerIcon(mark) }).addTo(map);

        const content = `
            <div class="font-semibold text-lg text-amber-900 mb-2">${escapeHtml(mark.nazev) || "N/A"}</div>
            <div class="text-sm text-gray-700 space-y-1">
                ${mark.count ? `<div><strong>Koncertů:</strong> ${mark.count}</div>` : ''}
                ${mark.datum ? `<div><strong>Poslední:</strong> ${mark.datum.toLocaleDateString('cs-CZ')}</div>` : ''}            
                ${mark.adresaMesto ? `<div><strong>Adresa:</strong> ${escapeHtml(mark.adresaMesto)} ${mark.adresaUlice ? escapeHtml(mark.adresaUlice) : ''}</div>` : ''}
                ${mark.WWW ? `<div><strong>WWW:</strong> <a href='${escapeHtml(mark.WWW)}' target='_blank' class="text-blue-600 hover:underline">${escapeHtml(mark.WWW)}</a></div>` : ''}
                ${mark.linkMapa ? `<div><strong>Mapy:</strong> <a target="_blank" href="https://en.mapy.cz/zakladni?q=${mark.linkMapa}" class="text-blue-600 hover:underline">${mark.linkMapa}</a></div>` : ''}
                ${mark.status ? `<div><strong>Status:</strong> <span class="font-semibold ${getStatusColor(mark.status)}">${mark.status}</span></div>` : ''}
                ${mark.note ? `<div class="mt-2 pt-2 border-t border-gray-300"><strong>Poznámka:</strong> ${escapeHtml(mark.note)}</div>` : ''}
            </div>
        `;
        marker.bindPopup(content);
    });
}


function getStatusColor(status) {
    const colors = {
        'WAITING': 'text-blue-600',
        'CONTACT': 'text-orange-600',
        'CANCELED': 'text-gray-500'
    };
    return colors[status] || 'text-gray-600';
}

function updateStatusCounts() {
    const waitingCount = window_marks.filter(m => m.status === 'WAITING').length;
    const contactCount = window_marks.filter(m => m.status === 'CONTACT').length;
    const totalFiltered = window_marks.filter(m => m.status === 'WAITING' || m.status === 'CONTACT').length;

    filterWaitingBtn.textContent = `Čekám (${waitingCount})`;
    filterContactBtn.textContent = `Kontakt (${contactCount})`;
    filterAllBtn.textContent = `Všechna (${totalFiltered})`;
}

function renderVenuesList(marks, filterStatus = null) {
    let filteredMarks = marks;
    if (filterStatus) {
        filteredMarks = marks.filter(m => m.status === filterStatus);
    } else {
        filteredMarks = marks.filter(m => m.status === 'WAITING' || m.status === 'CONTACT');
    }

    venuesList.setVenues(filteredMarks);
}

function applyFilters() {
    let filtered = window_marks;

    // Year filter
    const selectedYear = yearSelect.value;
    if (selectedYear !== 'all') {
        const year = parseInt(selectedYear);
        filtered = filtered.filter(mark => mark.datum && mark.datum.getFullYear() === year);
    } else {
        // Show all if year is "all"
        filtered = window_marks;
    }

    renderMarks(filtered);
    renderVenuesList(filtered, currentFilter === 'all' ? null : currentFilter);
}

// Event Listeners
yearSelect.addEventListener('change', applyFilters);

clearFilterBtn.addEventListener('click', () => {
    yearSelect.value = 'all';
    currentFilter = 'all';
    applyFilters();
    filterAllBtn.classList.add('bg-gray-600', 'hover:bg-gray-700');
    filterWaitingBtn.classList.remove('bg-blue-600', 'hover:bg-blue-700');
    filterContactBtn.classList.remove('bg-orange-600', 'hover:bg-orange-700');
});

filterWaitingBtn.addEventListener('click', () => {
    currentFilter = 'WAITING';
    filterWaitingBtn.classList.add('ring-2', 'ring-offset-2', 'ring-blue-400');
    filterContactBtn.classList.remove('ring-2', 'ring-offset-2', 'ring-orange-400');
    filterAllBtn.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-400');
    renderVenuesList(window_marks, 'WAITING');
});

filterContactBtn.addEventListener('click', () => {
    currentFilter = 'CONTACT';
    filterContactBtn.classList.add('ring-2', 'ring-offset-2', 'ring-orange-400');
    filterWaitingBtn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-400');
    filterAllBtn.classList.remove('ring-2', 'ring-offset-2', 'ring-gray-400');
    renderVenuesList(window_marks, 'CONTACT');
});

filterAllBtn.addEventListener('click', () => {
    currentFilter = 'all';
    filterAllBtn.classList.add('ring-2', 'ring-offset-2', 'ring-gray-400');
    filterWaitingBtn.classList.remove('ring-2', 'ring-offset-2', 'ring-blue-400');
    filterContactBtn.classList.remove('ring-2', 'ring-offset-2', 'ring-orange-400');
    renderVenuesList(window_marks);
});

// Initialize
initYearSelector();

var map = L.map('mapa').setView([49.7461, 13.3771], 12);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch("../be/map.php").then((response) => {
    return response.json()
}).then((data) => {
    window_marks = data.map((item) => {
        const gps = convertGPS(item.linkMapa);

        return {
            nazev: item.jmeno,
            datum: item.datum ? new Date(item.datum) : null,
            adresaMesto: item.adresaMesto,
            adresaUlice: item.adresaUlice,
            WWW: item.WWW,
            linkMapa: item.linkMapa,
            count: item.count,
            lat: gps.lat,
            lon: gps.lon,
            old: item.is_old == "1",
            current: item.is_current == "1",
            festival: item.festival == "1",
            note: item.note,
            status: item.status,
        }
    })

    renderMarks(window_marks);
    updateStatusCounts();
    renderVenuesList(window_marks);
}).catch(err => {
    console.error('Chyba při načítání dat:', err);
    venuesList.innerHTML = '<p class="text-red-600 text-sm">Chyba při načítání míst</p>';
});