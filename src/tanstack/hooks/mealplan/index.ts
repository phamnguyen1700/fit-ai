import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { MealPlanAddCommentRequest, MealPlanCommentsResponse } from '@/types/mealplan';
import { addMealPlanCommentService, getMealPlanCommentsService } from '@/tanstack/services/mealplan';
import type { IApiResponse } from '@/shared/api/http';

export const MEAL_PLAN_COMMENTS_QUERY_KEY = 'mealPlanComments';

export const useMealPlanComments = (mealLogId?: string, enabled = true) =>
  useQuery<IApiResponse<MealPlanCommentsResponse>>({
    queryKey: [MEAL_PLAN_COMMENTS_QUERY_KEY, mealLogId],
    queryFn: () => {
      if (!mealLogId) {
        throw new Error('mealLogId is required');
      }
      return getMealPlanCommentsService(mealLogId);
    },
    enabled: Boolean(mealLogId) && enabled,
  });

export const useAddMealPlanComment = (mealLogId?: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MealPlanAddCommentRequest) => {
      if (!mealLogId) throw new Error('mealLogId is required');
      return addMealPlanCommentService(mealLogId, data);
    },
    onSuccess: () => {
      if (mealLogId) {
        queryClient.invalidateQueries({ queryKey: [MEAL_PLAN_COMMENTS_QUERY_KEY, mealLogId] });
      }
    },
  });
};

