/**
 * service-worker.js – Offline support & smart caching
 *
 * Strategies:
 *  - App shell & static assets → Cache-first
 *  - Navigation requests        → Network-first with offline fallback
 *  - Paystack SDK & CDN assets  → Stale-while-revalidate
 *  - /api/* requests            → Network-only (never cache payment calls)
 */

'use strict';

const CACHE_VERSION  = 'de-v1';
const STATIC_CACHE   = `${CACHE_VERSION}-static`;
const DYNAMIC_CACHE  = `${CACHE_VERSION}-dynamic`;

const APP_SHELL = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/app.js',
  '/js/cart.js',
  '/js/payment.js',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
];

// ── Install ────────────────────────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(APP_SHELL)),
  );
  self.skipWaiting();
});

// ── Activate ───────────────────────────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k.startsWith('de-') && k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map((k) => caches.delete(k)),
      ),
    ),
  );
  self.clients.claim();
});

// ── Fetch ──────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (e) => {
  const { request } = e;
  const url = new URL(request.url);

  // Never intercept payment / API calls – always go to network
  if (url.pathname.startsWith('/api/') || url.hostname.includes('paystack')) {
    return; // browser default – no caching
  }

  // Navigation → network-first, offline fallback
  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || caches.match('/offline.html')),
        ),
    );
    return;
  }

  // Static assets → cache-first
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font'
  ) {
    e.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const clone = res.clone();
            caches.open(DYNAMIC_CACHE).then((c) => c.put(request, clone));
            return res;
          }),
      ),
    );
    return;
  }

  // Everything else → stale-while-revalidate
  e.respondWith(
    caches.open(DYNAMIC_CACHE).then((cache) =>
      cache.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((res) => {
          cache.put(request, res.clone());
          return res;
        }).catch((err) => {
          if (cached) return cached;
          throw err;
        });
        return cached || fetchPromise;
      }),
    ),
  );
});
