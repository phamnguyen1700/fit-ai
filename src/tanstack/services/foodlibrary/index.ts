import { get, post, del, put } from '@/shared/api/http';
import {
  FoodLibrarySearchParams,
  FoodLibrarySearchResponse,
  FoodLibraryPagedParams,
  FoodLibraryPagedResponse,
  CreateFoodLibraryRequest,
  UpdateFoodLibraryRequest,
  FoodLibrarySearchInLibraryParams,
} from '@/types/foodlibrary';

const FOODLIB_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const searchFoodLibraryService = (params: FoodLibrarySearchParams) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

  // API dùng POST với query params, body rỗng
  return post<FoodLibrarySearchResponse>(
    `${FOODLIB_BASE_URL}/api/foodlibrary/search-fatsecret-raw`,
    null,
    {
      params: cleanedParams,
    },
  );
};

export const getFoodLibraryPagedService = (params: FoodLibraryPagedParams) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

  return get<FoodLibraryPagedResponse>(
    `${FOODLIB_BASE_URL}/api/foodlibrary/paged`,
    {
      params: cleanedParams,
    },
  );
};

// Search trong chính thư viện nội bộ (GET /api/foodlibrary/search)
export const searchFoodLibraryInLibraryService = (params: FoodLibrarySearchInLibraryParams) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== '',
    ),
  );

  return get<FoodLibraryPagedResponse>(
    `${FOODLIB_BASE_URL}/api/foodlibrary/search`,
    {
      params: cleanedParams,
    },
  );
};

export const createFoodLibraryItemService = (data: CreateFoodLibraryRequest) => {
  return post<void>(`${FOODLIB_BASE_URL}/api/foodlibrary`, data);
};

export const deleteFoodLibraryItemService = (id: string) => {
  return del<void>(`${FOODLIB_BASE_URL}/api/foodlibrary/${id}`);
};

export const updateFoodLibraryItemService = (data: UpdateFoodLibraryRequest) => {
  // Backend expects both route param {id} and id in body, nên gửi full object
  return put<void>(`${FOODLIB_BASE_URL}/api/foodlibrary/${data.id}`, data);
};


