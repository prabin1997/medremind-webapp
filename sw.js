const CACHE_NAME = 'sw-cache-v1';
const toCache = [
  './',
  './users/home',
  './users/about',
  './users/learn',
  './users/login',
  './users/contact',
  './css/style.css',
  './img/learn1.jpg',
  './img/learn2.jpg',
  './img/learn3.jpg',
  './img/med.png',
  './img/icons/favicon.ico',
  './img/icons/apple-touch-icon.png',
  './js/main.js',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v48/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/css/materialize.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/materialize/1.0.0/js/materialize.min.js',
  'https://code.jquery.com/jquery-2.1.1.min.js'

];


  // install event
  self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(function(cache) {
          return cache.addAll(toCache)
        })
        .then(self.skipWaiting())
    )
  })

// activate event
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then((keyList) => {
        return Promise.all(keyList.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache', key)
            return caches.delete(key)
          }
        }))
      })
      .then(() => self.clients.claim())
  )
})


// fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    fetch(event.request)
      .catch(() => {
        return caches.open(CACHE_NAME)
          .then((cache) => {
            return cache.match(event.request)
          })
      })
  )
})