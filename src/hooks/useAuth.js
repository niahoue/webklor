import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

/**
 * Hook personnalisé pour l'authentification
 * Centralise la logique d'auth et améliore la réutilisabilité
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }

  const { user, login, logout, isAuthenticated, loading } = context;

  /**
   * Obtient l'en-tête d'autorisation pour les requêtes API
   */
  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  };

  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   */
  const hasRole = (role) => {
    return user?.role === role;
  };

  /**
   * Vérifie si l'utilisateur est admin
   */
  const isAdmin = () => {
    return hasRole('admin');
  };

  /**
   * Déconnecte l'utilisateur et nettoie le localStorage
   */
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    logout();
  };

  return {
    user,
    login,
    logout: handleLogout,
    isAuthenticated,
    loading,
    getAuthHeader,
    hasRole,
    isAdmin
  };
};
