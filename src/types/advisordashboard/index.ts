export type AdvisorDashboardCustomerStatus = 'on-track' | 'at-risk' | 'behind';
export type AdvisorDashboardCustomerEngagement = 'high' | 'medium' | 'low';

export interface AdvisorDashboardCustomer {
  id?: string;
  customerId?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  avatarUrl?: string;
  goal?: string;
  plan?: string;
  status?: AdvisorDashboardCustomerStatus | string;
  engagement?: AdvisorDashboardCustomerEngagement | string;
  sessionsCompleted?: number;
  sessionsTarget?: number;
  progressPercent?: number;
  lastCheckIn?: string;
  nextSession?: string;
  weightChange?: string;
  notes?: string;
}

export interface AdvisorDashboardCustomersParams {
  month: number;
  year: number;
  page?: number;
  pageSize?: number;
}

export interface AdvisorDashboardCustomersResponse {
  customers: AdvisorDashboardCustomer[];
  totalCustomersThisMonth: number;
  reportDate: string;
}

export type CustomerStatus = AdvisorDashboardCustomerStatus;
export type CustomerEngagement = AdvisorDashboardCustomerEngagement;

export interface MonthlyCustomer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  month: string;
  goal: string;
  plan: string;
  status: CustomerStatus;
  engagement: CustomerEngagement;
  sessionsCompleted: number;
  sessionsTarget: number;
  progressPercent: number;
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
  gender?: 'male' | 'female' | 'other';
  joinedDate?: string;
  packageName?: string;
  height?: number;
  currentWeight?: number;
  bmi?: number;
  medicalHistory?: string;
  remarks?: string;
  measurements?: CustomerMeasurementEntry[];
}

export interface AdvisorDashboardCustomerDetailResponse {
  userId?: string;
  name?: string;
  email?: string;
  goal?: string;
  monthlyProgress?: number;
  lastCheckIn?: string;
  nextSession?: string;
  sessionsCompleted?: number;
  totalSessions?: number;
  progressDetails?: {
    workoutProgress?: number;
    mealProgress?: number;
    currentCheckpoint?: number;
    totalCheckpoints?: number;
    lastWorkoutLog?: string;
    lastMealLog?: string;
  };
  phone?: string;
  avatarUrl?: string;
  plan?: string;
  status?: AdvisorDashboardCustomerStatus | string;
  engagement?: AdvisorDashboardCustomerEngagement | string;
}

