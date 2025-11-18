export type CustomerStatus = 'on-track' | 'at-risk' | 'behind';
export type CustomerEngagement = 'high' | 'medium' | 'low';
export type CustomerGender = 'male' | 'female' | 'other';

export interface MonthlyCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  month: string; // ISO month string, e.g. 2025-11
  goal: string;
  plan: string;
  status: CustomerStatus;
  engagement: CustomerEngagement;
  sessionsCompleted: number;
  sessionsTarget: number;
  progressPercent: number; // 0 - 100
  lastCheckIn: string;
  nextSession: string;
  weightChange?: string;
  notes?: string;
}

export interface CustomerMeasurementEntry {
  date: string;
  weight: number;
  bodyFat?: number;
  boneMass?: number;
  muscleMass?: number;
}

export interface CustomerDetail extends MonthlyCustomer {
  age?: number;
  gender?: CustomerGender;
  joinedDate?: string;
  packageName?: string;
  height?: number;
  currentWeight?: number;
  bmi?: number;
  medicalHistory?: string;
  remarks?: string;
  measurements?: CustomerMeasurementEntry[];
}
