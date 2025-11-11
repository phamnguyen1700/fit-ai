import { useQuery } from '@tanstack/react-query'
import { getWorkoutDemoListService } from '@/tanstack/services/workoutdemo'
import { WorkoutDemoListParams, WorkoutDemoListResponse } from '@/types/workoutdemo'
import { IApiResponse } from '@/shared/api/http'

export const WORKOUT_DEMO_QUERY_KEY = 'workout-demo-list'

export const useGetWorkoutDemoList = (params?: WorkoutDemoListParams) => {
  return useQuery<IApiResponse<WorkoutDemoListResponse>>({
    queryKey: [WORKOUT_DEMO_QUERY_KEY, params],
    queryFn: () => getWorkoutDemoListService(params),
    staleTime: 5 * 60 * 1000,
  })
}
