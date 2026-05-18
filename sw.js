const CACHE = 'safe2eat-v1';
const STATIC = [ '/index.html', '/manifest.json' ];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(STATIC)));
  self.skipWaiting();
});

self.addEventListener('fetch', e => {
  if (e.request.url.includes('openfoodfacts.org')) {
    e.respondWith(fetch(e.request).catch(() => new Response(JSON.stringify({status: 0, error: 'Offline'}), {headers: {'Content-Type': 'application/json'}})));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
