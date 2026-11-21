// Service Worker MY HOMS (akun uji) — cache aset statis agar aplikasi terbuka instan;
// permintaan ke Google Apps Script TIDAK pernah diambil dari cache (selalu data terbaru).
const CACHE_NAME = 'myhoms-uji-v1';
const STATIC_ASSETS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/config.js',
  './manifest.json'
];

self.addEventListener('install', function (event) {
  event.waitUntil(caches.open(CACHE_NAME).then(function (cache) { return cache.addAll(STATIC_ASSETS); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) { if (k !== CACHE_NAME) return caches.delete(k); }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  const url = new URL(event.request.url);

  // Backend GAS: selalu jaringan, tidak pernah cache (data harus selalu terbaru & sesi tidak boleh basi).
  if (url.hostname.indexOf('script.google.com') >= 0 || url.hostname.indexOf('script.googleusercontent.com') >= 0) {
    event.respondWith(fetch(event.request));
    return;
  }
  // Aset pihak ketiga (font, Chart.js): coba jaringan dulu, baru cache.
  if (url.origin !== location.origin) {
    event.respondWith(fetch(event.request).catch(function () { return caches.match(event.request); }));
    return;
  }
  // Aset statis sendiri: cache dulu untuk kecepatan, perbarui di latar belakang.
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      const network = fetch(event.request).then(function (res) {
        if (res && res.status === 200) caches.open(CACHE_NAME).then(function (c) { c.put(event.request, res.clone()); });
        return res;
      }).catch(function () { return cached; });
      return cached || network;
    })
  );
});
