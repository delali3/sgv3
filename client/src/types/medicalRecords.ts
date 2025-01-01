// types/doctor.ts
export interface DoctorAvailabilitySchedule {
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface TimeSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
  appointment?: Appointment;
}

export type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

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
  notes?: string;
}

export interface ConsultationNotes {
  symptoms: string[];
  diagnosis: string;
  prescription: string;
  additionalNotes: string;
  followUpDate?: string;
}

// types/medicalRecords.ts
export interface MedicalRecord {
  id: string;
  category?: string,
  title?: string,
  description?: string,
  status?: string,
  facility?: string,
  date?: string;
  diagnosis?: string;
  result?: string;
  treatment?: string;
  doctorName?: string;
  notes?: string;
}

// types/profile.ts
export interface DoctorProfile {
  id: string;
  name: string;
  email: string;
  specialization: string;
  qualifications: string[];
  experience: number;
  avatar?: string;
  schedule?: DoctorAvailabilitySchedule[];
}