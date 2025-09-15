export interface Feedback {
  id: string;
  title: string;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  category: 'general' | 'bug' | 'feature' | 'improvement';
  createdAt: string;
  updatedAt: string;
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface CreateFeedbackRequest {
  title: string;
  content: string;
  rating: number;
  category: 'general' | 'bug' | 'feature' | 'improvement';
  userId?: string;
  userName?: string;
  userEmail?: string;
}

export interface UpdateFeedbackRequest {
  id: string;
  title?: string;
  content?: string;
  rating?: number;
  status?: 'pending' | 'approved' | 'rejected';
  category?: 'general' | 'bug' | 'feature' | 'improvement';
}

export interface FeedbackFilters {
  status?: 'pending' | 'approved' | 'rejected';
  category?: 'general' | 'bug' | 'feature' | 'improvement';
  rating?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface FeedbackStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  averageRating: number;
  byCategory: Record<string, number>;
}
