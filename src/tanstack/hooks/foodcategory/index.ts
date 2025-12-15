import { useQuery } from '@tanstack/react-query';
import type { IApiResponse } from '@/shared/api/http';
import type { FoodCategory } from '@/types/foodcategory';
import { getFoodCategoriesService } from '@/tanstack/services/foodcategory';

export const useGetFoodCategories = (enabled = true) => {
  return useQuery<IApiResponse<FoodCategory[]>>({
    queryKey: ['food-categories'],
    queryFn: () => getFoodCategoriesService(),
    enabled,
    staleTime: 10 * 60 * 1000,
  });
};
