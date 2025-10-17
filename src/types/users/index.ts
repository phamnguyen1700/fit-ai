export interface User {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}

export interface UserState {
  total: number;
  page: number;
  pageSize: number;
  items: User[];
}

export interface Params {
  page?: number;
  pageSize?: number;
}

export interface deleteUserRequest {
  id: string;
}

export interface CreateUserRequest {
  email: string;
  name: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  role?: "user" | "admin" | "moderator";
  planId?: string;
}

export interface UpdateUserRequest {
  id: string;
  email?: string;
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: "male" | "female" | "other";
  address?: string;
  status?: "active" | "inactive" | "pending" | "banned";
  role?: "user" | "admin" | "moderator";
  planId?: string;
  avatar?: string;
}

export interface UserFilters {
  status?: "active" | "inactive" | "pending" | "banned";
  role?: "user" | "admin" | "moderator";
  planId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  gender?: "male" | "female" | "other";
}

export interface UserStats {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  banned: number;
  byRole: Record<string, number>;
  byPlan: Record<string, number>;
  newUsersThisMonth: number;
  averageLoginCount: number;
}

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
};

export type IRegister = {
  email: string;
  password: string;
};
