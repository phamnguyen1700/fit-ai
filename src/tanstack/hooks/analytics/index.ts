import { useQuery } from '@tanstack/react-query';

import { IApiResponse } from '@/shared/api/http';
import {
  getRevenueStatsService,
  getRevenueTrendService,
  getUserGrowthRateService,
  getUserSubscriptionStatusStatsService,
  getUserSubscriptionTierStatsService,
} from '@/tanstack/services/analytics';
import {
  RevenueStatsResponse,
  RevenueTrendPeriod,
  RevenueTrendResponse,
  UserGrowthPeriod,
  UserGrowthRateResponse,
  UserSubscriptionStatusStatsResponse,
  UserSubscriptionTierStatsResponse,
} from '@/types/analytics';

export const useUserSubscriptionTierStats = () =>
  useQuery<IApiResponse<UserSubscriptionTierStatsResponse>>({
    queryKey: ['userSubscriptionTierStats'],
    queryFn: getUserSubscriptionTierStatsService,
  });

export const useUserGrowthRate = (period: UserGrowthPeriod = 'day') =>
  useQuery<IApiResponse<UserGrowthRateResponse>>({
    queryKey: ['userGrowthRate', period],
    queryFn: () => getUserGrowthRateService(period),
  });

export const useRevenueStats = () =>
  useQuery<IApiResponse<RevenueStatsResponse>>({
    queryKey: ['revenueStats'],
    queryFn: getRevenueStatsService,
  });

export const useUserSubscriptionStatusStats = () =>
  useQuery<IApiResponse<UserSubscriptionStatusStatsResponse>>({
    queryKey: ['userSubscriptionStatusStats'],
    queryFn: getUserSubscriptionStatusStatsService,
  });

export const useRevenueTrend = (period: RevenueTrendPeriod = 'month') =>
  useQuery<IApiResponse<RevenueTrendResponse>>({
    queryKey: ['revenueTrend', period],
    queryFn: () => getRevenueTrendService(period),
  });

