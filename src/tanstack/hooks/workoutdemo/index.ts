import { useQuery } from '@tanstack/react-query'
import { getWorkoutDemoDetailService, getWorkoutDemoListService } from '@/tanstack/services/workoutdemo'
import { WorkoutDemoDetailResponse, WorkoutDemoListParams, WorkoutDemoListResponse } from '@/types/workoutdemo'
import { IApiResponse } from '@/shared/api/http'

export const WORKOUT_DEMO_QUERY_KEY = 'workout-demo-list'
export const WORKOUT_DEMO_DETAIL_QUERY_KEY = 'workout-demo-detail'

export const useGetWorkoutDemoList = (params?: WorkoutDemoListParams) => {
  return useQuery<IApiResponse<WorkoutDemoListResponse>>({
    queryKey: [WORKOUT_DEMO_QUERY_KEY, params],
    queryFn: () => getWorkoutDemoListService(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useGetWorkoutDemoDetail = (id?: string) => {
  return useQuery<IApiResponse<WorkoutDemoDetailResponse>>({
    queryKey: [WORKOUT_DEMO_DETAIL_QUERY_KEY, id],
    queryFn: () => getWorkoutDemoDetailService(id as string),
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  })
}
