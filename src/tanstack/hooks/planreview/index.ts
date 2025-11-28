import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { IApiResponse } from '@/shared/api/http';
import { PendingPlanResponse, PlanReviewDetailResponse } from '@/types/planreview';
import { getPendingPlansService, getPlanReviewDetailService } from '@/tanstack/services/planreview';

export const usePendingPlans = () => {
  const query = useQuery<IApiResponse<PendingPlanResponse>>({
    queryKey: ['pending-plans'],
    queryFn: () => getPendingPlansService(),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Pending plans success:', query.data);
      console.log('✅ [Hook] Plans array:', query.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Pending plans error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

export const usePlanReviewDetail = (planId?: string) => {
  const query = useQuery<IApiResponse<PlanReviewDetailResponse>>({
    queryKey: ['plan-review-detail', planId],
    queryFn: () => {
      if (!planId) {
        return Promise.reject(new Error('planId is required'));
      }
      return getPlanReviewDetailService(planId);
    },
    enabled: Boolean(planId),
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Plan review detail success:', query.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Plan review detail error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

