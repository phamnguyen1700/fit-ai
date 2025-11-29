export interface UserSubscriptionTierStats {
  free: number;
  premium: number;
  vip: number;
  total: number;
}

export type UserSubscriptionTierStatsResponse = UserSubscriptionTierStats;

export type UserGrowthPeriod = 'day' | 'month' | 'year';

export interface UserGrowthRatePoint {
  label: string;
  count: number;
}

export interface UserGrowthRateSeries {
  ageGroup: string;
  period: UserGrowthPeriod;
  dataPoints: UserGrowthRatePoint[];
}

export type UserGrowthRateResponse = UserGrowthRateSeries[];

