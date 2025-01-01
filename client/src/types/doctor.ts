export interface DoctorAvailabilitySchedule {
  dayOfWeek: string;
  startTime: string | null;
  endTime: string | null;
  isAvailable: boolean;
}

export interface DoctorAvailabilityDB {
  id: string;
  doctor_id: string;
  day_of_week: string;
  start_time: string | null;
  end_time: string | null;
  is_available: boolean;
  created_at: string;
  updated_at?: string;
}


export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientImage?: string;
  dateTime: string;
  status: AppointmentStatus;
  priority: 'normal' | 'urgent';
  type: string;
  symptoms?: string[];
  followUpDuration?: string;
  meetingLink?: string;
  notes?: string;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

export interface VideoCallState {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
}

export interface ConfirmAction {
  message: string;
  okText: string;
  isDangerous: boolean;
  onConfirm: () => void;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointment?: Appointment;
}

export interface ConsultationNotes {
  symptoms: string[];
  diagnosis: string;
  prescription: string;
  additionalNotes?: string;
  followUpDate?: string;
  followUpDuration?: string;
  meetingLink?: string;
}

export interface LoadingState {
  appointments: boolean;
  patientHistory: boolean;
  notes: boolean;
}
