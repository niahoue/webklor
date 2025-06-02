// Service Worker WebKlor - Cache et optimisation performance
const CACHE_NAME = 'webklor-v1';
const STATIC_CACHE_NAME = 'webklor-static-v1';
const DYNAMIC_CACHE_NAME = 'webklor-dynamic-v1';

// Ressources statiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/assets/css/bootstrap.min.css',
  '/assets/images/logo.png',
  '/assets/images/favicon.png',
  // Polices Google Fonts critiques
  'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Pacifico&display=swap'
];

// Stratégies de cache
const CACHE_STRATEGIES = {
  // Cache First - pour les assets statiques
  cacheFirst: ['css', 'js', 'woff', 'woff2', 'ttf', 'eot'],
  // Network First - pour les API et contenu dynamique  
  networkFirst: ['api'],
  // Stale While Revalidate - pour les images et pages
  staleWhileRevalidate: ['png', 'jpg', 'jpeg', 'webp', 'avif', 'gif', 'svg', 'html']
};

// Installation du Service Worker
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Cache statique ouvert');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('[SW] Assets statiques mis en cache');
        return self.skipWaiting();
      })
  );
});

// Activation du Service Worker
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE_NAME && cacheName !== DYNAMIC_CACHE_NAME) {
              console.log('[SW] Suppression ancien cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Service Worker activé');
        return self.clients.claim();
      })
  );
});

// Interception des requêtes réseau
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-GET et les extensions du navigateur
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }
  
  // Déterminer la stratégie de cache selon le type de fichier
  const fileExtension = url.pathname.split('.').pop();
  const strategy = getStrategy(fileExtension, url);
  
  switch (strategy) {
    case 'cacheFirst':
      event.respondWith(cacheFirst(request));
      break;
    case 'networkFirst':
      event.respondWith(networkFirst(request));
      break;
    case 'staleWhileRevalidate':
      event.respondWith(staleWhileRevalidate(request));
      break;
    default:
      event.respondWith(networkFirst(request));
  }
});

// Déterminer la stratégie appropriée
function getStrategy(fileExtension, url) {
  if (CACHE_STRATEGIES.cacheFirst.includes(fileExtension)) {
    return 'cacheFirst';
  }
  if (url.pathname.includes('/api/') || CACHE_STRATEGIES.networkFirst.includes(fileExtension)) {
    return 'networkFirst';
  }
  if (CACHE_STRATEGIES.staleWhileRevalidate.includes(fileExtension)) {
    return 'staleWhileRevalidate';
  }
  return 'networkFirst';
}

// Stratégie Cache First - idéale pour les assets statiques
async function cacheFirst(request) {
  try {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    console.log('[SW] Cache First error:', error);
    return new Response('Offline', { status: 503 });
  }
}

// Stratégie Network First - idéale pour l'API et contenu dynamique
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE_NAME);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    return new Response('Offline', { status: 503 });
  }
}

// Stratégie Stale While Revalidate - idéale pour les images et pages
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE_NAME);
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => {
    // En cas d'erreur réseau, retourner la version en cache
    return cachedResponse;
  });
  
  // Retourner immédiatement la version en cache si disponible, sinon attendre le réseau
  return cachedResponse || fetchPromise;
}

// Gestion de la mise à jour des caches
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
      })
    );
  }
});

// Pré-cache des images critiques quand le navigateur est idle
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'PRECACHE_IMAGES') {
    const images = event.data.images || [];
    
    event.waitUntil(
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return Promise.all(
          images.map((imageUrl) => {
            return fetch(imageUrl).then((response) => {
              if (response.ok) {
                return cache.put(imageUrl, response);
              }
            }).catch((error) => {
              console.log('[SW] Erreur pré-cache image:', imageUrl, error);
            });
          })
        );
      })
    );
  }
});
