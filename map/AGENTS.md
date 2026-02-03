# Map Application Documentation

## Overview
Interactive web-based map application for visualizing concert venues and performance history of the band Rezaté Rakety. The app displays venue locations with concert statistics, status information, and year-based filtering.

## Technology Stack
- **Frontend**: Vanilla JavaScript, HTML5, CSS3, Tailwind CSS (dark mode support)
- **Mapping**: Leaflet.js (OpenStreetMap-based)
- **Icons**: Font Awesome 4.0 + Leaflet Awesome Markers
- **Backend**: PHP API (`../be/map.php`)
- **Dark Mode**: Native CSS `prefers-color-scheme` media query with localStorage persistence

## Architecture

### Files
- `index.html` — Main HTML structure with map container and year range slider
- `map.js` — Core application logic: data fetching, marker rendering, filtering
- `map.css` — Styling for the map container and UI elements

## Key Components

### 1. Map Initialization (`map.js`)
- **Framework**: Leaflet.js with OpenStreetMap tile layer
- **Center**: Czech Republic (49.7461°N, 13.3771°E)
- **Default Zoom**: 12

### 2. Data Source & Processing
**API Endpoint**: `../be/map.php`

**Data Structure** (from backend):
```json
{
  "jmeno": "Venue Name",
  "datum": "ISO 8601 date",
  "adresaMesto": "City",
  "adresaUlice": "Street",
  "WWW": "Website URL",
  "linkMapa": "GPS coordinates (formatted or decimal)",
  "count": "Number of concerts",
  "is_old": "0 or 1 (performance > 10 years old)",
  "is_current": "0 or 1 (future performance)",
  "festival": "0 or 1 (festival flag)",
  "note": "Additional notes",
  "status": "WAITING|CONTACT|CANCELED|other"
}
```

**Processing**:
- GPS coordinate conversion (DMS to decimal format)
- Date parsing (ISO 8601 → JavaScript Date objects)
- Data enrichment (marker icons, colors based on status)

### 3. Marker System
**Icon Factory** (`createAwesomeMarker(color, icon, iconColor)`):
- Uses Leaflet Awesome Markers library
- Font Awesome icons + custom color scheme

**Status-Based Color Coding**:
| Status | Color | Icon | Purpose |
|--------|-------|------|---------|
| Current | Green | Coffee/Repeat | Upcoming or recent performance |
| Waiting | Blue | Coffee/Repeat | Venue contacted, pending confirmation |
| Contact | Orange | Coffee/Repeat | Need to contact venue |
| Canceled | Light Gray | Coffee/Repeat (gray) | Performance canceled |
| Default | Gray | Coffee/Repeat | Past performance |

**Icon Types**:
- `coffee` — Regular venue
- `repeat` — Festival

### 4. Year Range Filtering
**UI Element**: HTML `<select>` dropdown with dynamically populated year options (2005–current year)

**Filter Logic**:
- Updates map markers based on selected year
- Displays only concerts from that year
- Dropdown change listener triggers `applyFilters()` function

### 5. Popup Content
Each marker displays:
- Venue name
- Concert count
- Last performance date
- Address (city + street)
- Website link (if available)
- GPS coordinates (as clickable Mapy.cz link)
- Status
- Notes/remarks

**Security**: HTML escaping applied to user-controlled fields (venue name, address, notes)

### 6. UI Layout (CSS)
- **Container**: Flexbox row layout
  - `#mapa` — 80% width (flex: 4)
  - `#kluby` — 20% width (flex: 1) [commented out in current version]
- **Map**: Full viewport width, 90vh minimum height
- **Responsive**: Mobile-first but primarily desktop-oriented

## Data Flow
```
User opens page
    ↓
Map initialized at Czech center
    ↓
Fetch concert venues from /be/map.php
    ↓
Convert GPS coords, parse dates, enrich data
    ↓
Render all markers on map
    ↓
User adjusts year range
    ↓
Filter marks by selected year
    ↓
Re-render filtered markers
    ↓
User clicks marker → Popup displays venue/concert details
    ↓
User clicks popup link (coordinates) → Opens Mapy.cz
```

## Notable Features

### GPS Coordinate Handling
- **Supports two formats**:
  1. Decimal: `49.7461, 13.3771`
  2. DMS (Degrees, Minutes, Seconds): `49°44'46.0"N, 13°22'37.6"E`
- Automatic conversion via `convertToDecimal()` and `convertGPS()`

### Dark Mode Support
- System preference detection (`prefers-color-scheme: dark`)
- Persists user preference in localStorage
- Toggle button in header with moon/sun icons (🌙/☀️)
- Full Tailwind CSS dark mode coverage:
  - Sidebar and legend adapt to dark theme
  - Venue cards with dark variants
  - Status badges with high contrast in dark mode
  - Leaflet map subtle brightness adjustment in dark mode

### Marker Interactivity
- Click marker → Popup with full venue details
- Click coordinate link in popup → Opens Mapy.cz (Czech national map)
- Commented out list feature (historical remnant in `renderList()`) for manual venue navigation

### Performance Status Timeline
- **Past**: Gray markers for historical performances (> 10 years old)
- **Current**: Green markers for recent/upcoming performances
- **Future Bookings**: Yellow/orange for venues in negotiation

## Unused/Commented Code
- `renderList()` function — Club list sidebar (currently disabled)
- `#kluby` HTML container — For future enhancement

## Dependencies
- **External**: Leaflet 1.7.1, Font Awesome 4.0, Leaflet Awesome Markers 2.0.2
- **Internal**: Backend PHP API (`be/map.php`) for venue data

## Known Limitations
- No offline map support (requires internet connection)
- GPS format parsing is basic (assumes `N` for latitude, `E` for longitude)
- No clustering for dense venue areas
- Year selector limited to 2005–present (hardcoded)
- Dark mode map filter (brightness/contrast adjustment) is subtle and not ideal for all users

## Future Enhancements
- Enable venue list sidebar for alternative navigation
- Add marker clustering for high-density areas
- Support custom date ranges beyond 2005–present
- Add search/filter by venue name
- Implement venue performance statistics overlay
- Mobile responsive improvements
- Alternative dark mode map rendering (vector tiles with dark theme)

## Related Files
- Backend: `be/map.php` — Queries database for concert venues
- Frontend Integration: Used on main website as embedded iframe or standalone page
