import { get, post } from '@/shared/api/http'
import { 
  SubscriptionProductsResponse, 
  SubscriptionParams, 
  CreateSubscriptionRequest,
  CreateSubscriptionResponse 
} from '@/types/subscription'

export const getActiveProductsService = (params?: SubscriptionParams) => 
  get<SubscriptionProductsResponse>(`account/api/subscription/active-products`, { params })

export const getSubscriptionProductsService = (params?: SubscriptionParams) => 
  get<SubscriptionProductsResponse>(`account/api/subscription/products`, { params })

export const createSubscriptionProductService = (data: CreateSubscriptionRequest) => 
  post<CreateSubscriptionResponse>(`account/api/subscription/create-product`, data)
