import { get } from '@/shared/api/http';
import type { ExerciseCategoryListResponse, GetExerciseCategoriesParams } from '@/types/exercisecategory';

// Get all exercise categories with pagination
export const getExerciseCategories = (params?: GetExerciseCategoriesParams) => 
  get<ExerciseCategoryListResponse>('api/exercisecategory', { params });

// Get single exercise category by ID
export const getExerciseCategoryById = (id: string) => 
  get(`api/exercisecategory/${id}`);
