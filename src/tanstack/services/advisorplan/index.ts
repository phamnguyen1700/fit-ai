import { get, put } from '@/shared/api/http';
import type {
  ActivePlanResponse,
  WorkoutDetailsResponse,
  MealDetailsResponse,
  GetWorkoutDetailsParams,
  GetMealDetailsParams,
  UpdateMealPlanParams,
  UpdateMealPlanResponse,
  UpdateWorkoutExerciseParams,
  UpdateWorkoutExerciseResponse,
} from '@/types/advisorplan';

const BASE_PATH = 'api/advisorplan';

/**
 * Get active plan of customer
 */
export const getActivePlanService = async (userId: string) => {
  const url = `${BASE_PATH}/${userId}`;
  const response = await get<ActivePlanResponse>(url);
  return response;
};

/**
 * Get workout details of the active plan
 * checkpointNumber: optional (if not provided → use currentCheckpointNumber)
 * dayNumber: optional (if not provided → return all days)
 */
export const getWorkoutDetailsService = async (params: GetWorkoutDetailsParams) => {
  const { userId, checkpointNumber, dayNumber } = params;
  const url = `${BASE_PATH}/${userId}/workouts`;
  
  const queryParams: Record<string, string | number> = {};
  if (checkpointNumber !== undefined) {
    queryParams.checkpointNumber = checkpointNumber;
  }
  if (dayNumber !== undefined) {
    queryParams.dayNumber = dayNumber;
  }

  const response = await get<WorkoutDetailsResponse>(url, {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });
  return response;
};

/**
 * Get meal details of the active plan
 * checkpointNumber: optional (if not provided → use currentCheckpointNumber)
 * dayNumber: optional (if not provided → return all days)
 */
export const getMealDetailsService = async (params: GetMealDetailsParams) => {
  const { userId, checkpointNumber, dayNumber } = params;
  const url = `${BASE_PATH}/${userId}/meals`;
  
  const queryParams: Record<string, string | number> = {};
  if (checkpointNumber !== undefined) {
    queryParams.checkpointNumber = checkpointNumber;
  }
  if (dayNumber !== undefined) {
    queryParams.dayNumber = dayNumber;
  }

  const response = await get<MealDetailsResponse>(url, {
    params: Object.keys(queryParams).length > 0 ? queryParams : undefined,
  });
  return response;
};

/**
 * Update meals of a specific day
 * checkpointNumber: required (query param)
 */
export const updateMealPlanService = async (params: UpdateMealPlanParams) => {
  const { userId, dayNumber, checkpointNumber, data } = params;
  const url = `${BASE_PATH}/${userId}/meals/${dayNumber}`;
  
  const response = await put<UpdateMealPlanResponse>(url, data, {
    params: { checkpointNumber },
  });
  return response;
};

/**
 * Update an exercise in a workout
 * Replaces oldExerciseId with newExercise
 */
export const updateWorkoutExerciseService = async (params: UpdateWorkoutExerciseParams) => {
  const { userId, workoutDetailId, data } = params;
  const url = `${BASE_PATH}/${userId}/workouts/${workoutDetailId}/exercise`;
  
  const response = await put<UpdateWorkoutExerciseResponse>(url, data);
  return response;
};

