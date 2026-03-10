import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT token from localStorage to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cyber-risk-token');
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auto-logout on 401 (expired or invalid token)
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('cyber-risk-token');
      localStorage.removeItem('cyber-risk-user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

