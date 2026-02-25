// NO-OP Service Worker - Kills the old caching service worker
// This file intentionally does nothing

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            return self.clients.claim();
        })
    );
});

// Pass through all requests - no caching
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
