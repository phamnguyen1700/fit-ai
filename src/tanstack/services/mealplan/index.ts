import { get, post } from '@/shared/api/http';
import type { MealPlanAddCommentRequest, MealPlanCommentsResponse } from '@/types/mealplan';

export const getMealPlanCommentsService = (mealLogId: string) =>
  get<MealPlanCommentsResponse>(`api/mealplan/meals/${mealLogId}/comments`);

export const addMealPlanCommentService = (mealLogId: string, data: MealPlanAddCommentRequest) =>
  post(`api/mealplan/meals/${mealLogId}/add-comment`, data);

