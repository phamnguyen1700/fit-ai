// Workout Plan Types
export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number;
  duration?: string; // e.g., "30 minutes"
  caloriesBurned?: number;
  image?: string;
  description?: string;
}

export interface ExerciseSession {
  id: string;
  time: string; // e.g., "Morning", "Evening", "06:00 AM"
  exercises: Exercise[];
  totalDuration?: string;
  totalCalories?: number;
}

export interface DailyWorkoutPlan {
  day: string; // e.g., "Monday", "Day 1"
  date?: string;
  sessions: ExerciseSession[];
  totalCalories?: number;
  completed?: boolean;
}

// Meal Plan Types
export interface Meal {
  id: string;
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  image?: string;
  ingredients?: string[];
  recipe?: string;
}

export interface MealSession {
  id: string;
  time: string; // e.g., "Breakfast", "Lunch", "Dinner", "Snack"
  meals: Meal[];
  totalCalories?: number;
}

export interface DailyMealPlan {
  day: string;
  date?: string;
  sessions: MealSession[];
  totalCalories?: number;
  totalProtein?: number;
  totalCarbs?: number;
  totalFat?: number;
  completed?: boolean;
}

// Combined Workout Plan
export interface WorkoutPlan {
  id: string;
  userId: string;
  userName?: string;
  userEmail?: string;
  userAvatar?: string;
  planName: string;
  planType: 'workout' | 'meal' | 'combined'; // Type of plan
  goal?: string; // e.g., "Giảm cân", "Tăng cơ"
  duration?: string; // e.g., "4 weeks", "30 days"
  startDate?: string;
  endDate?: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  
  // Workout-related fields
  workoutPlans?: DailyWorkoutPlan[];
  totalWorkoutDays?: number;
  workoutsCompleted?: number;
  
  // Meal-related fields
  mealPlans?: DailyMealPlan[];
  totalMealDays?: number;
  mealsCompleted?: number;
  
  // AI-generated metadata
  generatedBy: 'ai' | 'manual';
  aiModel?: string;
  generatedAt: string;
  createdAt: string;
  updatedAt?: string;
  
  // Stats
  totalCaloriesTarget?: number;
  totalCaloriesBurned?: number;
  progress?: number; // Percentage 0-100
}

export interface WorkoutPlanFilters {
  planType?: 'all' | 'workout' | 'meal' | 'combined';
  status?: 'active' | 'completed' | 'pending' | 'cancelled' | 'all';
  goal?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}

export interface WorkoutPlanStats {
  total: number;
  active: number;
  completed: number;
  pending: number;
  cancelled: number;
  byType: {
    workout: number;
    meal: number;
    combined: number;
  };
  byGoal: Record<string, number>;
  avgProgress: number;
  totalUsers: number;
}
