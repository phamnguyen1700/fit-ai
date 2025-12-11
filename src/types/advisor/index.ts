export interface Advisor {
  id: string;
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  certifications?: string;
  specialties?: string[] | string;
  yearsExperience?: number;
  profilePicture?: string;
  availability?: string;
  rating?: number;
  totalCustomers?: number;
  customers?: AdvisorCustomer[];
  accountLockedUntil?: string | null;
  isActive: boolean;
  lastCreate?: string;
  lastUpdate?: string;
}

export interface AdvisorParams {
  page?: number;
  pageSize?: number;
  isActive?: boolean;
}

export type AdvisorListResponse = Advisor[];

export interface AdvisorDetail extends Omit<Advisor, 'certifications' | 'specialties'> {
  certifications?: string[] | string;
  specialties?: string[] | string;
  workingHours?: string;
  availability?: string; // API returns this field
  totalCustomers?: number;
  customers?: AdvisorCustomer[];
  completedPrograms?: number;
  bio?: string;
  achievements?: Achievement[];
}

export interface Achievement {
  year: string;
  title: string;
  organization: string;
}

export interface AdvisorCustomer {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  goal: string;
  subscriptionStatus: string;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;
}

export interface UpdateAdvisorProfileRequest {
  firstName: string;
  lastName: string;
  phone: string;
  bio: string;
  specialties: string;
  yearsExperience: number;
  profilePicture: string;
  availability: string;
}

export interface CreateAdvisorRequest {
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  certificateFile?: File;
}
