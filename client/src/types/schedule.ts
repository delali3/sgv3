// types/schedule.ts
import type { Dayjs } from 'dayjs';

export interface Appointment {
  id: string;
  patientName: string;
  patientId: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes?: string;
  phone?: string;
}

export type AppointmentType = 'checkup' | 'followup' | 'consultation' | 'emergency';
export type AppointmentStatus = 'scheduled' | 'completed' | 'cancelled';

export interface AppointmentTypeConfig {
  value: AppointmentType;
  label: string;
  color: string;
}

export interface ScheduleFormValues {
  patientName: string;
  patientId: string;
  date: Dayjs;
  time: Dayjs;
  type: AppointmentType;
  notes?: string;
  phone?: string;
}

export interface DateAppointments {
  [date: string]: Appointment[];
}