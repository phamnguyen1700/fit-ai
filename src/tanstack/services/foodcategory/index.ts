import { get } from '@/shared/api/http';
import type { FoodCategory } from '@/types/foodcategory';

const FOODLIB_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export const getFoodCategoriesService = () => {
  return get<FoodCategory[]>(`${FOODLIB_BASE_URL}/api/foodcategory`);
};
