// Users Types
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'trainer' | 'user';
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'trainer' | 'user';
}

export interface UpdateUserRequest extends CreateUserRequest {
  id: string;
}

export interface ChangePasswordRequest {
  id: string;
  currentPassword: string;
  newPassword: string;
}

export interface UserFilters {
  role?: 'all' | 'admin' | 'trainer' | 'user';
  status?: 'all' | 'active' | 'inactive';
  search?: string;
}

export interface UserStats {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  adminCount: number;
  trainerCount: number;
  userCount: number;
}
