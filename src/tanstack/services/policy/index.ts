import { get, post, put, del } from '@/shared/api/http';
import { Policy, PolicyParams, CreatePolicyRequest, UpdatePolicyRequest } from '@/types/policy';

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || '';

export const getPoliciesService = (params?: PolicyParams) =>
  get<Policy[]>(`${ACCOUNT_BASE_URL}/api/policy`, {
    params,
  });

export const createPolicyService = (data: CreatePolicyRequest) =>
  post<Policy>(`${ACCOUNT_BASE_URL}/api/policy`, data);

export const updatePolicyService = (id: string, data: UpdatePolicyRequest) =>
  put<Policy>(`${ACCOUNT_BASE_URL}/api/policy/${id}`, data);

export const deletePolicyService = (id: string) =>
  del<{ success: boolean }>(`${ACCOUNT_BASE_URL}/api/policy/${id}`);

