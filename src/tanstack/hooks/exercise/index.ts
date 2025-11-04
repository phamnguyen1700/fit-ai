import { useQuery } from '@tanstack/react-query'
import { getExercisesService } from '@/tanstack/services/exercise'
import { ExerciseParams, ExerciseState } from '@/types/exercise'
import { IApiResponse } from '@/shared/api/http'

export const useGetExercises = (params?: ExerciseParams) => {
  return useQuery<IApiResponse<ExerciseState>>({
    queryKey: ['exercises', params], // Cache key - thay đổi khi params thay đổi
    queryFn: () => getExercisesService(params || {}),
    staleTime: 5 * 60 * 1000, // Cache 5 phút - exercises ít thay đổi
  })
}
