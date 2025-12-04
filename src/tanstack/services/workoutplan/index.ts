import { get, post } from '@/shared/api/http';
import type { WorkoutPlanAddCommentRequest, WorkoutPlanCommentsResponse } from '@/types/workoutplan';

export const getWorkoutPlanCommentsService = (exerciseLogId: string) =>
  get<WorkoutPlanCommentsResponse>(`api/workoutplan/exercises/${exerciseLogId}/comments`);

export const addWorkoutPlanCommentService = (exerciseLogId: string, data: WorkoutPlanAddCommentRequest) =>
  post(`api/workoutplan/exercises/${exerciseLogId}/add-comment`, data);

