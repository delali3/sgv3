// src/services/patient.service.ts
import { authApi } from './config';
import type { AxiosResponse } from 'axios';
import type { MedicalHistoryItem, Medication } from '../../types/patient';

// Types
export interface PatientProfileData {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    gender: 'male' | 'female' | 'other';
    dateOfBirth: string;
    role: string;
    address: string;
    profileImage?: any;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
  profile: {
    id: string;
    allergies: string[];
    medicalHistory: MedicalHistoryItem[];
    currentMedications: Medication[];
    createdAt: string;
    updatedAt: string;
  };
}

export interface UpdatePatientProfileData {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  allergies?: string[];
}

export const patientService = {
  // Get authenticated user's profile
  getProfile: async (): Promise<AxiosResponse<PatientProfileData>> => {
    return authApi.get('/patient/profile');
  },

  // Update authenticated user's profile
  updateProfile: async (
    data: UpdatePatientProfileData
  ): Promise<AxiosResponse<PatientProfileData>> => {
    return authApi.put('/patient/profile', data);
  },

  // Update authenticated user's profile image
  // In your patientService
updateProfileImage: async (file: File): Promise<AxiosResponse<{ profileImage: string }>> => {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    return authApi.put('/patient/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  },

  // Get authenticated user's medical history
  getMedicalHistory: async (): Promise<AxiosResponse<{ medicalHistory: MedicalHistoryItem[] }>> => {
    return authApi.get('/patient/profile/medical-history');
  },

  // Get authenticated user's current medications
  getCurrentMedications: async (): Promise<AxiosResponse<{ medications: Medication[] }>> => {
    return authApi.get('/patient/profile/medications');
  },

  // Update authenticated user's allergies
  updateAllergies: async (
    allergies: string[]
  ): Promise<AxiosResponse<{ allergies: string[] }>> => {
    return authApi.put('/patient/profile/allergies', { allergies });
  },

  // Add medical history item
  addMedicalHistoryItem: async (
    item: Omit<MedicalHistoryItem, 'id'>
  ): Promise<AxiosResponse<{ medicalHistory: MedicalHistoryItem[] }>> => {
    return authApi.post('/patient/profile/medical-history', item);
  },

  // Add medication
  addMedication: async (
    medication: Omit<Medication, 'id'>
  ): Promise<AxiosResponse<{ medications: Medication[] }>> => {
    return authApi.post('/patient/profile/medications', medication);
  },

  // Remove medication
  removeMedication: async (
    medicationId: string
  ): Promise<AxiosResponse<{ medications: Medication[] }>> => {
    return authApi.delete(`/profile/medications/${medicationId}`);
  }
};

export default patientService;