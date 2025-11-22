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
  
  console.log('🔵 [AdvisorDashboard] Request params:', apiParams);
  console.log('🔵 [AdvisorDashboard] Request URL:', url);
  
  const response = await get<AdvisorDashboardCustomersResponse>(url, {
    params: apiParams,
  });
  
  console.log('🟢 [AdvisorDashboard] Response:', response);
  console.log('🟢 [AdvisorDashboard] Response data:', response.data);
  console.log('🟢 [AdvisorDashboard] Customers count:', response.data?.customers?.length ?? 0);
  
  return response;
};

export const getCustomerDetailService = async (userId: string) => {
  const url = `${BASE_PATH}/customers/${userId}`;
  
  console.log('🔵 [CustomerDetail] Request URL:', url);
  console.log('🔵 [CustomerDetail] UserId:', userId);
  
  const response = await get<AdvisorDashboardCustomerDetailResponse>(url);
  
  console.log('🟢 [CustomerDetail] Response:', response);
  console.log('🟢 [CustomerDetail] Response data:', response.data);
  
  return response;
};

export const getCustomerProfileService = async (userId: string) => {
  const url = `${BASE_PATH}/customers/${userId}/profile`;
  
  console.log('🔵 [CustomerProfile] Request URL:', url);
  console.log('🔵 [CustomerProfile] UserId:', userId);
  
  const response = await get<CustomerProfileResponse>(url);
  
  console.log('🟢 [CustomerProfile] Response:', response);
  console.log('🟢 [CustomerProfile] Response data:', response.data);
  
  return response;
};

