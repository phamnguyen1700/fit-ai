import { get } from '@/shared/api/http';
import { WorkoutReviewResponse, MealReviewResponse } from '@/types/advisorreview';

const BASE_PATH = 'fitness/api/advisorreview';

export const getPendingWorkoutReviewsService = async () => {
  const url = `${BASE_PATH}/workout/pending`;
  const response = await get<WorkoutReviewResponse>(url);
  return response;
};

export const getPendingMealReviewsService = async () => {
  const url = `${BASE_PATH}/meal/pending`;
  const response = await get<MealReviewResponse>(url);
  return response;
};

