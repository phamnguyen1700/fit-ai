export interface AdminProfile {
  email: string;
  phone: string | null;
  firstName: string | null;
  lastName: string | null;
}

export interface UpdateAdminProfileRequest {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
}
