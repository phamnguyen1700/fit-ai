import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { IApiResponse } from '@/shared/api/http';
import {
  AdvisorDashboardCustomersParams,
  AdvisorDashboardCustomersResponse,
  AdvisorDashboardCustomerDetailResponse,
  CustomerProfileResponse,
} from '@/types/advisordashboard';
import { getAdvisorDashboardCustomersService, getCustomerDetailService, getCustomerProfileService } from '@/tanstack/services/advisordashboard';

export const useAdvisorDashboardCustomers = (params: AdvisorDashboardCustomersParams) => {
  const query = useQuery<IApiResponse<AdvisorDashboardCustomersResponse>>({
    queryKey: ['advisor-dashboard-customers', params],
    queryFn: () => getAdvisorDashboardCustomersService(params),
    enabled: Boolean(params?.month && params?.year),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Query success:', query.data);
      console.log('✅ [Hook] Customers:', query.data?.data?.customers);
    }
    if (query.error) {
      console.error('❌ [Hook] Query error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

export const useCustomerDetail = (userId?: string) => {
  const query = useQuery<IApiResponse<AdvisorDashboardCustomerDetailResponse>>({
    queryKey: ['customer-detail', userId],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error('UserId is required'));
      }
      return getCustomerDetailService(userId);
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Customer detail success:', query.data);
      console.log('✅ [Hook] Customer detail data:', query.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Customer detail error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

export const useCustomerProfile = (userId?: string) => {
  const query = useQuery<IApiResponse<CustomerProfileResponse>>({
    queryKey: ['customer-profile', userId],
    queryFn: () => {
      if (!userId) {
        return Promise.reject(new Error('UserId is required'));
      }
      return getCustomerProfileService(userId);
    },
    enabled: Boolean(userId),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Customer profile success:', query.data);
      console.log('✅ [Hook] Customer profile data:', query.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Customer profile error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

