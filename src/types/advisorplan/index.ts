// Types for Advisor Plan API

export interface ActivePlanData {
  planId: string;
  planName: string | null;
  mealPlanId: string;
  currentCheckpointNumber: number;
  checkpointIntervalDays?: number;
}

// Note: The API returns { success, message, data: ActivePlanData }
// but http client extracts data and returns IApiResponse<ActivePlanData>
export type ActivePlanResponse = ActivePlanData;

export interface Exercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: number;
  category: string;
  videoUrl: string;
  note: string;
  durationMinutes: number;
}

export interface WorkoutDetail {
  workoutDetailId: string;
  dayNumber: number;
  checkpointNumber: number;
  sessionName: string;
  exercises: Exercise[];
}

// Note: The API returns { success, message, data: WorkoutDetail[] }
// but http client extracts data and returns IApiResponse<WorkoutDetail[]>
export type WorkoutDetailsResponse = WorkoutDetail[];

export interface MealNutrition {
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
}

export interface Food {
  name: string;
  quantity: string;
  note: string | null;
}

export interface Meal {
  type: string;
  calories: number;
  nutrition: MealNutrition;
  foods: Food[];
}

export interface MealDetail {
  mealDetailId: string;
  dayNumber: number;
  checkpointNumber: number;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}

// Note: The API returns { success, message, data: MealDetail[] }
// but http client extracts data and returns IApiResponse<MealDetail[]>
export type MealDetailsResponse = MealDetail[];

export interface GetWorkoutDetailsParams {
  userId: string;
  checkpointNumber?: number;
  dayNumber?: number;
}

export interface GetMealDetailsParams {
  userId: string;
  checkpointNumber?: number;
  dayNumber?: number;
}

// Update Meal Plan Types
export interface UpdateMealPlanRequest {
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  meals: Meal[];
}

export interface UpdateMealPlanParams {
  userId: string;
  dayNumber: number;
  checkpointNumber: number;
  data: UpdateMealPlanRequest;
}

export interface UpdateMealPlanResponse {
  success: boolean;
  message: string;
  data?: MealDetail;
}

// Update Workout Exercise Types
export interface UpdateWorkoutExerciseRequest {
  oldExerciseId: string;
  newExercise: Exercise;
}

export interface UpdateWorkoutExerciseParams {
  userId: string;
  workoutDetailId: string;
  data: UpdateWorkoutExerciseRequest;
}

export interface UpdateWorkoutExerciseResponse {
  success: boolean;
  message: string;
  data?: WorkoutDetail;
}

