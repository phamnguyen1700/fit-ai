import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getExercisesService, createExerciseService, updateExerciseService, deleteExerciseService } from '@/tanstack/services/exercise'
import { Exercise, ExerciseParams, UpdateExerciseData, CreateExerciseData } from '@/types/exercise'
import { IApiResponse } from '@/shared/api/http'
import toast from 'react-hot-toast'
import { APIError } from '@/types/utils/APIError'

interface UseGetExercisesOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useGetExercises = (params?: ExerciseParams, options?: UseGetExercisesOptions) => {
  const { enabled = true, staleTime = 5 * 60 * 1000 } = options || {};
  
  return useQuery<IApiResponse<Exercise[]>>({
    queryKey: ['exercises', params],
    queryFn: () => getExercisesService(params || {}),
    enabled,
    staleTime,
  })
}

export const useCreateExercise = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateExerciseData) => {
      console.log('Creating exercise:', data);
      return createExerciseService(data);
    },
    onSuccess: (response) => {
      console.log('Create success:', response);
      if (response.success) {
        toast.success('Tạo bài tập thành công! 🎉')
        // Invalidate và refetch exercises
        queryClient.invalidateQueries({ queryKey: ['exercises'] })
      } else {
        toast.error(response.message || 'Tạo bài tập thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Create exercise error:', error)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Tạo bài tập thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useUpdateExerciseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateExerciseData }) => {
      console.log('Updating exercise:', id, data);
      return updateExerciseService(id, data);
    },
    onSuccess: (response) => {
      console.log('Update success:', response);
      if (response.success) {
        toast.success('Cập nhật bài tập thành công! 🎉')
        // Invalidate và refetch exercises
        queryClient.invalidateQueries({ queryKey: ['exercises'] })
      } else {
        toast.error(response.message || 'Cập nhật bài tập thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Update exercise error:', error)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Cập nhật bài tập thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useDeleteExerciseMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('Deleting exercise:', id);
      return deleteExerciseService(id);
    },
    onSuccess: (response) => {
      console.log('Delete success:', response);
      if (response.success) {
        toast.success('Xóa bài tập thành công! 🗑️')
        // Invalidate và refetch exercises
        queryClient.invalidateQueries({ queryKey: ['exercises'] })
      } else {
        toast.error(response.message || 'Xóa bài tập thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Delete exercise error:', error)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Xóa bài tập thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}