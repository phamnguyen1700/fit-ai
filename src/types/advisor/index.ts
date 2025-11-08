export interface Advisor {
  id: string;
  email: string;
  passwordHash?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  bio?: string;
  certifications?: string;
  specialties?: string;
  yearsExperience?: number;
  profilePicture?: string;
  availability?: string;
  rating?: number;
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
