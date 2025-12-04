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

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || '';

export const getUserSubscriptionTierStatsService = () =>
  get<UserSubscriptionTierStatsResponse>(
    `${ACCOUNT_BASE_URL}/api/analytics/user-subscription-tier-stats`,
  );

export const getUserGrowthRateService = (period: UserGrowthPeriod = 'day') =>
  get<UserGrowthRateResponse>(`${ACCOUNT_BASE_URL}/api/analytics/user-growth-rate`, {
    params: { period },
  });

export const getRevenueStatsService = () =>
  get<RevenueStatsResponse>(`${ACCOUNT_BASE_URL}/api/analytics/revenue-stats`);

export const getUserSubscriptionStatusStatsService = () =>
  get<UserSubscriptionStatusStatsResponse>(
    `${ACCOUNT_BASE_URL}/api/analytics/user-subscription-stats`,
  );

export const getRevenueTrendService = (period: RevenueTrendPeriod = 'month') =>
  get<RevenueTrendResponse>(`${ACCOUNT_BASE_URL}/api/analytics/revenue-trend`, {
    params: { period },
  });

