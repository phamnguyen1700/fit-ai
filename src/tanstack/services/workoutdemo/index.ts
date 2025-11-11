import { get } from '@/shared/api/http'
import { WorkoutDemoListParams, WorkoutDemoListResponse, WorkoutDemo } from '@/types/workoutdemo'

type WorkoutDemoApiPayload = {
  success?: boolean
  message?: string
  totalRecords?: number
  data?: unknown
}

const transformWorkoutDemoListResponse = (payload: unknown) => {
  let parsed: WorkoutDemoApiPayload = (payload as WorkoutDemoApiPayload) ?? {}

  if (typeof payload === 'string') {
    if (!payload.trim()) {
      parsed = {}
    } else {
      try {
        parsed = JSON.parse(payload)
      } catch (error) {
        console.error('Failed to parse workout demo response', error)
        parsed = {}
      }
    }
  }

  const data = Array.isArray(parsed?.data) ? (parsed.data as WorkoutDemo[]) : []
  const totalRecords = typeof parsed?.totalRecords === 'number' ? parsed.totalRecords : data.length

  return {
    data: {
      totalRecords,
      data,
    },
    message: typeof parsed?.message === 'string' ? parsed.message : undefined,
  }
}

export const getWorkoutDemoListService = (params?: WorkoutDemoListParams) =>
  get<WorkoutDemoListResponse>('fitness/api/workoutdemo', {
    params,
    transformResponse: [transformWorkoutDemoListResponse],
  })