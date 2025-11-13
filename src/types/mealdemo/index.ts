export interface MealDemo {
  id: string;
  planName: string;
  gender: string;
  goal: string;
  maxDailyCalories: number;
  totalMenus: number;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MealDemoListParams {
  pageNumber?: number;
  pageSize?: number;
  isDeleted?: boolean;
}

export interface MealDemoListResponse {
  totalRecords: number;
  data: MealDemo[];
}

export interface CreateMealDemoPayload {
  planName: string;
  gender: string;
  goal: string;
  maxDailyCalories: number;
  totalMenus: number;
}

export type CreateMealDemoResponse = MealDemo;

export interface UpdateMealDemoIngredientPayload {
  name: string;
  weight: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  foodId: string;
}

export interface UpdateMealDemoSessionPayload {
  sessionName: string;
  ingredients: UpdateMealDemoIngredientPayload[];
}

export interface UpdateMealDemoMenuPayload {
  menuNumber: number;
  sessions: UpdateMealDemoSessionPayload[];
}

export type UpdateMealDemoAllPayload = UpdateMealDemoMenuPayload[];

export type UpdateMealDemoAllResponse = MealDemo | null;

export interface MealDemoDetailIngredient {
  name: string;
  weight: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  foodId: string | null;
}

export interface MealDemoDetailSession {
  sessionName: string;
  ingredients: MealDemoDetailIngredient[];
}

export interface MealDemoDetailMenu {
  id: string;
  mealDemoId: string;
  menuNumber: number;
  sessions: MealDemoDetailSession[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export type MealDemoDetailResponse = MealDemoDetailMenu[];
