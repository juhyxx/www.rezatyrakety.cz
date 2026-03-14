# PWA Setup for Rezaté Rakety Demo

This directory now contains a fully configured Progressive Web App (PWA) setup with screen wake lock support to prevent display sleep during lyrics viewing.

## Features Implemented

### 1. **Progressive Web App (PWA)**
   - **Manifest**: `manifest.json` with app metadata, icons, and display settings
   - **Service Worker**: `sw.js` for offline support and caching
   - **Meta Tags**: PWA meta tags added to `index.html` for mobile web app support

### 2. **Screen Wake Lock (Display Sleep Prevention)**
   - Automatically prevents display from sleeping when lyrics viewers are open
   - Uses modern Screen Wake Lock API with fallback support
   - Integrated into both `lyrics-viewer` and `lyrics-progress-viewer` components
   - Managed by `components/wake-lock.js`

## Installation & Testing

### Desktop (Chrome/Edge/Brave)

1. Open the app at `https://www.rezatyrakety.cz/demo/`
2. Look for the "Install app" option in the address bar or browser menu
3. Click to install
4. The app will appear in your applications menu

### Mobile (Android/iOS)

**Android (Chrome/Firefox):**
1. Open the app URL
2. Tap the three dots menu (⋮)
3. Select "Install app" or "Add to Home Screen"
4. The app will be installed to your home screen

**iOS (Safari):**
1. Open the app URL in Safari
2. Tap the Share button (↗)
3. Select "Add to Home Screen"
4. The app will be added to your home screen

## Screen Wake Lock Feature

### What It Does
- When you open the **Lyrics Viewer** or **Lyrics (Progress)** viewer, the display stays on
- When you close either viewer, the display can sleep normally
- If multiple viewers are open simultaneously, the wake lock remains active until all are closed

### How It Works
1. **Modern Browsers**: Using the Screen Wake Lock API (`navigator.wakeLock.request('screen')`)
2. **Fallback**: On unsupported browsers, a JavaScript loop keeps the device from sleeping
3. **Multiple Viewers**: Wake lock tracking prevents duplicate requests and premature release

### Browser Support
- ✅ Chrome/Chromium 84+
- ✅ Edge 84+
- ✅ Firefox 108+
- ✅ Opera 70+
- ⚠️ Safari: Fallback method used
- ⚠️ Older browsers: Fallback method used

## Files Added/Modified

### New Files
- `manifest.json` - PWA manifest with app metadata and configuration
- `sw.js` - Service Worker for offline support and caching
- `components/wake-lock.js` - Wake Lock Manager module

### Modified Files
- `index.html` - Added PWA meta tags and service worker registration
- `components/lyrics-viewer.js` - Integrated wake lock on open/close
- `components/lyrics-progress-viewer.js` - Integrated wake lock on open/close

## Service Worker Strategy

The service worker uses a hybrid caching strategy:
- **Static Assets**: Cache-first (cached locally, network as fallback)
- **API Requests**: Network-first (fresh data, cache as fallback)
- **Auto Updates**: Checks for service worker updates every 60 seconds

## Testing the PWA Features

### Test Offline Mode
1. Open DevTools (F12)
2. Go to **Application** → **Service Workers**
3. Check "Offline"
4. Navigate to different pages - they should load from cache

### Test Wake Lock
1. Open the app
2. Open the Lyrics Viewer or Progress Lyrics viewer
3. The display should stay on (won't sleep)
4. Check browser console for wake lock status messages
5. Close the viewer - the wake lock is released

### Test Update Detection
1. Open the app
2. The service worker will check for updates every 60 seconds
3. If new content is pushed, it will be cached automatically

## Customization

### Change App Colors
Edit `manifest.json`:
- `theme_color` - Browser UI color
- `background_color` - App background during load

### Change App Name
Edit `manifest.json`:
- `name` - Full app name (shown in installation)
- `short_name` - Short name (shown on home screen, max 12 chars)

### Change Icons
Replace the SVG in `manifest.json` with your own icons:
```json
{
  "src": "path/to/icon.png",
  "sizes": "192x192",
  "type": "image/png"
}
```

## Troubleshooting

### Service Worker Not Registering
- Check browser console for errors
- Open DevTools → Application → Service Workers
- Make sure `sw.js` is served from `/demo/` path

### Wake Lock Not Working
- Check browser console for wake lock status
- Ensure browser is in focus (some browsers require this)
- On mobile: Screen might have battery saver mode enabled

### App Won't Install
- App must be served over HTTPS (already satisfied)
- Check that `manifest.json` is properly linked in HTML
- Clear browser cache and try again

## Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| PWA Install | ✅ 51+ | ✅ 58+ | ⚠️ Add to Home | ✅ 79+ |
| Service Worker | ✅ 40+ | ✅ 44+ | ✅ 11.1+ | ✅ 17+ |
| Wake Lock API | ✅ 84+ | ✅ 108+ | ❌ | ✅ 84+ |
| Wake Lock Fallback | ✅ | ✅ | ✅ | ✅ |

## Resources

- [MDN - Web App Manifests](https://developer.mozilla.org/en-US/docs/Web/Manifest)
- [MDN - Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [MDN - Screen Wake Lock API](https://developer.mozilla.org/en-US/docs/Web/API/Screen_Wake_Lock_API)
- [PWA Checklist](https://web.dev/pwa-checklist/)

## Support

For issues or questions about the PWA setup, check the browser console (F12 → Console tab) for any errors or warnings related to service worker registration or wake lock requests.
