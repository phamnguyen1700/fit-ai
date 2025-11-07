import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getExercisesService, createExerciseService, updateExerciseService } from '@/tanstack/services/exercise'
import { Exercise, ExerciseParams, ExerciseState, UpdateExerciseData, CreateExerciseData } from '@/types/exercise'
import { IApiResponse } from '@/shared/api/http'
import toast from 'react-hot-toast'

export const useGetExercises = (params?: ExerciseParams) => {
  return useQuery<IApiResponse<Exercise[]>>({
    queryKey: ['exercises', params],
    queryFn: () => getExercisesService(params || {}),
    staleTime: 5 * 60 * 1000, 
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
    onError: (error: any) => {
      console.error('Create exercise error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Tạo bài tập thất bại. Vui lòng thử lại.'
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
    onError: (error: any) => {
      console.error('Update exercise error:', error)
      const errorMessage = error?.response?.data?.message || error?.message || 'Cập nhật bài tập thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}