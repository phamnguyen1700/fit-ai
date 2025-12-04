import { get, post, put, del } from '@/shared/api/http'
import {
  SubscriptionProductsResponse,
  SubscriptionParams,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  CreateSubscriptionResponse,
} from '@/types/subscription'

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || ''

export const getActiveProductsService = (params?: SubscriptionParams) =>
  get<SubscriptionProductsResponse>(`${ACCOUNT_BASE_URL}/api/subscription/active-products`, {
    params,
  })

export const getSubscriptionProductsService = (params?: SubscriptionParams) =>
  get<SubscriptionProductsResponse>(`${ACCOUNT_BASE_URL}/api/subscription/products`, { params })

export const createSubscriptionProductService = (data: CreateSubscriptionRequest) =>
  post<CreateSubscriptionResponse>(`${ACCOUNT_BASE_URL}/api/subscription/create-product`, data)

export const updateSubscriptionProductService = (
  id: string,
  data: UpdateSubscriptionRequest,
) => put<CreateSubscriptionResponse>(`${ACCOUNT_BASE_URL}/api/subscription/update-product/${id}`, data)

export const deleteSubscriptionProductService = (id: string) =>
  del(`${ACCOUNT_BASE_URL}/api/subscription/delete-product/${id}`)
