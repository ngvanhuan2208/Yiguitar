import axios from 'axios';
import { normalizeUtf8 } from '@/utils/textEncoding';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
    Accept: 'application/json; charset=utf-8',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('yi-guitar-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    response.data = normalizeUtf8(response.data);
    return response;
  },
  (error) => {
    if (error.response?.data) {
      error.response.data = normalizeUtf8(error.response.data);
    }
    return Promise.reject(error);
  }
);

export default api;
