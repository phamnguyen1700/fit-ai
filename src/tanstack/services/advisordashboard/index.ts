import { get } from '@/shared/api/http';
import {
  AdvisorDashboardCustomersParams,
  AdvisorDashboardCustomersResponse,
  AdvisorDashboardCustomerDetailResponse,
  CustomerProfileResponse,
} from '@/types/advisordashboard';

const BASE_PATH = 'fitness/api/advisordashboard';

const mapParamsToApiPayload = (params: AdvisorDashboardCustomersParams) => ({
  Month: params.month,
  Year: params.year,
  Page: params.page ?? 1,
  PageSize: params.pageSize ?? 20,
});

export const getAdvisorDashboardCustomersService = async (params: AdvisorDashboardCustomersParams) => {
  const apiParams = mapParamsToApiPayload(params);
  const url = `${BASE_PATH}/customers`;
  const response = await get<AdvisorDashboardCustomersResponse>(url, {
    params: apiParams,
  });
  return response;
};

export const getCustomerDetailService = async (userId: string) => {
  const url = `${BASE_PATH}/customers/${userId}`;
  const response = await get<AdvisorDashboardCustomerDetailResponse>(url);
  return response;
};

export const getCustomerProfileService = async (userId: string) => {
  const url = `${BASE_PATH}/customers/${userId}/profile`;
  const response = await get<CustomerProfileResponse>(url);
  return response;
};

