import { get } from '@/shared/api/http';
import { FeedbackListParams, FeedbackListResponse } from '@/types/feedback';

export const getFeedbackListService = (params?: FeedbackListParams) =>
  get<FeedbackListResponse>('fitness/api/feedback', {
    params,
  });

