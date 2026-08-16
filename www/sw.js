/* IRONFORGE offline cache.
   Network-first: you always get the newest version when you have signal, and
   the last good copy when you don't. Cache-first would strand you on an old
   build after every update, which is a worse problem than a slow first paint. */
const CACHE = 'ironforge-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  // never cache API traffic — those are one-shot calls with keys in them
  if (/googleapis\.com\/v1beta|api\.anthropic\.com|api\.openai\.com/.test(req.url)) return;

  e.respondWith(
    fetch(req)
      .then(res => {
        // stash fonts, Chart.js and the app shell for offline use
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put(req, copy)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req).then(hit => hit || caches.match('./index.html')))
  );
});
