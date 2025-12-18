export interface WorkoutSegment {
  setNumber: number;
  completed: number;
}

export interface WorkoutReview {
  workoutLogId: string;
  userId: string;
  userName: string;
  dayNumber: number;
  exerciseName: string;
  videoUrl: string;
  createdAt: string;
  hasComments: boolean;
  lastCommentFrom?: string;
  // Optional fields returned by the pending workout review API
  comments?: WorkoutReviewedComment[];
  segments?: WorkoutSegment[];
  actualDurationMinutes?: number | null;
}

export interface WorkoutReviewResponse {
  data: WorkoutReview[];
}

export interface WorkoutReviewedComment {
  id: string;
  senderId: string;
  senderName: string;
  senderType: string;
  content: string;
  createdAt: string;
}

export interface WorkoutReviewedItem {
  workoutLogId: string;
  userId: string;
  userName: string;
  dayNumber: number;
  exerciseName: string;
  videoUrl: string;
  createdAt: string;
  hasComments: boolean;
  lastCommentFrom?: string;
  comments: WorkoutReviewedComment[];
  // Optional fields returned by reviewed workout API
  segments?: WorkoutSegment[] | null;
  actualDurationMinutes?: number | null;
}

export interface WorkoutReviewedResponse {
  data: WorkoutReviewedItem[];
}

export interface MealReview {
  mealLogId: string;
  userId: string;
  userName: string;
  dayNumber: number;
  mealType: string;
  photoUrl: string;
  createdAt: string;
  hasComments: boolean;
  lastCommentFrom?: string;
  lastCommentAt?: string | null;
}

export interface MealFoodWeight {
  foodName: string;
  weightInGrams: number;
  caloriesPer100g: number;
  calculatedCalories: number;
}

export interface MealReview {
  mealLogId: string;
  userId: string;
  userName: string;
  dayNumber: number;
  mealType: string;
  photoUrl: string;
  createdAt: string;
  hasComments: boolean;
  lastCommentFrom?: string;
  lastCommentAt?: string | null;
  // Optional fields returned by the pending meal review API (see Swagger)
  comments?: MealReviewedComment[];
  foodWeights?: MealFoodWeight[] | null;
}

export interface MealReviewResponse {
  data: MealReview[];
}

export interface MealReviewedComment {
  id: string;
  senderId: string;
  senderName: string;
  senderType: string;
  content: string;
  createdAt: string;
}

export interface MealReviewedItem {
  mealLogId: string;
  userId: string;
  userName: string;
  dayNumber: number;
  mealType: string;
  photoUrl: string;
  createdAt: string;
  hasComments: boolean;
  lastCommentFrom?: string;
  lastCommentAt?: string | null;
  comments: MealReviewedComment[];
}

export interface MealReviewedResponse {
  data: MealReviewedItem[];
}

export interface WorkoutReviewRequest {
  completionPercent: number;
  feedback: string;
}

export interface MealReviewRequest {
  completionPercent: number;
  comments: string[];
}

export interface MealReviewSubmitResponse {
  mealLogId: string;
  completionPercent: number;
  comments: string[];
  reviewedAt: string;
}

export interface WorkoutReviewSubmitResponse {
  workoutLogId: string;
  completionPercent: number;
  feedback: string;
  reviewedAt: string;
}

