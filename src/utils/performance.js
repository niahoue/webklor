/**
 * Utilitaires pour mesurer et optimiser les performances WebKlor
 */

/**
 * Mesure les Core Web Vitals
 */
export const measureWebVitals = () => {
  if (typeof window === 'undefined') return;

  // Fonction pour reporter les métriques
  const reportMetric = (metric) => {
    console.log(`📊 [WebKlor Perf] ${metric.name}:`, metric);
    
    // En production, envoyer à Google Analytics
    if (window.gtag && process.env.NODE_ENV === 'production') {
      window.gtag('event', metric.name, {
        event_category: 'Web Vitals',
        event_label: metric.id,
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        non_interaction: true,
      });
    }
  };

  // Importer web-vitals de façon dynamique
  import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
    onCLS(reportMetric);
    onFID(reportMetric);
    onFCP(reportMetric);
    onLCP(reportMetric);
    onTTFB(reportMetric);
  }).catch(() => {
    console.warn('⚠️ [WebKlor Perf] Web Vitals non disponible');
  });
};

/**
 * Mesure le temps de chargement des composants
 */
export const measureComponentLoad = (componentName) => {
  const startTime = performance.now();
  
  return () => {
    const endTime = performance.now();
    const loadTime = endTime - startTime;
    console.log(`⚡ [WebKlor Perf] ${componentName} chargé en ${loadTime.toFixed(2)}ms`);
    return loadTime;
  };
};

/**
 * Optimise les images en fonction de la taille de l'écran
 */
export const getOptimizedImageSrc = (baseSrc, options = {}) => {
  const { width, quality = 85, format = 'auto' } = options;
  
  // Pour les images locales, retourner l'original pour l'instant
  if (baseSrc.startsWith('/') || baseSrc.startsWith('./')) {
    return baseSrc;
  }
  
  // Pour les images externes, on pourrait utiliser un service comme Cloudinary
  return baseSrc;
};

/**
 * Précharge les ressources critiques
 */
export const preloadCriticalResources = () => {
  const criticalResources = [
    { href: '/assets/images/logo.png', as: 'image' },
    { href: '/assets/images/1000059598.png', as: 'image' }
  ];

  criticalResources.forEach(resource => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = resource.href;
    link.as = resource.as;
    
    if (resource.type) {
      link.type = resource.type;
    }
    
    document.head.appendChild(link);
  });
};

/**
 * Mesure et optimise le temps de première peinture
 */
export const optimizeFirstPaint = () => {
  // Supprimer les animations inutiles au premier chargement
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (reduceMotion) {
    document.body.classList.add('prefers-reduced-motion');
  }

  // Optimiser le chargement des polices
  if ('fonts' in document) {
    document.fonts.ready.then(() => {
      console.log('✅ [WebKlor Perf] Polices chargées');
    });
  }
};

/**
 * Détecte la vitesse de connexion et adapte les ressources
 */
export const adaptToConnectionSpeed = () => {
  if ('connection' in navigator) {
    const connection = navigator.connection;
    const connectionSpeed = connection.effectiveType;
    
    console.log(`📶 [WebKlor Perf] Vitesse de connexion: ${connectionSpeed}`);
    
    // Adapter la qualité des images selon la connexion
    if (connectionSpeed === 'slow-2g' || connectionSpeed === '2g') {
      document.body.classList.add('slow-connection');
      return 'low';
    } else if (connectionSpeed === '3g') {
      return 'medium';
    } else {
      return 'high';
    }
  }
  
  return 'high'; // Par défaut
};

/**
 * Optimise le scroll et les interactions
 */
export const optimizeScrollPerformance = () => {
  let ticking = false;
  
  const updateElements = () => {
    // Logique d'optimisation du scroll
    ticking = false;
  };
  
  const onScroll = () => {
    if (!ticking) {
      requestAnimationFrame(updateElements);
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', onScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', onScroll);
  };
};

/**
 * Fonction principale pour initialiser toutes les optimisations
 */
export const initializePerformanceOptimizations = () => {
  // Attendre que le DOM soit prêt
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      measureWebVitals();
      preloadCriticalResources();
      optimizeFirstPaint();
      adaptToConnectionSpeed();
      optimizeScrollPerformance();
    });
  } else {
    measureWebVitals();
    preloadCriticalResources();
    optimizeFirstPaint();
    adaptToConnectionSpeed();
    optimizeScrollPerformance();
  }
};

/**
 * Hook React pour les métriques de performance
 */
export const usePerformanceMetrics = (componentName) => {
  if (typeof window === 'undefined') return () => {};
  
  const measureEnd = measureComponentLoad(componentName);
  
  return measureEnd;
};
