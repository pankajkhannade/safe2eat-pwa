const CACHE_NAME = 'safe2eat-v1';
const ASSETS = ['/', 'index.html', 'manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(k => Promise.all(k.filter(n => n !== CACHE_NAME).map(n => caches.delete(n))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // Only cache GET requests to our origin
  if (e.request.method !== 'GET') return;
  if (!e.request.url.includes('pankajkhannade.github.io/safe2eat-pwa')) return;
  
  e.respondWith(
    fetch(e.request)
      .then(r => { if (r.ok) { const clone = r.clone(); caches.open(CACHE_NAME).then(c => c.put(e.request, clone)); } return r; })
      .catch(() => caches.match(e.request).then(c => c || fetch(e.request)))
  );
});