import { useQuery } from '@tanstack/react-query';

import { IApiResponse } from '@/shared/api/http';
import { getFeedbackListService } from '@/tanstack/services/feedback';
import {
  FeedbackItem,
  FeedbackListParams,
  FeedbackListResponse,
} from '@/types/feedback';

const coerceNumber = (...candidates: Array<number | string | undefined | null>) => {
  for (const candidate of candidates) {
    if (candidate === undefined || candidate === null) continue;
    const value = Number(candidate);
    if (!Number.isNaN(value)) return value;
  }
  return undefined;
};

const adaptFeedbackList = (
  payload?: FeedbackListResponse | FeedbackItem[] | null
): FeedbackListResponse => {
  const empty: FeedbackListResponse = {
    items: [],
    pageNumber: 1,
    pageSize: 0,
    totalItems: 0,
    totalPages: 0,
  };

  if (!payload) {
    return empty;
  }

  if (Array.isArray(payload)) {
    const total = payload.length;
    return {
      ...empty,
      items: payload,
      pageSize: total,
      totalItems: total,
      totalPages: total > 0 ? 1 : 0,
    };
  }

  const items =
    payload.items ??
    (Array.isArray(payload.data) ? payload.data : []) ??
    [];

  const pageSize =
    coerceNumber(
      payload.pageSize,
      (payload as { limit?: number }).limit
    ) ?? items.length;

  const totalItems =
    coerceNumber(
      payload.totalItems,
      (payload as { total?: number }).total,
      (payload as { totalItem?: number }).totalItem
    ) ?? items.length;

  const totalPages =
    coerceNumber(
      payload.totalPages,
      (payload as { totalPage?: number }).totalPage
    ) ??
    (pageSize > 0 ? Math.ceil(totalItems / pageSize) : items.length > 0 ? 1 : 0);

  return {
    ...empty,
    ...payload,
    items,
    pageNumber:
      coerceNumber(
        payload.pageNumber,
        (payload as { page?: number }).page
      ) ?? empty.pageNumber,
    pageSize,
    totalItems,
    totalPages,
  };
};

export const useFeedbackList = (params?: FeedbackListParams) =>
  useQuery<IApiResponse<FeedbackListResponse>>({
    queryKey: ['feedbackList', params],
    queryFn: () => getFeedbackListService(params),
    select: (response) => ({
      ...response,
      data: adaptFeedbackList(response.data),
    }),
  });

