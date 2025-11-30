export interface MealPlanComment {
  id: string;
  mealLogId?: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  senderName?: string;
  senderType?: string;
  senderAvatarUrl?: string;
  [key: string]: unknown;
}

export interface MealPlanCommentsResponse {
  mealLogId: string;
  mealType: string;
  dayNumber: number;
  comments: MealPlanComment[];
}

export interface MealPlanAddCommentRequest {
  content: string;
}

