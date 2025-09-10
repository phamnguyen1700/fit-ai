// Feedback Types
export interface Feedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  category: 'general' | 'feature' | 'bug' | 'complaint';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeedbackRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  category: 'general' | 'feature' | 'bug' | 'complaint';
}

export interface FeedbackFilters {
  category?: 'all' | 'general' | 'feature' | 'bug' | 'complaint';
  status?: 'all' | 'pending' | 'in_progress' | 'resolved' | 'closed';
  rating?: number;
  search?: string;
}

export interface FeedbackStats {
  totalFeedbacks: number;
  pendingFeedbacks: number;
  resolvedFeedbacks: number;
  averageRating: number;
  categoryBreakdown: {
    general: number;
    feature: number;
    bug: number;
    complaint: number;
  };
}
