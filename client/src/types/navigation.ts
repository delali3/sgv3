// src/types/navigation.ts
export type UserRole = 'patient' | 'doctor';

export interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}