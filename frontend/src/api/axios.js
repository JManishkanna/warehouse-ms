import axios from 'axios';
import { handleMockRequest } from './mockData';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 800,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    // If backend server is offline, connection refused, or proxy fails (5xx / 403 / 404), seamlessly failover to mock data store
    const isOfflineOrUnreachable =
      !error.response ||
      error.code === 'ERR_NETWORK' ||
      error.code === 'ECONNABORTED' ||
      status >= 500 ||
      status === 403 ||
      status === 404;

    if (isOfflineOrUnreachable && error.config) {
      try {
        const method = (error.config.method || 'get').toLowerCase();
        let bodyData = null;
        if (error.config.data) {
          try {
            bodyData = typeof error.config.data === 'string' ? JSON.parse(error.config.data) : error.config.data;
          } catch (_) {
            bodyData = error.config.data;
          }
        }
        const mockRes = handleMockRequest(error.config.url, method, bodyData, error.config.params);
        return Promise.resolve(mockRes);
      } catch (mockErr) {
        return Promise.reject(mockErr);
      }
    }

    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
