import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { IApiResponse } from '@/shared/api/http';
import type {
  ActivePlanResponse,
  WorkoutDetailsResponse,
  MealDetailsResponse,
  GetWorkoutDetailsParams,
  GetMealDetailsParams,
  UpdateMealPlanParams,
  UpdateMealPlanResponse,
  UpdateWorkoutExerciseParams,
  UpdateWorkoutExerciseResponse,
} from '@/types/advisorplan';
import {
  getActivePlanService,
  getWorkoutDetailsService,
  getMealDetailsService,
  updateMealPlanService,
  updateWorkoutExerciseService,
} from '@/tanstack/services/advisorplan';
import toast from 'react-hot-toast';
import { APIError } from '@/types/utils/APIError';

/**
 * Hook to get active plan of customer
 */
export const useActivePlan = (userId?: string) => {
  const query = useQuery<IApiResponse<ActivePlanResponse>>({
    queryKey: ['active-plan', userId],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error('UserId is required'));
      }
      return getActivePlanService(userId);
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Active plan success:', query.data);
      console.log('✅ [Hook] Active plan data:', query.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Active plan error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

/**
 * Hook to get workout details of the active plan
 */
export const useWorkoutDetails = (params: GetWorkoutDetailsParams) => {
  const { userId, checkpointNumber, dayNumber } = params;
  
  const query = useQuery<IApiResponse<WorkoutDetailsResponse>>({
    queryKey: ['workout-details', userId, checkpointNumber, dayNumber],
    queryFn: () => getWorkoutDetailsService(params),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Workout details success:', query.data);
      console.log('✅ [Hook] Workout details data:', query.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Workout details error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

/**
 * Hook to get meal details of the active plan
 */
export const useMealDetails = (params: GetMealDetailsParams) => {
  const { userId, checkpointNumber, dayNumber } = params;
  
  const query = useQuery<IApiResponse<MealDetailsResponse>>({
    queryKey: ['meal-details', userId, checkpointNumber, dayNumber],
    queryFn: () => getMealDetailsService(params),
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Meal details success:', query.data);
      console.log('✅ [Hook] Meal details data:', query.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Meal details error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

/**
 * Hook to update meal plan for a specific day
 */
export const useUpdateMealPlan = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IApiResponse<UpdateMealPlanResponse>, Error, UpdateMealPlanParams>({
    mutationFn: (params) => updateMealPlanService(params),
    onSuccess: (data, variables) => {
      console.log('✅ [Hook] Update meal plan success:', data);
      
      // Invalidate and refetch meal details
      queryClient.invalidateQueries({
        queryKey: ['meal-details', variables.userId, variables.checkpointNumber],
      });

      toast.success(data.message || 'Cập nhật kế hoạch dinh dưỡng thành công');
    },
    onError: (error) => {
      console.error('❌ [Hook] Update meal plan error:', error);
      let errorMessage = 'Không thể cập nhật kế hoạch dinh dưỡng';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIError;
        errorMessage = apiError.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    },
  });

  return mutation;
};

/**
 * Hook to update an exercise in a workout
 */
export const useUpdateWorkoutExercise = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<IApiResponse<UpdateWorkoutExerciseResponse>, Error, UpdateWorkoutExerciseParams>({
    mutationFn: (params) => updateWorkoutExerciseService(params),
    onSuccess: (data, variables) => {
      console.log('✅ [Hook] Update workout exercise success:', data);
      
      // Invalidate and refetch workout details
      queryClient.invalidateQueries({
        queryKey: ['workout-details', variables.userId],
      });

      toast.success(data.message || 'Cập nhật bài tập thành công');
    },
    onError: (error) => {
      console.error('❌ [Hook] Update workout exercise error:', error);
      let errorMessage = 'Không thể cập nhật bài tập';
      
      if (error && typeof error === 'object' && 'response' in error) {
        const apiError = error as APIError;
        errorMessage = apiError.response?.data?.message || errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message || errorMessage;
      }
      
      toast.error(errorMessage);
    },
  });

  return mutation;
};

