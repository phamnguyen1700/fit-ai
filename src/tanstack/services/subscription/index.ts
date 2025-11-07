import { get, post, put, del } from '@/shared/api/http'
import { 
  SubscriptionProductsResponse, 
  SubscriptionParams, 
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  CreateSubscriptionResponse 
} from '@/types/subscription'

export const getActiveProductsService = (params?: SubscriptionParams) => 
  get<SubscriptionProductsResponse>(`account/api/subscription/active-products`, { params })

export const getSubscriptionProductsService = (params?: SubscriptionParams) => 
  get<SubscriptionProductsResponse>(`account/api/subscription/products`, { params })

export const createSubscriptionProductService = (data: CreateSubscriptionRequest) => 
  post<CreateSubscriptionResponse>(`account/api/subscription/create-product`, data)

export const updateSubscriptionProductService = (id: string, data: UpdateSubscriptionRequest) => 
  put<CreateSubscriptionResponse>(`account/api/subscription/update-product/${id}`, data)

export const deleteSubscriptionProductService = (id: string) => 
  del(`account/api/subscription/delete-product/${id}`)
