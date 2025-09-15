import { httpClient } from '@/shared/api/http';
import { Plan, CreatePlanRequest, UpdatePlanRequest } from '@/types/plans';

// API Service
export const planService = {
  // Lấy danh sách plans
  getPlans: async (params?: Record<string, any>): Promise<Plan[]> => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return httpClient.get<Plan[]>(`/plans${queryString ? `?${queryString}` : ''}`);
  },

  // Lấy plan theo ID
  getPlanById: async (id: string): Promise<Plan> => {
    return httpClient.get<Plan>(`/plans/${id}`);
  },

  // Tạo plan mới
  createPlan: async (data: CreatePlanRequest): Promise<Plan> => {
    return httpClient.post<Plan>('/plans', data);
  },

  // Cập nhật plan
  updatePlan: async (data: UpdatePlanRequest): Promise<Plan> => {
    return httpClient.put<Plan>(`/plans/${data.id}`, data);
  },

  // Xóa plan
  deletePlan: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/plans/${id}`);
  },

  // Toggle trạng thái plan
  togglePlanStatus: async (id: string): Promise<Plan> => {
    return httpClient.put<Plan>(`/plans/${id}/toggle-status`);
  },
};
