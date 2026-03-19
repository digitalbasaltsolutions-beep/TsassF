import axios from 'axios';
import { useAuthStore } from '@/store/authStore';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
});

// Request interceptor to add the auth token header to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh / logout
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    // Handle 401 scenarios
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      // Logout completely on unauthorized for now.
      // E.g. Refresh token flow logic goes here.
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default apiClient;
