// src/types/consultation.ts

export interface ConsultationMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  type?: 'text' | 'analysis';
  analysisData?: SymptomAnalysis;
}

export interface MatchedDoctor {
  id: string;
  name: string;
  specialization: string;
  experience?: number;
  rating?: number;
  consultationFee: number;
  availability: Array<{
    dayOfWeek: number;
    startTime: string;
    endTime: string;
  }>;
  nextAvailable?: string;
  profileImage?: string | null;
}
export interface SymptomAnalysis {
  symptoms: string[];
  severity: 'low' | 'moderate' | 'severe';
  recommendedSpecialist: string;
  urgencyLevel: 'low' | 'medium' | 'high';
}

export interface ConsultationSummary {
  symptoms: string[];
  severity: 'low' | 'moderate' | 'severe';
  recommendedSpecialist: string;
  urgencyLevel: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface BookingSlot {
  id: string;
  startTime: string;
  endTime: string;
  isAvailable?: boolean;
  status?: 'available' | 'booked';
}

export interface ConsultationSession {
  id: string;
  startTime: string;
  lastUpdateTime: string;
  status: 'active' | 'completed';
  summary?: string;
  primarySymptoms?: string[];
}
