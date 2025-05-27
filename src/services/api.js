import { ERROR_MESSAGES } from '../utils/constants';

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
 */
const apiRequest = async (url, options = {}) => {
  try {
    const response = await fetch(url, {
      headers: defaultHeaders,
      ...options,
      headers: {
        ...defaultHeaders,
        ...(options.headers || {})
      }
    });

    if (!response.ok) {
      handleApiError(response);
    }

    // Gestion spéciale pour les réponses vides (DELETE)
    if (response.status === 204 || !response.headers.get('content-type')?.includes('application/json')) {
      return { success: true };
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

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
