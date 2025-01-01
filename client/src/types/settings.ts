// types/settings.ts
export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    bio?: string;
    avatar?: string;
  }
  
  export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
    appointmentReminder: boolean;
    marketingEmails: boolean;
  }
  
  export interface WorkingHours {
    start: string;
    end: string;
  }
  
  export interface SecuritySettings {
    twoFactorEnabled: boolean;
    lastPasswordChange: string;
    loginHistory: LoginRecord[];
  }
  
  export interface LoginRecord {
    timestamp: string;
    ipAddress: string;
    device: string;
    location?: string;
  }
  
  export interface UserPreferences {
    theme: 'light' | 'dark' | 'system';
    language: string;
    timezone: string;
    calendar: {
      showWeekend: boolean;
      weekStartsOn: 'sunday' | 'monday';
      defaultView: 'month' | 'week' | 'day';
    };
  }
  
  export interface SettingsState {
    profile: UserProfile;
    notifications: NotificationPreferences;
    security: SecuritySettings;
    preferences: UserPreferences;
    workingHours: WorkingHours;
  }