export interface FoodLibrarySearchParams {
  query: string;
  pageNumber?: number;
  maxResults?: number;
}

export interface FoodLibraryItem {
  food_id: string;
  food_name: string;
  vietnamese_name: string;
  weight: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  fiber: string;
  sugar: string;
  food_url: string;
}

export interface FoodLibrarySearchResponse {
  foods: FoodLibraryItem[];
}

// Paged foods trong thư viện (GET /api/foodlibrary/paged)
export interface FoodLibraryPagedParams {
  pageNumber?: number;
  pageSize?: number;
  categoryId?: string;
}

export interface FoodLibraryPagedItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  fatSecretFoodId: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    weight: number;
  };
  createdBy: string;
  lastCreate: string;
  lastUpdate: string;
}

export interface FoodLibraryPagedResponse {
  data: FoodLibraryPagedItem[];
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalCount: number;
}

export interface CreateFoodLibraryRequest {
  name: string;
  // Có thể để undefined nếu chưa chọn category hợp lệ (GUID)
  categoryId?: string;
  fatSecretFoodId: string;
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    weight: number;
  };
}


