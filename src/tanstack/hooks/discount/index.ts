import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDiscountTemplatesService, updateDiscountTemplateService } from '@/tanstack/services/discount'
import { DiscountTemplate, DiscountTemplateParams, UpdateDiscountTemplateRequest } from '@/types/discount'
import { IApiResponse } from '@/shared/api/http'
import toast from 'react-hot-toast'
import { APIError } from '@/types/utils/APIError'

interface UseGetDiscountTemplatesOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useGetDiscountTemplates = (params?: DiscountTemplateParams, options?: UseGetDiscountTemplatesOptions) => {
  const { enabled = true, staleTime = 5 * 60 * 1000 } = options || {};
  
  return useQuery<IApiResponse<DiscountTemplate[]>>({
    queryKey: ['discountTemplates', params],
    queryFn: () => getDiscountTemplatesService(params),
    enabled,
    staleTime,
  })
}

export const useUpdateDiscountTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ discountId, data }: { discountId: string; data: UpdateDiscountTemplateRequest }) => {
      return updateDiscountTemplateService(discountId, data);
    },
    onSuccess: (response) => {
      if (response.success) {
        toast.success('Cập nhật voucher thành công! 🎉');
        // Invalidate và refetch discount templates
        queryClient.invalidateQueries({ queryKey: ['discountTemplates'] });
      } else {
        toast.error(response.message || 'Cập nhật voucher thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Update discount template error:', error);
      const errorMessage =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Cập nhật voucher thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
}

