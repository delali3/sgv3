import { authApi } from './config';
import type { AxiosResponse } from 'axios';
import type {
  ConsultationMessage,
  MatchedDoctor,
  ConsultationSummary,
  BookingSlot,
  ConsultationSession
} from '../../types/consultation';

// Types for request parameters
interface SendMessageParams {
  content: string;
  sessionId: string;
}

// Helper function to transform doctor data
const transformDoctorData = (doctorData: any): MatchedDoctor => ({
  id: doctorData.id,
  name: doctorData.name || `Dr. ${doctorData.users?.first_name} ${doctorData.users?.last_name}`,
  specialization: doctorData.specialization,
  experience: doctorData.experience || 0,
  rating: doctorData.rating || 4.5,
  consultationFee: doctorData.consultationFee || doctorData.consultation_fee || 0,
  availability: Array.isArray(doctorData.availability)
    ? doctorData.availability
    : [],
  nextAvailable: doctorData.next_available || 'Today',
  profileImage: doctorData.profile_image || null
});

export const consultationService = {
  // Session Management
  getSessions: async (): Promise<AxiosResponse<ConsultationSession[]>> => {
    return authApi.get('/patient/consultation/sessions');
  },

  startSession: async (): Promise<AxiosResponse<{ sessionId: string }>> => {
    return authApi.post('/patient/consultation/sessions');
  },

  completeSession: async (sessionId: string): Promise<AxiosResponse<void>> => {
    return authApi.put(`/patient/consultation/sessions/${sessionId}/complete`);
  },

  // Messages and Chat
  getSessionMessages: async (sessionId: string): Promise<AxiosResponse<ConsultationMessage[]>> => {
    return authApi.get(`/patient/consultation/sessions/${sessionId}/messages`);
  },

  sendMessage: async (params: SendMessageParams): Promise<AxiosResponse<{ message: string }>> => {
    return authApi.post('/patient/consultation/chat', params);
  },

  // Doctors and Matching
  getMatchedDoctors: async (): Promise<AxiosResponse<MatchedDoctor[]>> => {
    const response = await authApi.get('/patient/consultation/doctors', {
      params: {
        status: 'approved',
        limit: 5
      }
    });

    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(transformDoctorData) : []
    };
  },

  // Summary and Analysis
  getSummary: async (sessionId: string): Promise<AxiosResponse<{
    summary: ConsultationSummary;
    doctors: MatchedDoctor[];
  }>> => {
    const response = await authApi.get(`/patient/consultation/sessions/${sessionId}/summary`);

    // If we have a summary but no doctors, fetch them separately
    if (response.data.summary && (!response.data.doctors || !response.data.doctors.length)) {
      const doctorsResponse = await consultationService.getMatchedDoctors();

      return {
        ...response,
        data: {
          summary: response.data.summary,
          doctors: doctorsResponse.data
        }
      };
    }

    // If we have both summary and doctors
    return {
      ...response,
      data: {
        summary: response.data.summary,
        doctors: Array.isArray(response.data.doctors)
          ? response.data.doctors.map(transformDoctorData)
          : []
      }
    };
  },

  // Doctor Booking
  getAvailableSlots: async (doctorId: string, date: string): Promise<AxiosResponse<BookingSlot[]>> => {
    return authApi.get(`/patient/consultation/doctors/${doctorId}/slots`, {
      params: { date }
    });
  },

  bookAppointment: async (doctorId: string, slotId: string): Promise<AxiosResponse<{
    appointmentId: string;
    message: string;
  }>> => {
    return authApi.post(`/patient/consultation/appointments`, {
      doctorId,
      slotId
    });
  }
};

export type {
  ConsultationMessage,
  MatchedDoctor,
  ConsultationSummary,
  BookingSlot,
  ConsultationSession,
  SendMessageParams
};