/**
 * TBC service worker (PWA)
 *
 * Strategies:
 *  - Navigations (pages): network-first → cache → /offline.html
 *    (admin pages & APIs are NEVER cached — always network)
 *  - Static assets (/_next/static/*, images, fonts): cache-first (immutable)
 *
 * Bump VERSION to invalidate all caches on the next visit.
 */
const VERSION = 'tbc-v1'
const STATIC_CACHE = `tbc-static-${VERSION}`
const PAGE_CACHE = `tbc-pages-${VERSION}`
const OFFLINE_URL = '/offline.html'

const PRECACHE = [
  OFFLINE_URL,
  '/tbc-logo.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/maskable-512.png',
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !k.endsWith(VERSION)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', (event) => {
  const req = event.request
  if (req.method !== 'GET') return

  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return // cross-origin (blob CDN, fonts) — pass through
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return // never cache
  if (url.pathname === '/sw.js' || url.pathname === '/manifest.json') return // keep fresh

  // Page navigations: network-first with offline fallback
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone()
          caches.open(PAGE_CACHE).then((cache) => cache.put(req, copy))
          return res
        })
        .catch(() =>
          caches
            .match(req)
            .then((hit) => hit || caches.match(OFFLINE_URL))
        )
    )
    return
  }

  // Immutable static assets: cache-first
  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    /\.(png|jpg|jpeg|webp|gif|svg|ico|css|woff2?)$/.test(url.pathname)
  if (isStatic) {
    event.respondWith(
      caches.match(req).then(
        (hit) =>
          hit ||
          fetch(req).then((res) => {
            const copy = res.clone()
            caches.open(STATIC_CACHE).then((cache) => cache.put(req, copy))
            return res
          })
      )
    )
  }
})
