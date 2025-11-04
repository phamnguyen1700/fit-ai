import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getExercisesService, updateExerciseService } from '@/tanstack/services/exercise'
import { Exercise, ExerciseParams, ExerciseState, UpdateExerciseData } from '@/types/exercise'
import { IApiResponse } from '@/shared/api/http'
import toast from 'react-hot-toast'

export const useGetExercises = (params?: ExerciseParams) => {
  return useQuery<IApiResponse<ExerciseState>>({
    queryKey: ['exercises', params], // Cache key - thay đổi khi params thay đổi
    queryFn: () => getExercisesService(params || {}),
    staleTime: 5 * 60 * 1000, // Cache 5 phút - exercises ít thay đổi
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