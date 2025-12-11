import { get, put } from '@/shared/api/http';
import { FeedbackListParams, FeedbackListResponse, DenyFeedbackRequest, PublicFeedbackParams, PublicFeedbackResponse } from '@/types/feedback';

export const getFeedbackListService = (params?: FeedbackListParams) =>
  get<FeedbackListResponse>('api/feedback', {
    params,
  });

export const approveFeedbackService = (feedbackId: string) =>
  put<{ success: boolean }>(`api/feedback/${feedbackId}/approve`);

export const denyFeedbackService = (feedbackId: string, data: DenyFeedbackRequest) =>
  put<{ success: boolean }>(`api/feedback/${feedbackId}/deny`, data);

export const togglePublicFeedbackService = (feedbackId: string) =>
  put<{ success: boolean }>(`api/feedback/${feedbackId}/toggle-public`);

export const getPublicFeedbackService = (params?: PublicFeedbackParams) =>
  get<PublicFeedbackResponse>('api/feedback/public', {
    params,
  });

