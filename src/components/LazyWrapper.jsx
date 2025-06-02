import { Suspense } from 'react';
import { Spinner, Alert } from 'react-bootstrap';

/**
 * Composant wrapper pour le lazy loading optimisé avec gestion d'erreur
 */
const LazyWrapper = ({ 
  children, 
  fallback = null, 
  errorMessage = "Une erreur est survenue lors du chargement de cette section."
}) => {
  const defaultFallback = (
    <div className="d-flex justify-content-center align-items-center py-5 min-vh-50">
      <div className="text-center">
        <Spinner 
          animation="border" 
          variant="primary" 
          role="status"
          className="mb-3"
        >
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
        <p className="text-muted mb-0">Chargement en cours...</p>
      </div>
    </div>
  );

  return (
    <Suspense fallback={fallback || defaultFallback}>
      {children}
    </Suspense>
  );
};

/**
 * Composant d'erreur pour les lazy components
 */
export const LazyErrorBoundary = ({ children, fallback }) => {
  return (
    <div className="lazy-error-boundary">
      {children}
    </div>
  );
};

/**
 * HOC pour wraper automatiquement les composants lazy avec une gestion d'erreur
 */
export const withLazyLoading = (LazyComponent, options = {}) => {
  const WrappedComponent = (props) => (
    <LazyWrapper 
      fallback={options.fallback}
      errorMessage={options.errorMessage}
    >
      <LazyComponent {...props} />
    </LazyWrapper>
  );

  WrappedComponent.displayName = `withLazyLoading(${LazyComponent.displayName || LazyComponent.name})`;
  
  return WrappedComponent;
};

export default LazyWrapper;
