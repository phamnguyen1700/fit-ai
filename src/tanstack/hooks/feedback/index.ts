import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { IApiResponse } from '@/shared/api/http';
import { getFeedbackListService, approveFeedbackService, denyFeedbackService, togglePublicFeedbackService } from '@/tanstack/services/feedback';
import {
  FeedbackItem,
  FeedbackListParams,
  FeedbackListResponse,
  DenyFeedbackRequest,
} from '@/types/feedback';
import toast from 'react-hot-toast';
import { APIError } from '@/types/utils/APIError';

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

export const useApproveFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackId: string) => {
      console.log('Approving feedback:', feedbackId);
      return approveFeedbackService(feedbackId);
    },
    onSuccess: (response) => {
      console.log('Approve feedback success:', response);
      if (response.success) {
        toast.success('Duyệt feedback thành công! 🎉');
        // Invalidate và refetch feedback list
        queryClient.invalidateQueries({ queryKey: ['feedbackList'] });
      } else {
        toast.error(response.message || 'Duyệt feedback thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Approve feedback error:', error);
      const errorMessage =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Duyệt feedback thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

export const useDenyFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ feedbackId, data }: { feedbackId: string; data: DenyFeedbackRequest }) => {
      console.log('Denying feedback:', feedbackId, data);
      return denyFeedbackService(feedbackId, data);
    },
    onSuccess: (response) => {
      console.log('Deny feedback success:', response);
      if (response.success) {
        toast.success('Từ chối feedback thành công! 🎉');
        // Invalidate và refetch feedback list
        queryClient.invalidateQueries({ queryKey: ['feedbackList'] });
      } else {
        toast.error(response.message || 'Từ chối feedback thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Deny feedback error:', error);
      const errorMessage =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Từ chối feedback thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

export const useTogglePublicFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (feedbackId: string) => {
      console.log('Toggling public feedback:', feedbackId);
      return togglePublicFeedbackService(feedbackId);
    },
    onSuccess: (response) => {
      console.log('Toggle public feedback success:', response);
      if (response.success) {
        toast.success('Chuyển đổi trạng thái công khai thành công! 🎉');
        // Invalidate và refetch feedback list
        queryClient.invalidateQueries({ queryKey: ['feedbackList'] });
      } else {
        toast.error(response.message || 'Chuyển đổi trạng thái công khai thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Toggle public feedback error:', error);
      const errorMessage =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Chuyển đổi trạng thái công khai thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

