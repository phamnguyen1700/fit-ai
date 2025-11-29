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

export interface RevenueStats {
  totalRevenue: number;
  revenueThisMonth: number;
  revenueToday: number;
  totalPayments: number;
  paymentsThisMonth: number;
  averagePayment: number;
  currency: string;
  [key: string]: number | string;
}

export type RevenueStatsResponse = RevenueStats;

export interface UserSubscriptionStatusStats {
  approved: number;
  pending: number;
  underReview: number;
  rejected: number;
  total: number;
  [key: string]: number;
}

export type UserSubscriptionStatusStatsResponse = UserSubscriptionStatusStats;

export type RevenueTrendPeriod = 'day' | 'month' | 'year';

export interface RevenueTrendPoint {
  label: string;
  revenue: number;
  paymentCount: number;
}

export type RevenueTrendResponse = RevenueTrendPoint[];

