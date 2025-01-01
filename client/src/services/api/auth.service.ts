// src/services/api/auth.service.ts
import { authApi } from './config';
import type { AxiosResponse } from 'axios';

// Types for Auth Service
interface RegisterUserData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  password: string;
  role: 'patient' | 'doctor';
  specialization?: string;
  licenseNumber?: string;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
  };
}

export const authService = {
  register: async (userData: RegisterUserData): Promise<AxiosResponse<AuthResponse>> => {
    return authApi.post('/register', userData);
  },

  login: async (credentials: LoginCredentials): Promise<AxiosResponse<AuthResponse>> => {
    return authApi.post('/login', credentials);
  },

  forgotPassword: async (email: string): Promise<AxiosResponse<{ message: string }>> => {
    return authApi.post('/forgot-password', { email });
  },

  resetPassword: async (token: string, newPassword: string): Promise<AxiosResponse<{ message: string }>> => {
    return authApi.post('/reset-password', { token, newPassword });
  },

  verifyEmail: async (token: string): Promise<AxiosResponse<{ message: string }>> => {
    return authApi.post('/verify-email', { token });
  },

  refreshToken: async (): Promise<AxiosResponse<{ token: string }>> => {
    return authApi.post('/refresh-token');
  },

  logout: async (): Promise<AxiosResponse<{ message: string }>> => {
    return authApi.post('/logout');
  }
};

export type { RegisterUserData, LoginCredentials, AuthResponse };