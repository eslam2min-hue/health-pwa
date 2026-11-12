// رقم الإصدار: غيّره عند أي تعديل ليتحدث الكاش
const CACHE_VERSION = 'v1';
const CACHE = 'health-pwa-' + CACHE_VERSION;
const FILES = ['./','./index.html','./style.css','./app.js','./data.js','./manifest.json',
  './icons/icon-192.svg','./icons/icon-512.svg','./icons/icon-maskable.svg'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys()
    .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// cache-first مع الرجوع للصفحة الرئيسية عند التنقل دون إنترنت
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => hit || fetch(e.request).catch(() =>
    e.request.mode === 'navigate' ? caches.match('./index.html') : undefined)));
});
