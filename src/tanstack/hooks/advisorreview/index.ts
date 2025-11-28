import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { IApiResponse } from '@/shared/api/http';
import { WorkoutReviewResponse, MealReviewResponse, WorkoutReviewRequest } from '@/types/advisorreview';
import { getPendingWorkoutReviewsService, getPendingMealReviewsService, submitWorkoutReviewService } from '@/tanstack/services/advisorreview';
import toast from 'react-hot-toast';
import { APIError } from '@/types/utils/APIError';

export const usePendingWorkoutReviews = () => {
  const query = useQuery<IApiResponse<WorkoutReviewResponse>>({
    queryKey: ['pending-workout-reviews'],
    queryFn: () => getPendingWorkoutReviewsService(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Pending workout reviews success:', query.data);
      console.log('✅ [Hook] Response data:', query.data?.data);
      console.log('✅ [Hook] Reviews array:', query.data?.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Pending workout reviews error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

export const usePendingMealReviews = () => {
  const query = useQuery<IApiResponse<MealReviewResponse>>({
    queryKey: ['pending-meal-reviews'],
    queryFn: () => getPendingMealReviewsService(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Pending meal reviews success:', query.data);
      console.log('✅ [Hook] Response data:', query.data?.data);
      console.log('✅ [Hook] Reviews array:', query.data?.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Pending meal reviews error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

export const useSubmitWorkoutReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ workoutLogId, data }: { workoutLogId: string; data: WorkoutReviewRequest }) => {
      console.log('🔵 [Hook] Submitting workout review:', workoutLogId, data);
      return submitWorkoutReviewService(workoutLogId, data);
    },
    onSuccess: (response) => {
      console.log('✅ [Hook] Submit workout review success:', response);
      if (response.success) {
        toast.success(response.message || 'Đánh giá workout thành công!');
        // Invalidate và refetch pending reviews
        queryClient.invalidateQueries({ queryKey: ['pending-workout-reviews'] });
      } else {
        toast.error(response.message || 'Đánh giá workout thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('❌ [Hook] Submit workout review error:', error);
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Đánh giá workout thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

