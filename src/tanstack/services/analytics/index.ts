import { get } from '@/shared/api/http';
import {
  RevenueStatsResponse,
  RevenueTrendPeriod,
  RevenueTrendResponse,
  UserGrowthPeriod,
  UserGrowthRateResponse,
  UserSubscriptionStatusStatsResponse,
  UserSubscriptionTierStatsResponse,
} from '@/types/analytics';

export const getUserSubscriptionTierStatsService = () =>
  get<UserSubscriptionTierStatsResponse>('account/api/analytics/user-subscription-tier-stats');

export const getUserGrowthRateService = (period: UserGrowthPeriod = 'day') =>
  get<UserGrowthRateResponse>('account/api/analytics/user-growth-rate', {
    params: { period },
  });

export const getRevenueStatsService = () =>
  get<RevenueStatsResponse>('account/api/analytics/revenue-stats');

export const getUserSubscriptionStatusStatsService = () =>
  get<UserSubscriptionStatusStatsResponse>('account/api/analytics/user-subscription-stats');

export const getRevenueTrendService = (period: RevenueTrendPeriod = 'month') =>
  get<RevenueTrendResponse>('account/api/analytics/revenue-trend', {
    params: { period },
  });

