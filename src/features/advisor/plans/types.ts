import type { Plan, DayWorkout, DayMeal } from '@/types/plan';

export type PlanReviewStatus = 'pending' | 'approved' | 'rejected';

export interface PlanReview extends Plan {
  reviewStatus: PlanReviewStatus;
  submittedAt: string; // When customer submitted for review
  reviewedAt?: string; // When advisor reviewed
  advisorNotes?: string; // Advisor's comments
  advisorId?: string;
  advisorName?: string;
  healthIssues?: string[]; // Health issues or dietary restrictions
  
  // Plan details (only for pending/reviewed plans)
  workoutDetails?: DayWorkout[];
  mealDetails?: DayMeal[];
}

export interface PlanReviewPayload {
  planId: string;
  status: 'approved' | 'rejected' | 'request-modification';
  advisorNotes: string;
}

