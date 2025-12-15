import { get, post, del } from '@/shared/api/http';
import {
  FoodLibrarySearchParams,
  FoodLibrarySearchResponse,
  FoodLibraryPagedParams,
  FoodLibraryPagedResponse,
  CreateFoodLibraryRequest,
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

export const createFoodLibraryItemService = (data: CreateFoodLibraryRequest) => {
  return post<void>(`${FOODLIB_BASE_URL}/api/foodlibrary`, data);
};

export const deleteFoodLibraryItemService = (id: string) => {
  return del<void>(`${FOODLIB_BASE_URL}/api/foodlibrary/${id}`);
};


