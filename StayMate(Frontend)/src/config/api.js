const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5015',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/auth/login',
      REGISTER: '/api/auth/register',
      GOOGLE: '/api/auth/google'
    },
    USERS: {
      PROFILE: '/api/users/profile',
      AVATAR: '/api/users/profile/avatar',
      PHOTOS: '/api/users/photos',
      CHANGE_PASSWORD: '/api/users/change-password',
      DELETE_ACCOUNT: '/api/users/account'
    },
    ROOMS: {
      LIST: '/api/rooms',
      DETAIL: (id) => `/api/rooms/${id}`,
      CREATE: '/api/rooms',
      UPDATE: (id) => `/api/rooms/${id}`,
      DELETE: (id) => `/api/rooms/${id}`
    },
    DISCOVER: '/api/discover',
    MESSAGES: '/api/messages',
    PREFERENCES: '/api/preferences',
    PAYMENTS: '/api/payments'
  }
};

export const createApiUrl = (endpoint) => `${API_CONFIG.BASE_URL}${endpoint}`;
export default API_CONFIG;
