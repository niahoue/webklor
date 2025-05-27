import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

/**
 * Fournisseur de contexte d'authentification
 * Gère l'état de connexion et les opérations d'authentification
 */
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState(true);
    // Charger l'utilisateur depuis le token au démarrage
  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      
      try {
        const response = await fetch('/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.data);
        } else {
          // Token invalide ou expiré
          localStorage.removeItem('auth_token');
          setToken(null);
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadUser();
  }, [token]);
  
  /**
   * Connexion d'un utilisateur
   * @param {string} email - Email de l'utilisateur
   * @param {string} password - Mot de passe de l'utilisateur
   * @returns {Promise<boolean>} - Succès de la connexion
   */  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Échec de la connexion');
      }
      
      // Enregistrer le token et les données utilisateur
      localStorage.setItem('auth_token', data.token);
      setToken(data.token);
      setCurrentUser(data.data);
      
      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      throw error;
    }
  };
  
  /**
   * Déconnexion de l'utilisateur
   */  const logout = async () => {
    try {
      if (token) {
        await fetch('/api/auth/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      // Toujours supprimer le token et l'utilisateur, même en cas d'erreur
      localStorage.removeItem('auth_token');
      setToken(null);
      setCurrentUser(null);
    }
  };
  
  /**
   * Vérifier si l'utilisateur est connecté
   * @returns {boolean} - État de connexion
   */
  const isAuthenticated = () => {
    return !!token;
  };
  
  /**
   * Vérifier si l'utilisateur a un rôle spécifique
   * @param {string[]} roles - Rôles à vérifier
   * @returns {boolean} - Si l'utilisateur a un des rôles spécifiés
   */
  const hasRole = (roles) => {
    if (!currentUser) return false;
    return roles.includes(currentUser.role);
  };
  
  /**
   * Obtenir l'en-tête d'authentification pour les requêtes API
   * @returns {Object} - En-tête d'authentification
   */
  const getAuthHeader = () => {
    return {
      Authorization: `Bearer ${token}`
    };
  };
  
  const value = {
    currentUser,
    loading,
    login,
    logout,
    isAuthenticated,
    hasRole,
    getAuthHeader
  };
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Hook pour utiliser le contexte d'authentification
 * @returns {Object} - Contexte d'authentification
 */
export const useAuth = () => {
  return useContext(AuthContext);
};
