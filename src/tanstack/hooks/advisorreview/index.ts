import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { IApiResponse } from '@/shared/api/http';
import { WorkoutReviewResponse, MealReviewResponse } from '@/types/advisorreview';
import { getPendingWorkoutReviewsService, getPendingMealReviewsService } from '@/tanstack/services/advisorreview';

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

