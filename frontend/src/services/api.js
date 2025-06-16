import axios from 'axios';
import {
  getUserToken,
  getSellerToken,
  getAdminToken,
} from '../utils/auth';

const api = axios.create({
  baseURL: 'http://localhost:8070',
});

api.interceptors.request.use((config) => {
  const url = config.url || '';

  // Don't attach token to login or register routes
  const isAuthRoute =
    url.includes('/login') || url.includes('/register');

  if (isAuthRoute) {
    return config;
  }

  let token;

  if (url.startsWith('/admin')) {
    token = getAdminToken();
    console.log('🔐 Admin token attached:', token);
  } else if (url.startsWith('/seller')) {
    token = getSellerToken();
    console.log('🔐 Seller token attached:', token);
  } else {
    token = getUserToken();
    console.log('🔐 User token attached:', token);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

export default api;
