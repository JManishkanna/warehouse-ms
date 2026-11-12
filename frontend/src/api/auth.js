import api from './axios';
import { handleMockRequest } from './mockData';

export const loginApi = async (credentials) => {
  try {
    const res = await api.post('/auth/login', credentials);
    if (res && res.data && res.data.data) {
      return res;
    }
  } catch (_) {
    // If backend is offline or proxy errors, fall back to demo authenticator immediately
  }
  return handleMockRequest('/auth/login', 'post', credentials);
};

export const registerApi = async (userData) => {
  try {
    const res = await api.post('/auth/register', userData);
    if (res && res.data) return res;
  } catch (_) {}
  return handleMockRequest('/auth/register', 'post', userData);
};
