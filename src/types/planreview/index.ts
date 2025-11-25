export interface PendingPlan {
  planId: string;
  userId: string;
  userName: string;
  userGender: string;
  fitnessGoal: string;
  createdAt: string;
  status: string;
}

export interface WorkoutPlanExerciseDetail {
  exerciseId?: string;
  name: string;
  sets: number;
  reps: string;
  durationMinutes: number | null;
  category: string;
  videoUrl: string;
  note: string;
}

export interface WorkoutPlanDayDetail {
  dayNumber: number;
  sessionName: string;
  exercises: WorkoutPlanExerciseDetail[];
}

export interface WorkoutPlanDetail {
  planId: string;
  goal: string;
  experienceLevel: string;
  workoutDaysPerWeek: number;
  checkpointIntervalDays: number;
  notes: string;
  days: WorkoutPlanDayDetail[];
}

export interface MealFoodDetail {
  name: string;
  quantity: string;
}

export interface MealDetail {
  type: string;
  calories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  foods: MealFoodDetail[];
}

export interface MealPlanDayDetail {
  dayNumber: number;
  totalCalories: number;
  meals: MealDetail[];
}

export interface MealPlanDetail {
  planId: string;
  dietType: string;
  totalCalories: number;
  days: MealPlanDayDetail[];
}

export interface PlanReviewDetail {
  planId: string;
  userId: string;
  userName: string;
  fitnessGoal: string;
  createdAt: string;
  status: string;
  workoutPlan?: WorkoutPlanDetail | null;
  mealPlan?: MealPlanDetail | null;
}

export type PendingPlanResponse = PendingPlan[];

export interface PlanReviewDetailResponse extends PlanReviewDetail {}

