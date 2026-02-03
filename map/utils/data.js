/**
 * Data utilities for map application
 */

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
    return (unsafe || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/'/g, "&#39;")
        .replace(/\n/g, "<br>");
}

function getStatusColor(status) {
    const colors = {
        'WAITING': 'text-blue-600',
        'CONTACT': 'text-orange-600',
        'CANCELED': 'text-gray-500'
    };
    return colors[status] || 'text-gray-600';
}
