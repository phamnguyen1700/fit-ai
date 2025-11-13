export interface MealIngredientSearchParams {
  query?: string;
  pageNumber?: number;
  maxResults?: number;
}

export interface MealIngredient {
  food_id: string;
  food_name: string;
  weight: string;
  calories: string;
  fat: string;
  carbs: string;
  protein: string;
  food_url: string;
}

export interface MealIngredientSearchResponse {
  foods: MealIngredient[];
}

