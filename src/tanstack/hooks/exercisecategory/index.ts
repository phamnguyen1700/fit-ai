import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getExerciseCategories, getExerciseCategoryById, createExerciseCategory, updateExerciseCategory, deleteExerciseCategory } from '@/tanstack/services/exercisecategory';
import type { GetExerciseCategoriesParams, ExerciseCategoryListResponse, CreateExerciseCategoryRequest, UpdateExerciseCategoryRequest } from '@/types/exercisecategory';
import type { IApiResponse } from '@/shared/api/http';
import toast from 'react-hot-toast';
import { APIError } from '@/types/utils/APIError';

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

// Hook to create exercise category
export const useCreateExerciseCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateExerciseCategoryRequest) => {
      console.log('Creating exercise category:', data);
      return createExerciseCategory(data);
    },
    onSuccess: (response) => {
      console.log('Create category success:', response);
      if (response.success) {
        toast.success('Tạo danh mục thành công! 🎉');
        // Invalidate và refetch categories
        queryClient.invalidateQueries({ queryKey: ['exerciseCategories'] });
      } else {
        toast.error(response.message || 'Tạo danh mục thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Create category error:', error);
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Tạo danh mục thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

// Hook to update exercise category
export const useUpdateExerciseCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExerciseCategoryRequest }) => {
      console.log('Updating exercise category:', id, data);
      return updateExerciseCategory(id, data);
    },
    onSuccess: (response) => {
      console.log('Update category success:', response);
      if (response.success) {
        toast.success('Cập nhật danh mục thành công! 🎉');
        // Invalidate và refetch categories
        queryClient.invalidateQueries({ queryKey: ['exerciseCategories'] });
      } else {
        toast.error(response.message || 'Cập nhật danh mục thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Update category error:', error);
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Cập nhật danh mục thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

// Hook to delete exercise category
export const useDeleteExerciseCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('Deleting exercise category:', id);
      return deleteExerciseCategory(id);
    },
    onSuccess: (response) => {
      console.log('Delete category success:', response);
      if (response.success) {
        toast.success('Xóa danh mục thành công! 🗑️');
        // Invalidate và refetch categories
        queryClient.invalidateQueries({ queryKey: ['exerciseCategories'] });
      } else {
        toast.error(response.message || 'Xóa danh mục thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Delete category error:', error);
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Xóa danh mục thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};
