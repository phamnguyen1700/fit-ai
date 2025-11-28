import { useQuery } from "@tanstack/react-query";
import { IApiResponse } from "@/shared/api/http";
import {
  MealIngredientSearchParams,
  MealIngredientSearchResponse,
} from "@/types/mealingredient";
import { searchMealIngredientsService } from "@/tanstack/services/mealingredient";

interface UseSearchMealIngredientsOptions {
  enabled?: boolean;
  staleTime?: number;
}

export const useSearchMealIngredients = (
  params: MealIngredientSearchParams,
  options?: UseSearchMealIngredientsOptions
) => {
  const { enabled = true, staleTime = 2 * 60 * 1000 } = options || {};

  return useQuery<IApiResponse<MealIngredientSearchResponse>>({
    queryKey: ["meal-ingredients-search", params],
    queryFn: () => searchMealIngredientsService(params),
    enabled,
    staleTime,
  });
};

