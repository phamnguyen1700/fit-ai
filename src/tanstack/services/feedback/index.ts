import { get, put } from '@/shared/api/http';
import { FeedbackListParams, FeedbackListResponse, DenyFeedbackRequest } from '@/types/feedback';

export const getFeedbackListService = (params?: FeedbackListParams) =>
  get<FeedbackListResponse>('fitness/api/feedback', {
    params,
  });

export const approveFeedbackService = (feedbackId: string) =>
  put<{ success: boolean }>(`fitness/api/feedback/${feedbackId}/approve`);

export const denyFeedbackService = (feedbackId: string, data: DenyFeedbackRequest) =>
  put<{ success: boolean }>(`fitness/api/feedback/${feedbackId}/deny`, data);

export const togglePublicFeedbackService = (feedbackId: string) =>
  put<{ success: boolean }>(`fitness/api/feedback/${feedbackId}/toggle-public`);

