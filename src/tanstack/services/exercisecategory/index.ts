import { get, post, put, del } from '@/shared/api/http';
import type { ExerciseCategoryListResponse, GetExerciseCategoriesParams, CreateExerciseCategoryRequest, UpdateExerciseCategoryRequest } from '@/types/exercisecategory';
import type { ExerciseCategory } from '@/types/exercisecategory';

// Get all exercise categories with pagination
export const getExerciseCategories = (params?: GetExerciseCategoriesParams) => 
  get<ExerciseCategoryListResponse>('api/exercisecategory', { params });

// Get single exercise category by ID
export const getExerciseCategoryById = (id: string) => 
  get(`api/exercisecategory/${id}`);

// Create exercise category
export const createExerciseCategory = (data: CreateExerciseCategoryRequest) => 
  post<ExerciseCategory>('api/exercisecategory', data);

// Update exercise category
export const updateExerciseCategory = (id: string, data: UpdateExerciseCategoryRequest) => 
  put<ExerciseCategory>(`api/exercisecategory/${id}`, data);

// Delete exercise category
export const deleteExerciseCategory = (id: string) => 
  del(`api/exercisecategory/${id}`);
