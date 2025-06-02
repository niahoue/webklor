import { useEffect } from 'react';

/**
 * Composant pour charger les scripts tiers de manière optimisée
 * Évite les blocages de rendu et améliore les performances
 */
const ThirdPartyScripts = () => {
  useEffect(() => {
    // Fonction pour charger Google Analytics de manière asynchrone
    const loadGoogleAnalytics = () => {
      // Éviter de charger plusieurs fois
      if (window.gtag) return;

      const script = document.createElement('script');
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-FWGHPFWF0T';
      script.onload = () => {
        window.dataLayer = window.dataLayer || [];
        function gtag() {
          window.dataLayer.push(arguments);
        }
        window.gtag = gtag;
        gtag('js', new Date());
        gtag('config', 'G-FWGHPFWF0T', {
          page_title: document.title,
          page_location: window.location.href,
          anonymize_ip: true, // Pour la conformité RGPD
          send_page_view: true
        });
        console.log('📊 [WebKlor Analytics] Google Analytics chargé avec succès');
      };
      script.onerror = () => {
        console.warn('⚠️ [WebKlor Analytics] Erreur de chargement Google Analytics');
      };
      document.head.appendChild(script);
    };

    // Fonction pour précharger les domaines critiques
    const preloadCriticalDomains = () => {
      const domains = [
        'https://fonts.gstatic.com',
        'https://www.google-analytics.com',
        'https://www.googletagmanager.com'
      ];

      domains.forEach(domain => {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      });
    };

    // Attendre que la page soit entièrement chargée avant de charger les scripts tiers
    const initializeThirdPartyScripts = () => {
      // Précharger les domaines
      preloadCriticalDomains();
      
      // Charger Google Analytics après un délai pour ne pas impacter le rendu initial
      setTimeout(() => {
        if (process.env.NODE_ENV === 'production') {
          loadGoogleAnalytics();
        }
      }, 2000);
    };

    // Démarrer le processus de chargement selon l'état de la page
    if (document.readyState === 'complete') {
      initializeThirdPartyScripts();
    } else {
      window.addEventListener('load', initializeThirdPartyScripts);
    }

    // Nettoyage
    return () => {
      window.removeEventListener('load', initializeThirdPartyScripts);
    };
  }, []);

  // Ce composant ne rend rien visuellement
  return null;
};

export default ThirdPartyScripts;
