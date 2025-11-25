import { get } from '@/shared/api/http';
import { PendingPlanResponse, PlanReviewDetailResponse } from '@/types/planreview';

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

