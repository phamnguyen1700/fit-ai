// Note: Install @tanstack/react-query for production use
// npm install @tanstack/react-query
import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query';
import { planService } from '../service';
import { Plan, CreatePlanRequest, UpdatePlanRequest } from '../types';
import { planQueryKeys } from '../queries/queryKeys';
import { queryClient } from '@/lib/queryClient';
// import { toast } from 'react-toastify'; // Uncomment when installing react-toastify

// Query Hooks
export const usePlans = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: planQueryKeys.list(params),
    queryFn: () => planService.getPlans(params),
    placeholderData: keepPreviousData,
  });
};

export const usePlan = (id: string) => {
  return useQuery({
    queryKey: planQueryKeys.detail(id),
    queryFn: () => planService.getPlanById(id),
    enabled: !!id,
  });
};

// Mutation Hooks
export const useCreatePlanMutation = () => {
  return useMutation({
    mutationFn: (payload: CreatePlanRequest) => planService.createPlan(payload),
    onSuccess: () => {
      // toast.success('Tạo gói tập thành công');
      queryClient.invalidateQueries({ queryKey: planQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Tạo gói tập thất bại');
    },
  });
};

export const useUpdatePlanMutation = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdatePlanRequest }) => 
      planService.updatePlan({ ...payload, id }),
    onSuccess: (_: any, variables: { id: string; payload: UpdatePlanRequest }) => {
      // toast.success('Cập nhật gói tập thành công');
      queryClient.invalidateQueries({ queryKey: planQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: planQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Cập nhật gói tập thất bại');
    },
  });
};

export const useDeletePlanMutation = () => {
  return useMutation({
    mutationFn: (id: string) => planService.deletePlan(id),
    onSuccess: () => {
      // toast.success('Xóa gói tập thành công');
      queryClient.invalidateQueries({ queryKey: planQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Xóa gói tập thất bại');
    },
  });
};

export const useTogglePlanStatusMutation = () => {
  return useMutation({
    mutationFn: (id: string) => planService.togglePlanStatus(id),
    onSuccess: (_: any, variables: string) => {
      // toast.success('Cập nhật trạng thái gói tập thành công');
      queryClient.invalidateQueries({ queryKey: planQueryKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: planQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Cập nhật trạng thái gói tập thất bại');
    },
  });
};