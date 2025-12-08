import { useQuery } from '@tanstack/react-query'
import { getDiscountTemplatesService } from '@/tanstack/services/discount'
import { DiscountTemplate, DiscountTemplateParams } from '@/types/discount'
import { IApiResponse } from '@/shared/api/http'

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

