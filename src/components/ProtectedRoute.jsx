import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spinner } from 'react-bootstrap';

/**
 * Composant de route protégée par authentification
 * Redirige vers la page de connexion si l'utilisateur n'est pas authentifié
 * @param {Object} props - Propriétés du composant 
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { isAuthenticated, loading, currentUser } = useAuth();
  
  // Afficher un spinner pendant le chargement
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  
  // Vérifier si l'utilisateur est authentifié
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  // Vérifier si les rôles sont spécifiés et si l'utilisateur a le rôle requis
  if (allowedRoles.length > 0) {
    const hasRequiredRole = allowedRoles.includes(currentUser?.role);
    
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }
  
  // Si l'utilisateur est authentifié et a les rôles nécessaires
  // Soit renvoyer les enfants directs, soit utiliser Outlet pour les routes imbriquées
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
