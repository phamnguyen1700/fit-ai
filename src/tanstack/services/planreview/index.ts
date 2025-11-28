import { get, post, put } from '@/shared/api/http';
import {
  PendingPlanResponse,
  PlanReviewDetailResponse,
  WorkoutPlanDetail,
  MealPlanDetail,
} from '@/types/planreview';

const BASE_PATH = 'fitness/api/planreview';

export const getPendingPlansService = async () => {
  const url = `${BASE_PATH}/pending`;
  const response = await get<PendingPlanResponse>(url);
  return response;
};

export const getPlanReviewDetailService = async (planId: string) => {
  const url = `${BASE_PATH}/${planId}`;
  const response = await get<PlanReviewDetailResponse>(url);
  return response;
};

export const approvePlanService = async (planId: string) => {
  const url = `${BASE_PATH}/${planId}/approve`;
  const response = await post(url);
  return response;
};

export const updatePlanWorkoutService = async (planId: string, payload: WorkoutPlanDetail['days']) => {
  const url = `${BASE_PATH}/${planId}/workout`;
  const response = await put(url, payload);
  return response;
};

export const updatePlanMealService = async (planId: string, payload: MealPlanDetail['days']) => {
  const url = `${BASE_PATH}/${planId}/meal`;
  const response = await put(url, payload);
  return response;
};

