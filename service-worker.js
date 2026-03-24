// Digital Empire Service Worker
// Version: 1.0.0

const CACHE_NAME = 'digital-empire-v1';
const STATIC_CACHE = 'digital-empire-static-v1';
const DYNAMIC_CACHE = 'digital-empire-dynamic-v1';

// Assets to pre-cache on install (app shell)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/app.js',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/offline.html'
];

// ─── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching static assets');
      return cache.addAll(STATIC_ASSETS.map((url) => new Request(url, { cache: 'reload' })));
    }).then(() => self.skipWaiting())
  );
});

// ─── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  const allowedCaches = [STATIC_CACHE, DYNAMIC_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => !allowedCaches.includes(name))
          .map((name) => {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ─── Fetch ───────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle same-origin and https requests
  if (url.origin !== location.origin && !url.protocol.startsWith('http')) return;

  // Navigation requests: network-first with offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Static assets: cache-first
  if (isStaticAsset(request)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  // API requests: network-first
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request));
    return;
  }

  // Everything else: stale-while-revalidate
  event.respondWith(staleWhileRevalidate(request));
});

// ─── Caching Strategies ──────────────────────────────────────────────────────

/** Cache-first: great for versioned static assets */
async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    const response = await fetch(request);
    if (response.ok) await updateCache(STATIC_CACHE, request, response.clone());
    return response;
  } catch {
    return offlineFallback(request);
  }
}

/** Network-first: great for API calls */
async function networkFirst(request) {
  try {
    const response = await fetch(request);
    if (response.ok) await updateCache(DYNAMIC_CACHE, request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    return cached || offlineFallback(request);
  }
}

/** Network-first for navigation with offline page fallback */
async function networkFirstWithFallback(request) {
  try {
    const response = await fetch(request);
    if (response.ok) await updateCache(DYNAMIC_CACHE, request, response.clone());
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    const offline = await caches.match('/offline.html');
    return offline || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
  }
}

/** Stale-while-revalidate: serve cached immediately, refresh in background */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) updateCache(DYNAMIC_CACHE, request, response.clone());
    return response;
  }).catch(() => null);
  return cached || fetchPromise || offlineFallback(request);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isStaticAsset(request) {
  return /\.(js|css|png|jpg|jpeg|svg|gif|webp|woff2?|ttf|eot|ico)(\?.*)?$/.test(
    new URL(request.url).pathname
  );
}

async function updateCache(cacheName, request, response) {
  const cache = await caches.open(cacheName);
  await cache.put(request, response);
}

async function offlineFallback(request) {
  if (request.headers.get('Accept').includes('text/html')) {
    const offline = await caches.match('/offline.html');
    return offline || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html' } });
  }
  return new Response('', { status: 503, statusText: 'Service Unavailable' });
}

// ─── Background Sync ─────────────────────────────────────────────────────────
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-pending-requests') {
    event.waitUntil(syncPendingRequests());
  }
});

async function syncPendingRequests() {
  const cache = await caches.open(DYNAMIC_CACHE);
  const keys = await cache.keys();
  // Re-fetch any pending requests when back online
  return Promise.all(keys.map((request) => fetch(request).catch(() => null)));
}

// ─── Push Notifications ───────────────────────────────────────────────────────
self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body || 'New update from Digital Empire',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Dismiss' }
    ]
  };
  event.waitUntil(
    self.registration.showNotification(data.title || 'Digital Empire', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    const url = event.notification.data.url || '/';
    event.waitUntil(clients.openWindow(url));
  }
});
