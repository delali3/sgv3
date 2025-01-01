// src/services/api/appointment.service.ts
import { authApi } from './config';
import type { AxiosResponse } from 'axios';
import type { Doctor, TimeSlot, Appointment } from '../../types/appointment';

export const appointmentService = {
  // Get all doctors
  getDoctors: async (): Promise<AxiosResponse<Doctor[]>> => {
    return authApi.get('/patient/appointments/doctors');
  },

  // Get available time slots for a specific doctor on a specific date
  getAvailableSlots: async (doctorId: string, date: string): Promise<AxiosResponse<TimeSlot[]>> => {
    return authApi.get(`/patient/appointments/doctors/${doctorId}/slots`, {
      params: { date }
    });
  },

  // Get user's appointments
  getAppointments: async (): Promise<AxiosResponse<Appointment[]>> => {
    return authApi.get('/patient/appointments');
  },

  // Schedule new appointment
  scheduleAppointment: async (data: {
    doctorId: string;
    dateTime: string;
    notes?: string;
  }): Promise<AxiosResponse<Appointment>> => {
    return authApi.post('/patient/appointments', data);
  },

  // Cancel appointment
  cancelAppointment: async (appointmentId: string): Promise<AxiosResponse<void>> => {
    return authApi.put(`/patient/appointments/${appointmentId}/cancel`);
  },

  // Reschedule appointment
  rescheduleAppointment: async (
    appointmentId: string,
    newDateTime: string
  ): Promise<AxiosResponse<Appointment>> => {
    return authApi.put(`/patient/appointments/${appointmentId}/reschedule`, {
      dateTime: newDateTime
    });
  }
};
