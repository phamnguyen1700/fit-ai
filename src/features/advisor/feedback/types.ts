export type FeedbackStatus = 'pending' | 'reviewed' | 'rework';
export type FeedbackMediaType = 'image' | 'video';

export interface FeedbackSubmission {
  id: string;
  customerName: string;
  customerEmail: string;
  customerAvatar?: string;
  submittedAt: string; // ISO string
  workoutName: string;
  focusArea: string;
  notesFromCustomer?: string;
  mediaType: FeedbackMediaType;
  mediaUrl: string;
  thumbnailUrl?: string;
  status: FeedbackStatus;
  advisorNotes?: string;
}

export interface FeedbackReviewPayload {
  advisorNotes: string;
  status: FeedbackStatus;
  rating: number;
  quickRemarks: string[];
}
