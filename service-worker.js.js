// Service Worker file
// PWA ko offline chalaane ke liye yeh file zaroori hai.
const CACHE_NAME = 'utility-app-v2'; // Cache version update kiya gaya hai
// Sirf core files jinhe offline access chahiye.
const urlsToCache = [
  './', 
  'index.html',
  'manifest.json'
];

// Installation: Assets ko cache mein jodna
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell assets.');
        return cache.addAll(urlsToCache);
      })
  );
  // Service Worker ko turant activate karna
  self.skipWaiting();
});

// Activation: Purane caches ko delete karna
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating and cleaning up old caches...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[Service Worker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Client claims karna, taaki naya worker turant control le sake
  return self.clients.claim();
});

// Fetch: Cached assets se content serve karna (Cache-First Strategy)
self.addEventListener('fetch', event => {
  // Sirf same-origin requests ko handle karein (aapke app ke files)
  if (event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          // Cache hit: cache se response return karo
          if (response) {
            return response;
          }
          // Cache miss: network se fetch karo
          return fetch(event.request);
        })
    );
  }
});