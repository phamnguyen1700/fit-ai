import { get, post, put, del } from '@/shared/api/http';
import { Policy, PolicyParams, CreatePolicyRequest, UpdatePolicyRequest } from '@/types/policy';

export const getPoliciesService = (params?: PolicyParams) =>
  get<Policy[]>('account/api/policy', {
    params,
  });

export const createPolicyService = (data: CreatePolicyRequest) =>
  post<Policy>('account/api/policy', data);

export const updatePolicyService = (id: string, data: UpdatePolicyRequest) =>
  put<Policy>(`account/api/policy/${id}`, data);

export const deletePolicyService = (id: string) =>
  del<{ success: boolean }>(`account/api/policy/${id}`);

