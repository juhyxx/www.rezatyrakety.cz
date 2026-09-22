const CACHE_VERSION = 'v3';
const CACHE_NAME = `rezaty-rakety-demo-${CACHE_VERSION}`;
const ASSETS_TO_CACHE = [
    '/demo/',
    '/demo/index.html',
    '/demo/app.js',
    '/demo/app.css',
    '/demo/manifest.json',
    '/demo/components/helpers.js',
    '/demo/components/song-card.js',
    '/demo/components/song-book.js',
    '/demo/components/lyrics-viewer.js',
    '/demo/components/lyrics-progress-viewer.js',
    '/demo/components/playlist-viewer.js',
    '/demo/components/recent-files-viewer.js',
    '/demo/styles/lyrics-shared.css'
];

// Install event - cache assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                // Cache only the files that are statically available
                return cache.addAll([
                    '/demo/',
                    '/demo/index.html',
                    '/demo/manifest.json'
                ]).catch(() => {
                    // Fail silently if some assets aren't available during install
                    console.log('Some assets unavailable during install, they will be cached on first use');
                });
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((cacheName) => cacheName.startsWith('rezaty-rakety-demo-') && cacheName !== CACHE_NAME)
                        .map((cacheName) => caches.delete(cacheName))
                );
            })
            .then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }

    // Requests that explicitly opt out of caching (e.g. lyrics/song-list
    // fetches using `cache: 'no-store'`) must bypass the SW cache entirely,
    // otherwise stale content gets served forever regardless of the caller's intent.
    if (request.cache === 'no-store') {
        event.respondWith(fetch(request));
        return;
    }

    // Handle API requests with network-first strategy
    if (url.pathname.endsWith('.php') || url.pathname.includes('/api/')) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    // Cache successful responses
                    if (response.ok) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Try cache on network failure
                    return caches.match(request);
                })
        );
        return;
    }

    // Handle app files (JS, CSS, HTML) with network-first strategy so updates are picked up
    const isAppFile = /\.(js|css|html)$/.test(url.pathname) || url.pathname === '/demo/' || url.pathname.endsWith('/demo');
    // Song content (lyrics, sheet music, per-song metadata) can be edited at any
    // time, so it needs the same network-first treatment as app files. Only the
    // large media files (mp3) stay on the cache-first path below.
    const isContentFile = url.pathname.startsWith('/demo/data/') && /\.(md|markdown|json|pdf|txt)$/.test(url.pathname);
    if (isAppFile || isContentFile) {
        event.respondWith(
            fetch(request)
                .then((response) => {
                    if (response && response.status === 200) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseToCache);
                        });
                    }
                    return response;
                })
                .catch(() => {
                    // Fall back to cache when offline
                    return caches.match(request).then((cached) => cached || caches.match('/demo/index.html'));
                })
        );
        return;
    }

    // Handle other static assets (images, fonts, data files) with cache-first strategy
    event.respondWith(
        caches.match(request)
            .then((response) => {
                if (response) {
                    return response;
                }

                return fetch(request)
                    .then((response) => {
                        if (response && response.status === 200) {
                            const responseToCache = response.clone();
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(request, responseToCache);
                            });
                        }
                        return response;
                    });
            })
            .catch(() => {
                return caches.match('/demo/index.html');
            })
    );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});
