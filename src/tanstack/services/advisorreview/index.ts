import { get, post } from '@/shared/api/http';
import { WorkoutReviewResponse, MealReviewResponse, WorkoutReviewRequest, WorkoutReviewSubmitResponse } from '@/types/advisorreview';

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

