// src/services/api/index.ts

import { 
  authApi, 
  doctorApi, 
  patientApi, 
  clearAuthToken,
  isAuthenticated,
  setAuthToken
} from './config';

// Export all service instances
export {
    setAuthToken,
    authApi,
    doctorApi,
    patientApi,
    isAuthenticated,
    clearAuthToken,
    defaultConfig
  } from './config';
  
  // Auth Service Types
  export interface RegisterUserData {
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
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      email: string;
      firstName: string;
      lastName: string;
      role: 'patient' | 'doctor';
    };
  }
  
//   // Auth Service
  export const auth = {
    register: async (userData: RegisterUserData): Promise<AuthResponse> => {
      const { data } = await authApi.post('/register', userData);
      return data;
    },
  
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
      const { data } = await authApi.post('/login', credentials);
      return data;
    },
  
    logout: async (): Promise<void> => {
      await authApi.post('/logout');
      clearAuthToken();
    },
  
    forgotPassword: async (email: string): Promise<{ message: string }> => {
      const { data } = await authApi.post('/forgot-password', { email });
      return data;
    },
  
    resetPassword: async (token: string, newPassword: string): Promise<{ message: string }> => {
      const { data } = await authApi.post('/reset-password', { token, newPassword });
      return data;
    }
  };
  
//   // Doctor Service Types
  export interface DoctorProfile {
    id: string;
    userId: string;
    specialization: string;
    licenseNumber: string;
    availability?: {
      days: string[];
      hours: string[];
    };
  }
  
//   // Doctor Service
  export const doctor = {
    getProfile: async (doctorId: string): Promise<DoctorProfile> => {
      const { data } = await doctorApi.get(`/doctors/${doctorId}`);
      return data;
    },
  
    updateProfile: async (doctorId: string, profileData: Partial<DoctorProfile>): Promise<DoctorProfile> => {
      const { data } = await doctorApi.put(`/doctors/${doctorId}`, profileData);
      return data;
    },
  
    getAppointments: async (doctorId: string) => {
      const { data } = await doctorApi.get(`/doctors/${doctorId}/appointments`);
      return data;
    }
  };
  
  // Patient Service Types
  export interface PatientProfile {
    id: string;
    userId: string;
    medicalHistory?: string;
    allergies?: string[];
  }
  
  // Patient Service
  export const patient = {
    getProfile: async (patientId: string): Promise<PatientProfile> => {
      const { data } = await patientApi.get(`/patient/${patientId}`);
      return data;
    },
  
    updateProfile: async (patientId: string, profileData: Partial<PatientProfile>): Promise<PatientProfile> => {
      const { data } = await patientApi.put(`/patient/${patientId}`, profileData);
      return data;
    },
  
    bookAppointment: async (appointmentData: {
      doctorId: string;
      dateTime: string;
      reason: string;
    }) => {
      const { data } = await patientApi.post('/patient/appointments', appointmentData);
      return data;
    }
  };
  
  // Export all services
  export const api = {
    auth,
    doctor,
    patient,
    setAuthToken,
    clearAuthToken,
    isAuthenticated
  };
  
  export default api;