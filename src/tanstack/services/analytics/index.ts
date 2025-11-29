import { get } from '@/shared/api/http';
import {
  UserGrowthPeriod,
  UserGrowthRateResponse,
  UserSubscriptionTierStatsResponse,
} from '@/types/analytics';

export const getUserSubscriptionTierStatsService = () =>
  get<UserSubscriptionTierStatsResponse>('account/api/analytics/user-subscription-tier-stats');

export const getUserGrowthRateService = (period: UserGrowthPeriod = 'day') =>
  get<UserGrowthRateResponse>('account/api/analytics/user-growth-rate', {
    params: { period },
  });

