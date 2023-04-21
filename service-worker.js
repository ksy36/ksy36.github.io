const cacheName = 'static-cache';

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(cacheName).then((cache) => {
            console.log('Opened cache:', cacheName);
        })
    );
});


self.addEventListener('fetch', (event) => {
    if (event.request.url.endsWith('.png')) {
        event.respondWith(fetch(event.request));
    } else {
        event.respondWith(
            caches.match(event.request).then((cached) => {
                if (cached) {
                    return cached;
                }

                return fetch(event.request).then((networkResponse) => {
                    // Clone the response
                    const clonedResponse = networkResponse.clone();

                    caches.open(cacheName).then((cache) => {
                        cache.put(event.request, clonedResponse);
                    });

                    return networkResponse;
                });
            })
        );
    }
});
