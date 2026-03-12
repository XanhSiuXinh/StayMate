import { createApiUrl } from '../config/api';

export const apiRequest = async (endpoint, options = {}) => {
  const url = createApiUrl(endpoint);
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
};

export const authApiRequest = (endpoint, options = {}) => {
  const token = localStorage.getItem('authToken');
  return apiRequest(endpoint, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
};
