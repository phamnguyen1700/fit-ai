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

export interface AdvisorDetail extends Omit<Advisor, 'certifications'> {
  certifications?: string[] | string;
  workingHours?: string;
  totalClients?: number;
  activeClients?: number;
  completedPrograms?: number;
  bio?: string;
  birthDate?: string;
  gender?: string;
  achievements?: Achievement[];
}

export interface Achievement {
  year: string;
  title: string;
  organization: string;
}
