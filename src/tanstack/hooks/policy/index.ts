import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPoliciesService, createPolicyService, updatePolicyService, deletePolicyService } from '@/tanstack/services/policy';
import { Policy, PolicyParams, CreatePolicyRequest, UpdatePolicyRequest } from '@/types/policy';
import { IApiResponse } from '@/shared/api/http';
import toast from 'react-hot-toast';
import { APIError } from '@/types/utils/APIError';

export const useGetPolicies = (params?: PolicyParams) => {
  return useQuery<IApiResponse<Policy[]>>({
    queryKey: ['policies', params],
    queryFn: () => getPoliciesService(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePolicyRequest) => {
      console.log('Creating policy:', data);
      return createPolicyService(data);
    },
    onSuccess: (response) => {
      console.log('Create policy success:', response);
      if (response.success) {
        toast.success('Tạo policy thành công! 🎉');
        // Invalidate và refetch policies
        queryClient.invalidateQueries({ queryKey: ['policies'] });
      } else {
        toast.error(response.message || 'Tạo policy thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Create policy error:', error);
      const errorMessage =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Tạo policy thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

export const useUpdatePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePolicyRequest }) => {
      console.log('Updating policy:', id, data);
      return updatePolicyService(id, data);
    },
    onSuccess: (response) => {
      console.log('Update policy success:', response);
      if (response.success) {
        toast.success('Cập nhật policy thành công! 🎉');
        // Invalidate và refetch policies
        queryClient.invalidateQueries({ queryKey: ['policies'] });
      } else {
        toast.error(response.message || 'Cập nhật policy thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Update policy error:', error);
      const errorMessage =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Cập nhật policy thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

export const useDeletePolicy = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => {
      console.log('Deleting policy:', id);
      return deletePolicyService(id);
    },
    onSuccess: (response) => {
      console.log('Delete policy success:', response);
      if (response.success) {
        toast.success('Xóa policy thành công! 🎉');
        // Invalidate và refetch policies
        queryClient.invalidateQueries({ queryKey: ['policies'] });
      } else {
        toast.error(response.message || 'Xóa policy thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Delete policy error:', error);
      const errorMessage =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Xóa policy thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};

