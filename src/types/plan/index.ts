export type PlanType = 'workout' | 'meal' | 'combined';
export type PlanStatus = 'active' | 'completed' | 'pending' | 'cancelled';
export type Gender = 'male' | 'female' | 'other';

export interface Plan {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userAvatar?: string;
  userGender?: Gender;
  planName: string;
  planType: PlanType;
  goal?: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  status: PlanStatus;
  
  // Progress tracking
  totalDays: number;
  completedDays: number;
  progress: number; // 0-100
  
  // Weight goals
  startWeight?: number; // in kg
  targetWeight?: number; // in kg
  
  // Metadata
  generatedBy: 'ai' | 'manual';
  createdAt: string;
  
  // Feedback (optional)
  hasFeedback?: boolean;
  feedbackRating?: number; // 1-5
}

export interface PlanCardProps extends Plan {
  onView?: (id: string) => void;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

// Workout Plan Creation Types
export type ExerciseType = 'cardio' | 'strength';

export interface CreatePlanFormData {
  planName: string;
  gender: Gender;
  startDate: string;
  goal: string;
  totalDays: number;
}

export interface ExerciseCategory {
  id: string;
  name: string;
  type: ExerciseType;
}

export interface Exercise {
  id: string;
  name: string;
  categoryId: string;
  type: ExerciseType;
}

export interface WorkoutExercise {
  id: string;
  sessionName: string;
  categoryId: string;
  exerciseId: string;
  categoryName?: string;
  exerciseName?: string;
  // For cardio
  minutes?: number;
  // For strength
  sets?: number;
  reps?: number;
}

export interface DayWorkout {
  day: number;
  dayName?: string;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlanCreation extends CreatePlanFormData {
  workouts: DayWorkout[];
}

// Meal Plan Creation Types
export interface CreateMealPlanFormData {
  planName: string;
  gender: Gender;
  totalCaloriesPerDay: number;
  goal: string;
  totalMenus: number;
}

export interface Ingredient {
  id: string;
  name: string;
  // Nutrition per 100g
  caloriesPer100g: number;
  carbsPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
}

export interface MealIngredient {
  id: string;
  ingredientId: string;
  weight: number; // in grams
  // Calculated values
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

export interface Meal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'custom';
  customName?: string; // For custom meals
  ingredients: MealIngredient[];
  totalCalories: number;
  totalCarbs: number;
  totalProtein: number;
  totalFat: number;
}

export interface DayMeal {
  menuNumber: number;
  meals: Meal[]; // breakfast, lunch, dinner
}

export interface MealPlanCreation extends CreateMealPlanFormData {
  menus: DayMeal[];
}

export interface MealPlanDetail {
  id: string;
  planName: string;
  goal: string;
  totalCaloriesPerDay: number;
  totalMenus: number;
  menus: DayMeal[];
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  isDeleted?: boolean;
}
