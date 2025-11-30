import { get, post } from '@/shared/api/http';
import {
  WorkoutReviewResponse,
  MealReviewResponse,
  WorkoutReviewRequest,
  WorkoutReviewSubmitResponse,
  WorkoutReviewedResponse,
  MealReviewedResponse,
  MealReviewRequest,
  MealReviewSubmitResponse,
} from '@/types/advisorreview';

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

export const submitWorkoutReviewService = async (workoutLogId: string, data: WorkoutReviewRequest) => {
  const url = `${BASE_PATH}/workout/${workoutLogId}/review`;
  console.log('🔵 [SubmitWorkoutReview] Request URL:', url);
  console.log('🔵 [SubmitWorkoutReview] Request data:', data);
  
  const response = await post<WorkoutReviewSubmitResponse>(url, data);
  
  console.log('🟢 [SubmitWorkoutReview] Response:', response);
  console.log('🟢 [SubmitWorkoutReview] Response data:', response.data);
  
  return response;
};

export const getReviewedWorkoutsService = async () => {
  const url = `${BASE_PATH}/workout/reviewed`;
  const response = await get<WorkoutReviewedResponse>(url);
  return response;
};

export const getReviewedMealsService = async () => {
  const url = `${BASE_PATH}/meal/reviewed`;
  const response = await get<MealReviewedResponse>(url);
  return response;
};

export const submitMealReviewService = async (mealLogId: string, data: MealReviewRequest) => {
  const url = `${BASE_PATH}/meal/${mealLogId}/review`;
  const response = await post<MealReviewSubmitResponse>(url, data);
  return response;
};

