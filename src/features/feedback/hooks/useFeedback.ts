// Note: Install @tanstack/react-query for production use
// npm install @tanstack/react-query
import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query';
import { feedbackService } from '../service';
import { Feedback, CreateFeedbackRequest } from '../types';
import { feedbackQueryKeys } from '../queries/queryKeys';
import { queryClient } from '@/lib/queryClient';
// import { toast } from 'react-toastify'; // Uncomment when installing react-toastify

// Query Hooks
export const useFeedbacks = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: feedbackQueryKeys.list(params),
    queryFn: () => feedbackService.getFeedbacks(params),
    placeholderData: keepPreviousData,
  });
};

export const useFeedback = (id: string) => {
  return useQuery({
    queryKey: feedbackQueryKeys.detail(id),
    queryFn: () => feedbackService.getFeedbackById(id),
    enabled: !!id,
  });
};

// Mutation Hooks
export const useCreateFeedbackMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateFeedbackRequest) => feedbackService.createFeedback(payload),
    onSuccess: () => {
      // toast.success('Gửi phản hồi thành công');
      queryClient.invalidateQueries({ queryKey: feedbackQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Gửi phản hồi thất bại');
    },
  });
};

export const useUpdateFeedbackMutation = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Feedback> }) => 
      feedbackService.updateFeedback(id, payload),
    onSuccess: (_, variables) => {
      // toast.success('Cập nhật phản hồi thành công');
      queryClient.invalidateQueries({ queryKey: feedbackQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: feedbackQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Cập nhật phản hồi thất bại');
    },
  });
};

export const useDeleteFeedbackMutation = () => {
  return useMutation({
    mutationFn: (id: string) => feedbackService.deleteFeedback(id),
    onSuccess: () => {
      // toast.success('Xóa phản hồi thành công');
      queryClient.invalidateQueries({ queryKey: feedbackQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Xóa phản hồi thất bại');
    },
  });
};
