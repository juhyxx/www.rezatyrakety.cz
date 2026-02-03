/**
 * Marker utilities for map application
 */

function createAwesomeMarker(color, icon, iconColor = "white") {
    return L.AwesomeMarkers.icon({
        icon: icon,
        markerColor: color,
        prefix: 'fa',
        iconColor: iconColor
    })
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

function renderMarks(marks, map, escapeHtml, getStatusColor) {
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
