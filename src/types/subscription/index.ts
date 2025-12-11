export interface SubscriptionProduct {
  productId: string;
  priceId: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
  isActive: boolean;
  id: string;
  lastCreate: string;
  lastUpdate: string;
}

export type SubscriptionProductsResponse = SubscriptionProduct[];

export interface SubscriptionParams {
  isActive?: boolean;
  search?: string;
}

export interface CreateSubscriptionRequest {
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
}

export interface UpdateSubscriptionRequest {
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
}

export interface CreateSubscriptionResponse {
  productId: string;
  priceId: string;
  name: string;
  description: string;
  amount: number;
  currency: string;
  interval: string;
  isActive: boolean;
  id: string;
  lastCreate: string;
  lastUpdate: string;
}
