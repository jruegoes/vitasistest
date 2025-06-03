import axios from 'axios';
import { getValidToken } from './auth';

// Use proxy URL defined in vite.config.ts to avoid CORS issues
const client = axios.create({
  baseURL: '/api',
});

// Add a request interceptor to automatically add the token
client.interceptors.request.use(async (config) => {
  try {
    const token = await getValidToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    return Promise.reject(error);
  }
});

export default client;