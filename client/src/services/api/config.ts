// src/services/api/config.ts
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { message } from 'antd';

// Define interface for service URLs
interface ServiceURLs {
  auth: string;
  doctor: string;
  patient: string;
}

// Service URLs from environment variables
const SERVICE_URLS: ServiceURLs = {
  auth: import.meta.env.VITE_AUTH_SERVICE_URL || 'http://localhost:3001',
  doctor: import.meta.env.VITE_DOCTOR_SERVICE_URL || 'http://localhost:3002',
  patient: import.meta.env.VITE_PATIENT_SERVICE_URL || 'http://localhost:3003',
};

// Create axios instances for each service
export const authApi: AxiosInstance = axios.create({
  baseURL: SERVICE_URLS.auth,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

export const doctorApi: AxiosInstance = axios.create({
  baseURL: SERVICE_URLS.doctor,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
export const patientApi: AxiosInstance = axios.create({
  baseURL: SERVICE_URLS.patient,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});
// Request interceptor for adding auth token
const requestInterceptor = (config: InternalAxiosRequestConfig) => {
  try {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error('Error in request interceptor:', error);
    return config;
  }
};
// Error handler for response interceptor
const errorHandler = (error: AxiosError) => {
  if (error.response) {
    const status = error.response.status;
    const data = error.response.data as any;
    switch (status) {
      case 401:
        // Handle unauthorized access
        localStorage.removeItem('token');
        window.location.href = '/login';
        message.error('Session expired. Please login again.');
        break;
      case 403:
        message.error('You do not have permission to perform this action');
        break;
      case 404:
        message.error('Resource not found');
        break;
      case 422:
        message.error(data.error || 'Validation error');
        break;
      case 500:
        message.error('Internal server error. Please try again later.');
        break;
      default:
        message.error(data.error || 'Something went wrong');
    }
  } else if (error.request) {
    // The request was made but no response was received
    message.error('No response from server. Please try again later.');
  } else {
    // Something happened in setting up the request
    message.error('An error occurred. Please try again.');
  }

  return Promise.reject(error);
};

// Apply interceptors to all service APIs
[authApi, doctorApi, patientApi].forEach(api => {
  api.interceptors.request.use(requestInterceptor, Promise.reject);
  api.interceptors.response.use(
    response => response,
    errorHandler
  );
});
// Helper function to check if the token exists and is valid
export const isAuthenticated = (): boolean => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    // Check token expiration if you're using JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return expiry > Date.now();
  } catch (error) {
    console.error('Error checking authentication:', error);
    return false;
  }
};
// Export a function to set the auth token
export const setAuthToken = (token: string): void => {
  try {
    localStorage.setItem('token', token);
  } catch (error) {
    console.error('Error setting auth token:', error);
  }
};
// Export a function to clear the auth token
export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};
// Export default configuration that can be used across services
export const defaultConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
};