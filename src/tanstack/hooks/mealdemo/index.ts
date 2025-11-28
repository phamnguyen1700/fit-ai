import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createMealDemoService, getMealDemoListService, updateMealDemoAllService, getMealDemoDetailService, updateMealDemoDetailService, deleteMealDemoService, hardDeleteMealDemoService, updateMealDemoService } from '@/tanstack/services/mealdemo';
import type {
  CreateMealDemoPayload,
  CreateMealDemoResponse,
  MealDemoListParams,
  MealDemoListResponse,
  UpdateMealDemoPayload,
  UpdateMealDemoResponse,
  UpdateMealDemoAllPayload,
  UpdateMealDemoAllResponse,
  UpdateMealDemoDetailPayload,
  UpdateMealDemoDetailResponse,
  MealDemoDetailResponse,
} from '@/types/mealdemo';
import type { IApiResponse } from '@/shared/api/http';
import toast from 'react-hot-toast';
import { APIError } from '@/types/utils/APIError';

export const MEAL_DEMO_QUERY_KEY = 'meal-demo-list';
export const MEAL_DEMO_DETAIL_QUERY_KEY = 'meal-demo-detail';

export const useGetMealDemoList = (params?: MealDemoListParams) => {
  return useQuery<IApiResponse<MealDemoListResponse>>({
    queryKey: [MEAL_DEMO_QUERY_KEY, params],
    queryFn: async () => {
      const response = await getMealDemoListService(params);
      console.log('meal data', response);
      if (!response.success) {
        throw new Error(response.message || 'Không thể tải danh sách thực đơn mẫu');
      }

      return response;
    },
    staleTime: 5 * 60 * 1000,
  });
};

interface UseGetMealDemoDetailOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useGetMealDemoDetail = (mealDemoId?: string, options?: UseGetMealDemoDetailOptions) => {
  return useQuery<IApiResponse<MealDemoDetailResponse>>({
    queryKey: [MEAL_DEMO_DETAIL_QUERY_KEY, mealDemoId],
    queryFn: async () => {
      if (!mealDemoId) {
        throw new Error('mealDemoId is required');
      }
      const response = await getMealDemoDetailService(mealDemoId);
      if (!response.success) {
        throw new Error(response.message || 'Không thể tải chi tiết thực đơn mẫu');
      }
      return response;
    },
    enabled: Boolean(mealDemoId) && (options?.enabled ?? true),
    staleTime: options?.staleTime ?? 5 * 60 * 1000,
  });
};

export const useCreateMealDemo = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<CreateMealDemoResponse>, unknown, CreateMealDemoPayload>({
    mutationFn: (payload) => createMealDemoService(payload),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Tạo thực đơn mẫu thành công!');
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_QUERY_KEY] });
      } else {
        toast.error(response.message || 'Tạo thực đơn mẫu thất bại');
      }
    },
    onError: (error: unknown) => {
      const message = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Không thể tạo thực đơn mẫu. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};

export const useUpdateMealDemo = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<UpdateMealDemoResponse>, unknown, { mealDemoId: string; payload: UpdateMealDemoPayload }>({
    mutationFn: ({ mealDemoId, payload }) => updateMealDemoService(mealDemoId, payload),
    onSuccess: (response, variables) => {
      if (response.success) {
        toast.success('Cập nhật kế hoạch dinh dưỡng thành công!');
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_DETAIL_QUERY_KEY, variables.mealDemoId] });
      } else {
        toast.error(response.message || 'Cập nhật kế hoạch dinh dưỡng thất bại');
      }
    },
    onError: (error: unknown) => {
      const message = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Cập nhật kế hoạch dinh dưỡng thất bại. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};

export const useUpdateMealDemoAll = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<UpdateMealDemoAllResponse>, unknown, { mealDemoId: string; payload: UpdateMealDemoAllPayload }>({
    mutationFn: ({ mealDemoId, payload }) => updateMealDemoAllService(mealDemoId, payload),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Cập nhật thực đơn mẫu thành công!');
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_QUERY_KEY] });
      } else {
        toast.error(response.message || 'Cập nhật thực đơn mẫu thất bại');
      }
    },
    onError: (error: unknown) => {
      const message = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Không thể cập nhật thực đơn mẫu. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};

export const useUpdateMealDemoDetail = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<UpdateMealDemoDetailResponse>, unknown, { id: string; payload: UpdateMealDemoDetailPayload }>({
    mutationFn: ({ id, payload }) => {
      console.log('Update meal demo detail - URL:', `fitness/api/mealdemodetail/${id}`);
      console.log('Update meal demo detail - Payload:', payload);
      return updateMealDemoDetailService(id, payload);
    },
    onSuccess: (response) => {
      console.log('Update meal demo detail - Response:', response);
      if (response.success) {
        toast.success('Cập nhật chi tiết thực đơn mẫu thành công!');
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_DETAIL_QUERY_KEY] });
      } else {
        toast.error(response.message || 'Cập nhật chi tiết thực đơn mẫu thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Update meal demo detail - Error:', error);
      const message = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Không thể cập nhật chi tiết thực đơn mẫu. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};

export const useDeleteMealDemo = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<{ success: boolean; message: string }>, unknown, string>({
    mutationFn: (id) => {
      console.log('Delete meal demo - URL:', `fitness/api/mealdemo/${id}`);
      return deleteMealDemoService(id);
    },
    onSuccess: (response) => {
      console.log('Delete meal demo - Response:', response);
      if (response.success) {
        toast.success('Vô hiệu hóa thực đơn mẫu thành công!');
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_DETAIL_QUERY_KEY] });
      } else {
        toast.error(response.message || 'Vô hiệu hóa thực đơn mẫu thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Delete meal demo - Error:', error);
      const message = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Không thể vô hiệu hóa thực đơn mẫu. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};

export const useHardDeleteMealDemo = () => {
  const queryClient = useQueryClient();

  return useMutation<IApiResponse<{ success: boolean; message: string }>, unknown, string>({
    mutationFn: (id) => {
      console.log('Hard delete meal demo - URL:', `fitness/api/mealdemo/${id}/hard`);
      return hardDeleteMealDemoService(id);
    },
    onSuccess: (response) => {
      console.log('Hard delete meal demo - Response:', response);
      if (response.success) {
        toast.success('Xóa vĩnh viễn thực đơn mẫu thành công!');
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_QUERY_KEY] });
        queryClient.invalidateQueries({ queryKey: [MEAL_DEMO_DETAIL_QUERY_KEY] });
      } else {
        toast.error(response.message || 'Xóa vĩnh viễn thực đơn mẫu thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Hard delete meal demo - Error:', error);
      const message = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Không thể xóa vĩnh viễn thực đơn mẫu. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};
