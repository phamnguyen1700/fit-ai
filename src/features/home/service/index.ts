import { httpClient } from '@/shared/api/http';
import { Stats, Feature, Testimonial } from '../types';

// API Service
export const homeService = {
  // Lấy thống kê
  getStats: async (): Promise<Stats> => {
    return httpClient.get<Stats>('/home/stats');
  },

  // Lấy danh sách tính năng
  getFeatures: async (): Promise<Feature[]> => {
    return httpClient.get<Feature[]>('/home/features');
  },

  // Lấy danh sách testimonial
  getTestimonials: async (): Promise<Testimonial[]> => {
    return httpClient.get<Testimonial[]>('/home/testimonials');
  },

  // Đăng ký newsletter
  subscribeNewsletter: async (email: string): Promise<void> => {
    return httpClient.post<void>('/home/newsletter', { email });
  },
};
