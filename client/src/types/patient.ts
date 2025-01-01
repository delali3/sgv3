// src/types/patient.ts

// Base types for medical-related data
export interface MedicalHistoryItem {
  id: string;
  date: string;
  condition: string;
  doctor: string;
  status: 'Resolved' | 'Ongoing' | 'Completed';
  notes?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate?: string;
  endDate?: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface Appointment {
  id: string;
  doctorName: string;
  specialization: string;
  dateTime: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

export interface Consultation {
  id: string;
  date: string;
  summary: string;
  doctorName: string;
  symptoms: string[];
}

// Profile and Medical Information
export interface PatientProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PatientMedicalInfo {
  allergies: string[];
  bloodType?: string;
  medicalHistory: MedicalHistoryItem[];
  currentMedications: Medication[];
  emergencyContact?: EmergencyContact;
}

// Statistics
export interface PatientStats {
  totalAppointments: number;
  upcomingAppointments: number;
  completedConsultations: number;
}

// Combined types for API responses
export interface PatientProfileResponse {
  profile: PatientProfile;
  medicalInfo: PatientMedicalInfo;
  stats?: PatientStats;
}

// Request types for updates
export interface UpdatePatientProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
}

export interface UpdateMedicalInfoRequest {
  allergies?: string[];
  bloodType?: string;
  currentMedications?: Medication[];
  emergencyContact?: EmergencyContact;
}

export interface AddMedicalHistoryRequest {
  condition: string;
  doctor: string;
  date: string;
  status: 'Resolved' | 'Ongoing' | 'Completed';
  notes?: string;
}