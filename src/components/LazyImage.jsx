import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * Composant d'image optimisée avec lazy loading et formats modernes
 * Améliore les performances et réduit le CLS
 */
const LazyImage = ({
  src,
  alt,
  className = '',
  style = {},
  width,
  height,
  placeholder = '/assets/images/placeholder.svg',
  sizes = '',
  loading = 'lazy',
  priority = false,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  // Observer pour détecter quand l'image entre dans le viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px' // Précharger 50px avant
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);
  // Génération des sources WebP et AVIF
  const getOptimizedSrc = (originalSrc, format) => {
    if (!originalSrc) return '';
    const ext = originalSrc.split('.').pop();
    return originalSrc.replace(`.${ext}`, `.${format}`);
  };

  // Vérifier si les formats optimisés existent (désactivé temporairement)
  const useOptimizedFormats = false;

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e) => {
    // Fallback vers l'image originale si WebP/AVIF ne fonctionnent pas
    if (e.target.src !== src) {
      e.target.src = src;
    }
  };

  return (
    <div 
      ref={imgRef}
      className={`lazy-image-container ${className}`}
      style={{
        position: 'relative',
        width: width || '100%',
        height: height || 'auto',
        ...style
      }}
    >
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className="image-placeholder"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6c757d'
          }}
        >
          <div className="spinner-border spinner-border-sm" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
        </div>
      )}      {/* Image optimisée */}
      {(isInView || priority) && (
        <motion.picture
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Sources optimisées - désactivées temporairement car les fichiers WebP/AVIF n'existent pas */}
          {useOptimizedFormats && (
            <>
              {/* Source AVIF (plus moderne) */}
              <source 
                srcSet={getOptimizedSrc(src, 'avif')} 
                type="image/avif"
                sizes={sizes}
              />
              
              {/* Source WebP (largement supporté) */}
              <source 
                srcSet={getOptimizedSrc(src, 'webp')} 
                type="image/webp"
                sizes={sizes}
              />
            </>
          )}
          
          {/* Image originale en fallback */}
          <img
            src={src}
            alt={alt}
            width={width}
            height={height}
            loading={priority ? 'eager' : loading}
            onLoad={handleLoad}
            onError={handleError}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
            {...props}
          />
        </motion.picture>
      )}
    </div>
  );
};

LazyImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  style: PropTypes.object,
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  placeholder: PropTypes.string,
  sizes: PropTypes.string,
  loading: PropTypes.oneOf(['lazy', 'eager']),
  priority: PropTypes.bool
};

export default LazyImage;
