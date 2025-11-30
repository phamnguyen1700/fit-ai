import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { WorkoutPlanAddCommentRequest, WorkoutPlanCommentsResponse } from '@/types/workoutplan';
import { addWorkoutPlanCommentService, getWorkoutPlanCommentsService } from '@/tanstack/services/workoutplan';
import type { IApiResponse } from '@/shared/api/http';

export const WORKOUT_PLAN_COMMENTS_QUERY_KEY = 'workoutPlanComments';

export const useWorkoutPlanComments = (exerciseLogId?: string, enabled = true) =>
  useQuery<IApiResponse<WorkoutPlanCommentsResponse>>({
    queryKey: [WORKOUT_PLAN_COMMENTS_QUERY_KEY, exerciseLogId],
    queryFn: () => {
      if (!exerciseLogId) throw new Error('exerciseLogId is required');
      return getWorkoutPlanCommentsService(exerciseLogId);
    },
    enabled: Boolean(exerciseLogId) && enabled,
  });

export const useAddWorkoutPlanComment = (exerciseLogId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkoutPlanAddCommentRequest) => {
      if (!exerciseLogId) throw new Error('exerciseLogId is required');
      return addWorkoutPlanCommentService(exerciseLogId, data);
    },
    onSuccess: () => {
      if (exerciseLogId) {
        queryClient.invalidateQueries({ queryKey: [WORKOUT_PLAN_COMMENTS_QUERY_KEY, exerciseLogId] });
      }
    },
  });
};

