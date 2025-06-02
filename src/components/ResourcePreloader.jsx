import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';

/**
 * Composant pour précharger les ressources critiques
 * Améliore les performances en préchargeant les assets importants
 */
const ResourcePreloader = () => {
  useEffect(() => {
    // Précharger les images critiques
    const criticalImages = [
      '/assets/images/1000059598.png', // Image hero
      '/assets/images/devop.png',      // Image services
      '/assets/images/1000061493.png'  // Image maintenance
    ];

    criticalImages.forEach(src => {
      // Créer une nouvelle image pour forcer le préchargement
      const img = new Image();
      img.src = src;
      
      // Aussi essayer les versions WebP
      const webpImg = new Image();
      webpImg.src = src.replace(/\.(png|jpg|jpeg)$/i, '.webp');
    });

    // Précharger les polices importantes
    const fonts = [
      {
        family: 'Montserrat',
        weights: ['400', '500', '600', '700']
      }
    ];

    fonts.forEach(font => {
      font.weights.forEach(weight => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'font';
        link.type = 'font/woff2';
        link.crossOrigin = 'anonymous';
        link.href = `https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459W1hyyTh89ZNpQ.woff2`;
        document.head.appendChild(link);
      });
    });
  }, []);

  return (
    <Helmet>
      {/* Préchargement des ressources critiques */}
      <link
        rel="preload"
        href="/assets/images/1000059598.webp"
        as="image"
        type="image/webp"
      />
      <link
        rel="preload"
        href="/assets/images/1000059598.png"
        as="image"
        type="image/png"
      />
      
      {/* Préchargement des styles critiques */}
      <link
        rel="preload"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&family=Pacifico&display=swap"
        as="style"
      />
      
      {/* DNS prefetch pour les domaines externes */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.googletagmanager.com" />
      <link rel="dns-prefetch" href="//pagead2.googlesyndication.com" />
      
      {/* Preconnect pour les domaines critiques */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Resource hints pour les performances */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      {/* Optimisation du cache */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000" />
      
      {/* Optimisation de la compression */}
      <meta httpEquiv="Content-Encoding" content="gzip" />
    </Helmet>
  );
};

export default ResourcePreloader;
