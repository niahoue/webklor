import { ERROR_MESSAGES } from '../utils/constants';
import API_BASE_URL from '../utils/apiConfig'; 

/**
 * Gestion centralisée des erreurs API
 */
const handleApiError = (response, defaultMessage) => {
  switch (response.status) {
    case 401:
      throw new Error(ERROR_MESSAGES.UNAUTHORIZED);
    case 403:
      throw new Error(ERROR_MESSAGES.FORBIDDEN);
    case 404:
      throw new Error(ERROR_MESSAGES.NOT_FOUND);
    case 422:
      throw new Error(ERROR_MESSAGES.VALIDATION_ERROR);
    case 500:
    case 502:
    case 503:
      throw new Error(ERROR_MESSAGES.SERVER_ERROR);
    default:
      throw new Error(defaultMessage || ERROR_MESSAGES.GENERIC_ERROR);
  }
};

/**
 * Configuration par défaut pour les requêtes
 */
const defaultHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Helper générique pour les requêtes API
 * @param {string} url - L'URL de l'API (peut être relative ou absolue)
 * @param {Object} options - Options de la requête fetch
 * @returns {Promise<Object>} La réponse JSON de l'API
 * @throws {Error} En cas d'erreur API ou de réseau
 */
export const apiRequest = async (url, options = {}) => {
 
  const fullUrl = url.startsWith('http') ? url : `${API_BASE_URL}${url}`; 
  try {
    const response = await fetch(fullUrl, { 
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      // Si la réponse n'est pas OK (status 2xx), gérer l'erreur
      handleApiError(response, `Erreur HTTP ${response.status}`);
    
    }

    // Gestion spéciale pour les réponses vides (ex: 204 No Content pour DELETE)
    // ou si le Content-Type n'est pas JSON
    if (response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) {
      return { success: true }; // Retourne un objet de succès pour les requêtes sans corps de réponse JSON
    }

    // Tenter de parser la réponse JSON
    return await response.json();
  } catch (error) {
    // Gérer spécifiquement les erreurs réseau (ex: serveur injoignable, CORS bloqué avant réponse)
    if (error.name === 'TypeError') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    // Rejeter l'erreur si elle a déjà été traitée par handleApiError ou si c'est une autre erreur inattendue
    throw error;
  }
};

/**
 * Fonctions utilitaires pour les différents types de requêtes HTTP
 */

export const apiDelete = async (url, options = {}) => {
  return apiRequest(url, {
    method: 'DELETE',
    ...options
  });
};

export const apiGet = async (url, options = {}) => {
  return apiRequest(url, {
    method: 'GET',
    ...options
  });
};

export const apiPost = async (url, data, options = {}) => {
  return apiRequest(url, {
    method: 'POST',
    body: JSON.stringify(data),
    ...options
  });
};

export const apiPut = async (url, data, options = {}) => {
  return apiRequest(url, {
    method: 'PUT',
    body: JSON.stringify(data),
    ...options
  });
};

export const apiPatch = async (url, data, options = {}) => {
  return apiRequest(url, {
    method: 'PATCH',
    body: JSON.stringify(data),
    ...options
  });
};