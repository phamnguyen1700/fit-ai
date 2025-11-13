import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createWorkoutDemoService, deleteWorkoutDemoService, getWorkoutDemoDetailService, getWorkoutDemoListService, updateWorkoutDemoDetailService, hardDeleteWorkoutDemoService, updateWorkoutDemoService, updateWorkoutDemoDayService } from '@/tanstack/services/workoutdemo'
import { WorkoutDemoDetailResponse, WorkoutDemoListParams, WorkoutDemoListResponse, CreateWorkoutDemoPayload, CreateWorkoutDemoResponse, UpdateWorkoutDemoDetailPayload, UpdateWorkoutDemoDetailResponse, UpdateWorkoutDemoPayload, UpdateWorkoutDemoResponse, UpdateWorkoutDemoExercisePayload, UpdateWorkoutDemoDayPayload } from '@/types/workoutdemo'
import { IApiResponse } from '@/shared/api/http'
import toast from 'react-hot-toast'

export const WORKOUT_DEMO_QUERY_KEY = 'workout-demo-list'
export const WORKOUT_DEMO_DETAIL_QUERY_KEY = 'workout-demo-detail'

export const useGetWorkoutDemoList = (params?: WorkoutDemoListParams) => {
  return useQuery<IApiResponse<WorkoutDemoListResponse>>({
    queryKey: [WORKOUT_DEMO_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getWorkoutDemoListService(params)

      if (!response.success) {
        throw new Error(response.message || 'Không thể tải danh sách kế hoạch luyện tập')
      }

      return response
    },
    staleTime: 5 * 60 * 1000,
  })
}

export const useGetWorkoutDemoDetail = (id?: string) => {
  return useQuery<IApiResponse<WorkoutDemoDetailResponse>>({
    queryKey: [WORKOUT_DEMO_DETAIL_QUERY_KEY, id],
    queryFn: async () => {
      const response = await getWorkoutDemoDetailService(id as string)
    console.log('response', response)
      if (!response.success) {
        throw new Error(response.message || 'Không thể tải chi tiết kế hoạch luyện tập')
      }

      return response
    },
    enabled: Boolean(id),
    staleTime: 5 * 60 * 1000,
  })
}

export const useCreateWorkoutDemo = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<CreateWorkoutDemoResponse>, unknown, CreateWorkoutDemoPayload>({
    mutationFn: (payload) => createWorkoutDemoService(payload),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Tạo kế hoạch tập luyện thành công!')
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_QUERY_KEY] })
      } else {
        toast.error(response.message || 'Tạo kế hoạch tập luyện thất bại')
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Không thể tạo kế hoạch tập luyện. Vui lòng thử lại.'
      toast.error(message)
    },
  })
}

export const useUpdateWorkoutDemoDetail = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<UpdateWorkoutDemoDetailResponse>, unknown, { workoutDemoId: string; payload: UpdateWorkoutDemoDetailPayload }>({
    mutationFn: ({ workoutDemoId, payload }) => updateWorkoutDemoDetailService(workoutDemoId, payload),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Cập nhật chi tiết kế hoạch thành công! ✅')
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_DETAIL_QUERY_KEY, variables.workoutDemoId] })
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_QUERY_KEY] })
      } else {
        toast.error(response.message || 'Cập nhật chi tiết kế hoạch thất bại')
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Cập nhật chi tiết kế hoạch thất bại. Vui lòng thử lại.'
      toast.error(message)
    },
  })
}

export const useUpdateWorkoutDemo = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<UpdateWorkoutDemoResponse>, unknown, { workoutDemoId: string; payload: UpdateWorkoutDemoPayload }>({
    mutationFn: ({ workoutDemoId, payload }) => updateWorkoutDemoService(workoutDemoId, payload),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Cập nhật kế hoạch luyện tập thành công!')
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_QUERY_KEY] })
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_DETAIL_QUERY_KEY, variables.workoutDemoId] })
      } else {
        toast.error(response.message || 'Cập nhật kế hoạch luyện tập thất bại')
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Cập nhật kế hoạch luyện tập thất bại. Vui lòng thử lại.'
      toast.error(message)
    },
  })
}

export const useDeleteWorkoutDemo = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<null>, unknown, string>({
    mutationFn: (id) => deleteWorkoutDemoService(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success('Đã vô hiệu hóa kế hoạch luyện tập.')
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_QUERY_KEY] })
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_DETAIL_QUERY_KEY, id] })
      } else {
        toast.error(response.message || 'Không thể vô hiệu hóa kế hoạch luyện tập')
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Không thể vô hiệu hóa kế hoạch luyện tập. Vui lòng thử lại.'
      toast.error(message)
    },
  })
}

export const useHardDeleteWorkoutDemo = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<null>, unknown, string>({
    mutationFn: (id) => hardDeleteWorkoutDemoService(id),
    onSuccess: (response, id) => {
      if (response.success) {
        toast.success('Đã xóa vĩnh viễn kế hoạch luyện tập.')
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_QUERY_KEY] })
        queryClient.removeQueries({ queryKey: [WORKOUT_DEMO_DETAIL_QUERY_KEY, id] })
      } else {
        toast.error(response.message || 'Không thể xóa kế hoạch luyện tập')
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Không thể xóa kế hoạch luyện tập. Vui lòng thử lại.'
      toast.error(message)
    },
  })
}

export const useUpdateWorkoutDemoDay = () => {
  const queryClient = useQueryClient()

  return useMutation<IApiResponse<null>, unknown, { workoutDemoId: string; dayPayload: UpdateWorkoutDemoDayPayload }>({
    mutationFn: ({ workoutDemoId, dayPayload }) =>
      updateWorkoutDemoDayService(workoutDemoId, dayPayload),
    onSuccess: (response, variables) => {
      if (response.success) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_DETAIL_QUERY_KEY, variables.workoutDemoId] })
        queryClient.invalidateQueries({ queryKey: [WORKOUT_DEMO_QUERY_KEY] })
      } else {
        toast.error(response.message || 'Cập nhật bài tập thất bại')
      }
    },
    onError: (error: any) => {
      const message = error?.response?.data?.message || error?.message || 'Cập nhật bài tập thất bại. Vui lòng thử lại.'
      toast.error(message)
    },
  })
}
