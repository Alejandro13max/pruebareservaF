/* ==========================================================================
   SERVICE WORKER - MULTI CANCHA PWA
   Materia: Diseño Web II (SIS-0141)
   Docente: Ing. Miguel Angel Cruz Ramos
   ========================================================================== */

const CACHE_NAME = 'multicancha-pwa-v4';

const CORE_ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './styles.css',
    './css/layout.css',
    './css/tarjeta.css',
    './script.js',
    './js/tarjeta.js',
    './js/layout.js',
    './img/icon-192.png',
    './img/icon-512.png',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css',
    'https://code.jquery.com/jquery-3.7.1.min.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Teko:wght@500;700&family=Outfit:wght@300;500;700&display=swap'
];

/* FASE 1: INSTALACIÓN DEL SERVICE WORKER (Precacheo del Core) */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[PWA SW] Precacheando recursos esenciales...');
                return cache.addAll(CORE_ASSETS).catch((err) => {
                    console.warn('[PWA SW] Advertencia en precacheo inicial:', err);
                });
            })
            .then(() => self.skipWaiting())
    );
});

/* FASE 2: ACTIVACIÓN Y LIMPIEZA DE VERSIONES ANTERIORES */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((oldKey) => {
                    console.log('[PWA SW] Eliminando caché obsoleta:', oldKey);
                    return caches.delete(oldKey);
                })
            );
        }).then(() => self.clients.claim())
    );
});

/* FASE 3: INTERCEPTOR DE PETICIONES HTTP (Offline-First) */
self.addEventListener('fetch', (event) => {
    const req = event.request;

    // Solo procesar peticiones HTTP/HTTPS con método GET
    if (req.method !== 'GET') return;

    // Estrategia 1: Imágenes locales (img/) -> Cache-First con almacenamiento en tiempo de ejecución
    if (req.url.includes('/img/')) {
        event.respondWith(
            caches.match(req).then((cachedResponse) => {
                if (cachedResponse) return cachedResponse;

                return fetch(req).then((networkResponse) => {
                    if (networkResponse && networkResponse.ok) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    }
                    return networkResponse;
                }).catch(() => {
                    // Si falla la red y no está en caché, devolvemos index.html o recurso en caché
                    return caches.match('./index.html');
                });
            })
        );
        return;
    }

    // Estrategia 2: Recursos Core y CDNs -> Cache-First con fallback a red
    event.respondWith(
        caches.match(req).then((cachedResponse) => {
            if (cachedResponse) {
                // Si está en caché, lo servimos de inmediato para máxima velocidad offline
                return cachedResponse;
            }

            // Si no está en caché, solicitar por red
            return fetch(req).then((networkResponse) => {
                if (networkResponse && networkResponse.ok) {
                    // Cachear peticiones exitosas de CDNs aprobados
                    if (
                        req.url.includes('cdn.jsdelivr.net') ||
                        req.url.includes('cdnjs.cloudflare.com') ||
                        req.url.includes('fonts.googleapis.com') ||
                        req.url.includes('fonts.gstatic.com')
                    ) {
                        const clone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(req, clone));
                    }
                }
                return networkResponse;
            }).catch(() => {
                // Fallback offline: Si es una navegación del usuario, retornar index.html precacheado
                if (req.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            });
        })
    );
});
