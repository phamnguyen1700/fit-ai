// Plans Types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // months
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePlanRequest {
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
}

export interface UpdatePlanRequest extends CreatePlanRequest {
  id: string;
}

export interface PlanFilters {
  status?: 'all' | 'active' | 'inactive';
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  search?: string;
}

export interface PlanStats {
  totalPlans: number;
  activePlans: number;
  inactivePlans: number;
  totalRevenue: number;
  averagePrice: number;
}
