// services/api/doctor.service.ts
import { authApi } from './config';
import type { AxiosResponse } from 'axios';
import type {
  Appointment,
  DoctorAvailabilitySchedule,
  AppointmentStatus,
  TimeSlot,
} from '../../types/doctor';
import type { DoctorProfile, MedicalRecord } from '../../types/medicalRecords';
import { ApiResponse } from '../../types/api';
// import type { DoctorProfile } from '../../types/profile';

export const doctorService = {
  // Get all appointments

  getAppointments: async (): Promise<AxiosResponse<ApiResponse<Appointment[]>>> => {
    return authApi.get('/doctor/appointments');
  },

  getAppointmentsByDate: async (date: string): Promise<AxiosResponse<ApiResponse<Appointment[]>>> => {
    return authApi.get(`/doctor/appointments/${date}`);
  },

  getAvailableSlots: async (date: string): Promise<AxiosResponse<ApiResponse<TimeSlot[]>>> => {
    return authApi.get(`/doctor/slots`, {
      params: { date }
    });
  },

  // In doctorService
  getVacationDays: async (): Promise<AxiosResponse<{
    data: Array<{
      id: string;
      dates: string[];
      created_at: string;
    }>;
  }>> => {
    return authApi.get('/doctor/vacation');
  },

  deleteVacationDays: async (id: string): Promise<AxiosResponse<void>> => {
    return authApi.delete(`/doctor/vacation/${id}`);
  },

  // Get patient history
  getPatientHistory: async (patientId: string): Promise<AxiosResponse<MedicalRecord[]>> => {
    return authApi.get<MedicalRecord[]>(`/doctor/patients/${patientId}/history`);
  },

  // Save consultation notes
  saveConsultationNotes: async (appointmentId: string, notes: {
    diagnosis: string;
    prescription: string;
    additionalNotes: string;
    followUpDate?: string;
    meetingLink?: string;
  }) => {
    return authApi.post(`/doctor/appointments/${appointmentId}/notes`, notes);
  },

  saveSymptoms: async (consultationId: string, data: {
    symptoms: string[];
  }) => {
    return authApi.post(`/doctor/consultations/${consultationId}/symptoms`, data);
  },
  getDoctorAvailability: async (): Promise<AxiosResponse<{
    data: Array<{
      day_of_week: string;
      start_time: string;
      end_time: string;
      is_available: boolean;
    }>;
  }>> => {
    return authApi.get('/doctor/availability');
  },

  // Update availability
  updateAvailability: async (availability: DoctorAvailabilitySchedule[]): Promise<AxiosResponse<void>> => {
    return authApi.put('/doctor/availability', {
      availability
    });
  },

  // Block time slot
  blockTimeSlot: async (date: string, time: string): Promise<AxiosResponse<void>> => {
    return authApi.post<void>(`/doctor/slots/block`, {
      date,
      time
    });
  },

  // Get doctor profile
  getDoctorProfile: async (): Promise<AxiosResponse<DoctorProfile>> => {
    return authApi.get<DoctorProfile>(`/doctor/profile`);
  },

  // Set vacation days
  setVacationDays: async (dates: string[]): Promise<AxiosResponse<void>> => {
    return authApi.post<void>(`/doctor/vacation`, { dates });
  },

  // Update appointment status
  updateAppointmentStatus: async (
    appointmentId: string,
    status: AppointmentStatus
  ): Promise<AxiosResponse<void>> => {
    return authApi.put<void>(
      `/doctor/appointments/${appointmentId}/status`,
      { status }
    );
  }
};

export default doctorService;