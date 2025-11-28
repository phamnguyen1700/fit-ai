// Exercise Category Types
export interface ExerciseCategory {
  id: string;
  name: string;
  description: string;
  type?: string;
}

// API Response Types
export interface ExerciseCategoryListResponse {
  data: ExerciseCategory[];
  total: number;
  page: number;
  pageSize: number;
}

// API Request Parameters
export interface GetExerciseCategoriesParams {
  page?: number;
  pageSize?: number;
}
