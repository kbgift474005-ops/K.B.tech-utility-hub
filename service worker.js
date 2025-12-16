// Service Worker for basic PWA caching
const CACHE_NAME = 'calculator-v1';
const urlsToCache = [
  '/',
  '/index.html',
  // Note: These URLs are placeholders for standard PWA deployment. 
  // In a real environment, you would cache your dependencies like below:
  // 'https://cdn.tailwindcss.com',
  // 'https://unpkg.com/lucide@latest',
  // 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js',
  // ... and icon files:
  // '/images/icons/icon-192x192.png', 
  // '/images/icons/icon-512x512.png'
];

// Install event: Caches the necessary assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching App Shell');
        return cache.addAll(urlsToCache).catch(error => {
            console.warn('Caching failed for some resources:', error);
        });
      })
  );
});

// Fetch event: Serves cached content if available, otherwise fetches from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No match in cache - go to network
        return fetch(event.request);
      })
  );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});