import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiError } from '@/types';

const baseURL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export const axiosInstance = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - attach auth token
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const { status } = error.response;
      
      // Handle 401 - Unauthorized (logout user)
      if (status === 401) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
      
      // Handle other errors
      const apiError: ApiError = {
        message: error.response.data?.message || 'An error occurred',
        status: status,
        errors: error.response.data?.errors,
      };
      
      return Promise.reject(apiError);
    }
    
    // Network error or no response
    const networkError: ApiError = {
      message: 'Network error. Please check your connection.',
      status: 0,
    };
    
    return Promise.reject(networkError);
  }
);

export default axiosInstance;

