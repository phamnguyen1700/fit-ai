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
}

export interface WorkoutReviewResponse {
  data: WorkoutReview[];
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

export interface MealReviewResponse {
  data: MealReview[];
}

export interface WorkoutReviewRequest {
  completionPercent: number;
  feedback: string;
}

export interface WorkoutReviewSubmitResponse {
  workoutLogId: string;
  completionPercent: number;
  feedback: string;
  reviewedAt: string;
}

