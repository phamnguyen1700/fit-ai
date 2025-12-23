import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IApiResponse } from '@/shared/api/http';
import {
  FoodLibrarySearchParams,
  FoodLibrarySearchResponse,
  FoodLibraryPagedParams,
  FoodLibraryPagedResponse,
  CreateFoodLibraryRequest,
  UpdateFoodLibraryRequest,
  FoodLibrarySearchInLibraryParams,
} from '@/types/foodlibrary';
import {
  searchFoodLibraryService,
  getFoodLibraryPagedService,
  createFoodLibraryItemService,
  deleteFoodLibraryItemService,
  updateFoodLibraryItemService,
  searchFoodLibraryInLibraryService,
} from '@/tanstack/services/foodlibrary';
import toast from 'react-hot-toast';
import { APIError } from '@/types/utils/APIError';

interface UseSearchFoodLibraryOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useSearchFoodLibrary = (
  params: FoodLibrarySearchParams,
  options?: UseSearchFoodLibraryOptions,
) => {
  const { enabled = true, staleTime = 2 * 60 * 1000 } = options || {};

  return useQuery<IApiResponse<FoodLibrarySearchResponse>>({
    queryKey: ['foodlibrary-search', params],
    queryFn: () => searchFoodLibraryService(params),
    enabled: enabled && !!params.query,
    staleTime,
  });
};

export const useGetFoodLibraryPaged = (params: FoodLibraryPagedParams) => {
  return useQuery<IApiResponse<FoodLibraryPagedResponse>>({
    queryKey: ['foodlibrary-paged', params],
    queryFn: () => getFoodLibraryPagedService(params),
  });
};

export const useCreateFoodLibraryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFoodLibraryRequest) => createFoodLibraryItemService(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Đã thêm thực phẩm vào thư viện!');
        // Reload danh sách thực phẩm phân trang
        queryClient.invalidateQueries({ queryKey: ['foodlibrary-paged'] });
      } else {
        toast.error(response.message || 'Thêm thực phẩm thất bại');
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Thêm thực phẩm thất bại. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};

export const useSearchFoodLibraryInLibrary = (
  params: FoodLibrarySearchInLibraryParams,
  options?: UseSearchFoodLibraryOptions,
) => {
  const { enabled = true, staleTime = 2 * 60 * 1000 } = options || {};

  return useQuery<IApiResponse<FoodLibraryPagedResponse>>({
    queryKey: ['foodlibrary-search-internal', params],
    queryFn: () => searchFoodLibraryInLibraryService(params),
    enabled: enabled && !!params.query,
    staleTime,
  });
};

export const useDeleteFoodLibraryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteFoodLibraryItemService(id),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Đã xoá thực phẩm khỏi thư viện!');
        queryClient.invalidateQueries({ queryKey: ['foodlibrary-paged'] });
      } else {
        toast.error(response.message || 'Xoá thực phẩm thất bại');
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Xoá thực phẩm thất bại. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};

export const useUpdateFoodLibraryItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateFoodLibraryRequest) => updateFoodLibraryItemService(data),
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Đã cập nhật thực phẩm trong thư viện!');
        queryClient.invalidateQueries({ queryKey: ['foodlibrary-paged'] });
      } else {
        toast.error(response.message || 'Cập nhật thực phẩm thất bại');
      }
    },
    onError: (error: unknown) => {
      const message =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Cập nhật thực phẩm thất bại. Vui lòng thử lại.';
      toast.error(message);
    },
  });
};



