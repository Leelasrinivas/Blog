// Simple Service Worker for Leela Srinivas Portfolio
const CACHE_NAME = 'leela-portfolio-v1';
const urlsToCache = [
  '/',
  '/css/styles.css',
  '/css/animations.css',
  '/js/main.js',
  '/js/particles.js',
  '/js/terminal.js',
  '/js/particles.json',
  '/assets/icons.svg'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});