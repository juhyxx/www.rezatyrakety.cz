
const currentYear = new Date().getFullYear();
const datalist = document.getElementById('values');
const ICON_BASE_PATH = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-';
const rangeInput = document.getElementById('range');
const output = document.querySelector('output');
const klubyList = document.getElementById('kluby');

datalist.innerHTML = '';

for (let year = 2005; year <= currentYear; year++) {
    const option = document.createElement('option');
    option.value = year;
    option.label = year.toString();
    datalist.appendChild(option);
}

rangeInput.min = "2005";
rangeInput.max = currentYear.toString();
rangeInput.value = currentYear.toString();
output.textContent = rangeInput.min + "-" + currentYear.toString();
rangeInput.addEventListener('input', function () {
    output.textContent = this.value;
});

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
function escapeHtml(unsafe = "") {
    console.log(unsafe)
    return (unsafe || "")
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/'/g, "'")
        .replace(/\n/g, "<br>");
}


function renderMarks(marks) {
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer);
        }
    });

    marks.forEach(function (mark) {
        var marker = L.marker([mark.lat, mark.lon], {
            icon: getMarkerIcon(mark)
        }).addTo(map);
        var content = `<strong>${escapeHtml(mark.nazev) || "N/A"}</strong><hr>
            ${mark.count ? `<strong>Koncertů:</strong> ${mark.count}<br>` : ''}
            ${mark.datum ? `<strong>Poslední koncert:</strong> ${mark.datum.toLocaleDateString()}<br>` : ''}            
            ${mark.adresaMesto ? `<strong>Adresa:</strong> ${escapeHtml(mark.adresaMesto)} ` : ''}
            ${mark.adresaUlice ? `${escapeHtml(mark.adresaUlice)}` : ''}
            <br>
            ${mark.WWW ? `<strong>WWW:</strong> <a href='${escapeHtml(mark.WWW)}' target='_blank'>${escapeHtml(mark.WWW)}</a><br>` : ''}
            ${mark.linkMapa ? `<strong>Souřadnice:</strong> <a target="_blank" href="https://en.mapy.cz/zakladni?q=${mark.linkMapa}">${mark.linkMapa}</a>` : ''}
            ${mark.note ? `<hr><strong>Poznámka:</strong> ${escapeHtml(mark.note)}` : ''}`; marker.bindPopup(content);
    });
}


function renderList(marks) {
    let content = marks.filter(mark => !mark.datum).map((mark) => {
        const { lat, lon } = convertGPS(mark.linkMapa);
        return `<div onclick="map.setView([${lat}, ${lon}], 14)">
            <div><b>${mark.nazev}</b> ${mark.adresaMesto}</div>
            <pre>${mark.note}</pre>
        </div>`
    })

    klubyList.innerHTML = klubyList.innerHTML + content.join("");

}

function getMarkerIcon(mark) {
    const iconOptions = {
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    };

    if (!mark.datum) {
        iconOptions.iconUrl = `${ICON_BASE_PATH}yellow.png`;
    } else if (mark.festival) {
        iconOptions.iconUrl = `${ICON_BASE_PATH}green.png`;
    } else if (mark.current) {
        iconOptions.iconUrl = `${ICON_BASE_PATH}red.png`;
    } else {
        iconOptions.iconUrl = `${ICON_BASE_PATH}blue.png`;
    }

    return L.icon(iconOptions);
}


function rangeChanged(e) {
    let year = parseInt(e.target.value)
    document.querySelector("output").innerHTML = year

    filteredMarks = window.marks.filter(mark =>
        mark.datum && mark.datum.getFullYear() == year
    );
    renderMarks(filteredMarks)
}

document.getElementById("range").addEventListener("input", rangeChanged)

var map = L.map('mapa').setView([49.7461, 13.3771], 12);
// Add this code after the map is initialized
var legend = L.control({ position: 'bottomright' });



legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = ["Klub", "Festival", "Nehráli", "Aktuální"];
    var labels = [
        ICON_BASE_PATH + "blue.png",
        ICON_BASE_PATH + "green.png",
        ICON_BASE_PATH + "yellow.png",
        ICON_BASE_PATH + "red.png"
    ];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background-image: url(' + labels[i] + '); background-size: cover;"></i> ' + grades[i] + '<br>';
    }
    return div;
};

legend.addTo(map);

var marks = [];

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

fetch("../be/map.php").then((response) => {
    return response.json()
}).then((data) => {
    marks = data.map((item) => {
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
            note: item.note
        }
    })
    window.marks = marks;

    renderMarks(marks)
    renderList(marks)
})