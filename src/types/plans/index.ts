export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in days
  features: string[];
  isActive: boolean;
  isPopular?: boolean;
  createdAt: string;
  updatedAt: string;
  imageUrl?: string;
  category: 'basic' | 'premium' | 'enterprise';
  maxUsers?: number;
  storageLimit?: number; // in GB
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  category: 'basic' | 'premium' | 'enterprise';
  maxUsers?: number;
  storageLimit?: number;
  imageUrl?: string;
}

export interface UpdatePlanRequest {
  id: string;
  name?: string;
  description?: string;
  price?: number;
  duration?: number;
  features?: string[];
  isActive?: boolean;
  isPopular?: boolean;
  category?: 'basic' | 'premium' | 'enterprise';
  maxUsers?: number;
  storageLimit?: number;
  imageUrl?: string;
}

export interface PlanFilters {
  category?: 'basic' | 'premium' | 'enterprise';
  isActive?: boolean;
  isPopular?: boolean;
  priceMin?: number;
  priceMax?: number;
  search?: string;
}

export interface PlanStats {
  total: number;
  active: number;
  inactive: number;
  popular: number;
  averagePrice: number;
  byCategory: Record<string, number>;
}
