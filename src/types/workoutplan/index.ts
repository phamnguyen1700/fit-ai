export interface WorkoutPlanComment {
  id: string;
  senderName?: string;
  senderType?: string;
  content: string;
  senderAvatarUrl?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface WorkoutPlanCommentsResponse {
  exerciseLogId: string;
  exerciseName: string;
  comments: WorkoutPlanComment[];
}

export interface WorkoutPlanAddCommentRequest {
  content: string;
}

