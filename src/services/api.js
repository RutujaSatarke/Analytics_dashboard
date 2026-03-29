import axios from 'axios';

const DEFAULT_API_BASE_URL = 'https://analytics-backend-3f79.onrender.com/api';
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || DEFAULT_API_BASE_URL;
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT) || 10000;
const TOKEN_KEY = process.env.REACT_APP_JWT_TOKEN_KEY || 'access_token';
const REFRESH_TOKEN_KEY = process.env.REACT_APP_REFRESH_TOKEN_KEY || 'refresh_token';

if (!process.env.REACT_APP_API_BASE_URL) {
  console.warn(
    `[API] REACT_APP_API_BASE_URL is not set. Using fallback: ${API_BASE_URL}`
  );
}

/**
 * Create Axios instance with default config
 */
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request Interceptor - Add JWT token to headers
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor - Handle token refresh
 */
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        const response = await axios.post(
          `${API_BASE_URL}/token/refresh/`,
          { refresh: refreshToken }
        );

        const newAccessToken = response.data.access;
        localStorage.setItem(TOKEN_KEY, newAccessToken);
        axiosInstance.defaults.headers.Authorization = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - redirect to login
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(REFRESH_TOKEN_KEY);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Authentication API calls
 */
export const authAPI = {
  register: (userData) =>
    axiosInstance.post('/auth/register/', userData),
  
  login: (username, password) =>
    axiosInstance.post('/auth/login/', { username, password }),
  
  logout: (refreshToken) =>
    axiosInstance.post('/auth/logout/', { refresh: refreshToken }),
  
  getCurrentUser: () =>
    axiosInstance.get('/auth/me/'),
};

/**
 * Tracking API calls
 */
export const trackingAPI = {
  trackFeature: (featureName) =>
    axiosInstance.post('/tracking/track/', { feature_name: featureName }),
  
  getMyClicks: (limit = 50) =>
    axiosInstance.get('/tracking/my_clicks/', { params: { limit } }),
};

/**
 * Analytics API calls
 */
export const analyticsAPI = {
  getAnalytics: (filters = {}) =>
    axiosInstance.get('/analytics/analytics/', { params: filters }),
  
  getFeatures: () =>
    axiosInstance.get('/analytics/features/'),
  
  getHealth: () =>
    axiosInstance.get('/analytics/health/'),
};

/**
 * Helper function to store tokens
 */
export const storeTokens = (accessToken, refreshToken) => {
  localStorage.setItem(TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
};

/**
 * Helper function to clear tokens
 */
export const clearTokens = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

/**
 * Helper function to get access token
 */
export const getAccessToken = () => {
  return localStorage.getItem(TOKEN_KEY);
};

export default axiosInstance;