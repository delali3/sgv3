export interface Doctor {
    id: string;
    name: string;
    specialization: string;
    availability: {
      dayOfWeek: number;
      startTime: string;
      endTime: string;
    }[];
    consultationFee: number;
    profileImage?: string;
  }
  
  export interface TimeSlot {
    id: string;
    startTime: string;
    endTime: string;
    isAvailable: boolean;
    appointment?: {
      patientName: string;
      patientId: string;
    };
  }
  export interface Appointment {
    id: string;
    patientId: string;
    doctorId: string;
    doctorName: string;
    specialization: string;
    dateTime: string;
    status: 'upcoming' | 'completed' | 'cancelled';
    notes?: string;
    consultationFee: number;
  }
  