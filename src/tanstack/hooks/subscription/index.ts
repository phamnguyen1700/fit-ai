import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { 
  getActiveProductsService, 
  getSubscriptionProductsService,
  createSubscriptionProductService 
} from '@/tanstack/services/subscription'
import { 
  SubscriptionParams, 
  SubscriptionProductsResponse,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse 
} from '@/types/subscription'
import { IApiResponse } from '@/shared/api/http'

export const useGetActiveProducts = (params?: SubscriptionParams) => {
  return useQuery<IApiResponse<SubscriptionProductsResponse>>({
    queryKey: ['activeProducts', params],
    queryFn: () => getActiveProductsService(params),
  })
}

export const useGetSubscriptionProducts = (params?: SubscriptionParams) => {
  return useQuery<IApiResponse<SubscriptionProductsResponse>>({
    queryKey: ['subscriptionProducts', params],
    queryFn: () => getSubscriptionProductsService(params),
  })
}

export const useCreateSubscriptionProduct = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateSubscriptionRequest) => {
      console.log('Creating subscription product with data:', data)
      return createSubscriptionProductService(data)
    },
    onSuccess: (response) => {
      console.log('Create subscription response:', response)
      if (response.success) {
        toast.success(response.message || 'Tạo gói subscription thành công')
        // Refresh the subscription lists
        queryClient.invalidateQueries({ queryKey: ['activeProducts'] })
        queryClient.invalidateQueries({ queryKey: ['subscriptionProducts'] })
      } else {
        toast.error(response.message || 'Tạo gói subscription thất bại')
      }
    },
    onError: (err: any) => {
      console.error('Create subscription error:', err)
      const errorMessage = err?.response?.data?.message || err?.message || 'Tạo gói subscription thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}
