import { useQuery } from '@tanstack/react-query';

import { IApiResponse } from '@/shared/api/http';
import {
  getUserGrowthRateService,
  getUserSubscriptionTierStatsService,
} from '@/tanstack/services/analytics';
import {
  UserGrowthPeriod,
  UserGrowthRateResponse,
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

