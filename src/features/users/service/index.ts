import { httpClient } from '@/shared/api/http';
import { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../types';

// API Service
export const userService = {
  // Lấy danh sách users
  getUsers: async (params?: Record<string, any>): Promise<User[]> => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return httpClient.get<User[]>(`/users${queryString ? `?${queryString}` : ''}`);
  },

  // Lấy user theo ID
  getUserById: async (id: string): Promise<User> => {
    return httpClient.get<User>(`/users/${id}`);
  },

  // Tạo user mới
  createUser: async (data: CreateUserRequest): Promise<User> => {
    return httpClient.post<User>('/users', data);
  },

  // Cập nhật user
  updateUser: async (data: UpdateUserRequest): Promise<User> => {
    return httpClient.put<User>(`/users/${data.id}`, data);
  },

  // Xóa user
  deleteUser: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/users/${id}`);
  },

  // Toggle trạng thái user
  toggleUserStatus: async (id: string): Promise<User> => {
    return httpClient.put<User>(`/users/${id}/toggle-status`);
  },

  // Đổi mật khẩu
  changePassword: async (data: ChangePasswordRequest): Promise<void> => {
    return httpClient.put<void>(`/users/${data.id}/change-password`, data);
  },

  // Reset mật khẩu
  resetPassword: async (id: string): Promise<void> => {
    return httpClient.put<void>(`/users/${id}/reset-password`);
  },
};
