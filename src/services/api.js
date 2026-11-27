import axios from 'axios';
import { getStoredAuth } from '../utils/storage';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
    || import.meta.env.VITE_API_BASE_URL
    || 'https://minestore-back.onrender.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const session = getStoredAuth();
  if (session?.token) {
    config.headers.Authorization = `Bearer ${session.token}`;
  }
  return config;
});

export default api;