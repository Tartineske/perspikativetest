const CACHE_NAME = 'perspikative-v2';

// 1. Liste ici tes fichiers CRITIQUES (ceux nécessaires pour l'accueil)
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/pics/meta/logo-192.png',
  '/pics/meta/logo-512.png',
  '/portfolio.html',
  '/style.css',
  '/script.js',
];

// Installation : Mise en cache des fichiers critiques
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activation : Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Stratégie : Réseau en priorité, sinon Cache (avec mise en cache automatique)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // Si la réponse est valide, on en fait une copie dans le cache
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Si le réseau échoue (hors ligne), on cherche dans le cache
        return caches.match(event.request);
      })
  );
});