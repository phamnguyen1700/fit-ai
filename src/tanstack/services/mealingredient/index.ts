import { get } from "@/shared/api/http";
import {
  MealIngredientSearchParams,
  MealIngredientSearchResponse,
} from "@/types/mealingredient";

export const searchMealIngredientsService = (
  params: MealIngredientSearchParams
) => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== undefined && value !== null && value !== ""
    )
  );

  return get<MealIngredientSearchResponse>(
    "api/mealdemodetail/ingredients/search",
    {
      params: cleanedParams,
    }
  );
};

