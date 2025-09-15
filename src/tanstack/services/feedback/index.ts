import { httpClient } from '@/shared/api/http';
import { Feedback, CreateFeedbackRequest } from '@/types/feedback';

// API Service
export const feedbackService = {
  // Lấy danh sách feedbacks
  getFeedbacks: async (params?: Record<string, any>): Promise<Feedback[]> => {
    const queryString = params ? new URLSearchParams(params).toString() : '';
    return httpClient.get<Feedback[]>(`/feedbacks${queryString ? `?${queryString}` : ''}`);
  },

  // Lấy feedback theo ID
  getFeedbackById: async (id: string): Promise<Feedback> => {
    return httpClient.get<Feedback>(`/feedbacks/${id}`);
  },

  // Tạo feedback mới
  createFeedback: async (data: CreateFeedbackRequest): Promise<Feedback> => {
    return httpClient.post<Feedback>('/feedbacks', data);
  },

  // Cập nhật feedback
  updateFeedback: async (id: string, data: Partial<Feedback>): Promise<Feedback> => {
    return httpClient.put<Feedback>(`/feedbacks/${id}`, data);
  },

  // Xóa feedback
  deleteFeedback: async (id: string): Promise<void> => {
    return httpClient.delete<void>(`/feedbacks/${id}`);
  },
};
