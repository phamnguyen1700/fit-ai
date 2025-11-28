import { useQuery } from '@tanstack/react-query';
import { getExerciseCategories, getExerciseCategoryById } from '@/tanstack/services/exercisecategory';
import type { GetExerciseCategoriesParams, ExerciseCategoryListResponse } from '@/types/exercisecategory';
import type { IApiResponse } from '@/shared/api/http';

// Hook to get all exercise categories with pagination
export const useGetExerciseCategories = (params?: GetExerciseCategoriesParams) => {
  return useQuery<IApiResponse<ExerciseCategoryListResponse>>({
    queryKey: ['exerciseCategories', params],
    queryFn: () => getExerciseCategories(params),
  });
};

// Hook to get single exercise category by ID
export const useGetExerciseCategoryById = (id: string) => {
  return useQuery({
    queryKey: ['exerciseCategory', id],
    queryFn: () => getExerciseCategoryById(id),
    enabled: !!id, // Only run query if id exists
  });
};
