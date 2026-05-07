import axios from 'axios';

const api = axios.create({
  baseURL: '/forest_access/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor: agrega el token a cada petición automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor: si el backend responde 401, redirige a login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
