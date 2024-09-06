self.addEventListener('install', event => {
    event.waitUntil(
        caches.open('todo-cache').then(cache => {
            return cache.addAll([
                '/to-do-list.html',
                '/to-do-list.css',
                '/to-do-list.js',
                // Add other resources you want to cache
            ]);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        })
    );
});
