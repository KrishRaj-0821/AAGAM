/**
 * AAGAM Service Worker — Progressive Web App Foundation (P0 Requirement 8)
 * 
 * Invariants:
 * 1. App Shell and cached read-only resources available offline.
 * 2. SAFE DRAFTING ONLY: Offline authoritative slot confirmation is STRICTLY PROHIBITED.
 *    Any POST to /api/slots/book/ while offline returns a safe draft state (HTTP 503 Service Unavailable / Draft Created).
 *    Authoritative slot confirmation strictly requires backend server acknowledgement.
 */

const CACHE_NAME = 'aagam-shell-v4';
const PRECACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './offline.html',
  './images/aagam_logo.png',
  './images/goi_emblem.png'
];

// Install: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[AAGAM SW] Pre-caching offline app shell...');
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('[AAGAM SW] Pre-cache warning:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

// Activate: Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Strategy dispatcher
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. Authoritative Booking Interception (P0-8 / Task 4: Genuine Offline Defense Only)
  if (event.request.method === 'POST' && url.pathname.includes('/api/slots/book')) {
    // Check if the device is genuinely offline
    const isOffline = (self.navigator && self.navigator.onLine === false);
    if (isOffline) {
      // Offline: Do NOT confirm booking. Return safe offline draft notice.
      event.respondWith(
        new Response(
          JSON.stringify({
            success: false,
            offline_mode: true,
            status: "DRAFT_PREPARED",
            code: "OFFLINE_CONFIRMATION_PROHIBITED",
            message: "OFFLINE MODE: Authoritative slot confirmation is not permitted while offline. Your request has been queued as a local draft. Connect to internet to confirm.",
            data: {
              requires_online_sync: true,
              server_acknowledged: false
            }
          }),
          {
            status: 503,
            statusText: "Service Unavailable (Offline Draft Only)",
            headers: { "Content-Type": "application/json" }
          }
        )
      );
      return;
    }
    // When ONLINE: Let the request pass directly to the network.
    // DO NOT intercept or convert online server/network errors into 503 offline drafts.
    return;
  }

  // 2. Read-Only API Calls: Network First with Cache Fallback
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200 && event.request.method === 'GET') {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(event.request);
          if (cached) return cached;
          return new Response(
            JSON.stringify({
              success: false,
              offline: true,
              message: "Network unavailable. Cached data expired or not found."
            }),
            { status: 503, headers: { "Content-Type": "application/json" } }
          );
        })
    );
    return;
  }

  // 3. Static App Shell Assets: Cache First, Network Fallback
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(async () => {
        if (event.request.mode === 'navigate') {
          return (await caches.match('./offline.html')) || (await caches.match('/offline.html'));
        }
      });
    })
  );
});
