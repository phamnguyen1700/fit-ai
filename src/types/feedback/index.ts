export interface FeedbackListParams {
  pageNumber?: number;
  pageSize?: number;
  state?: number;
  search?: string;
}

export interface FeedbackItem {
  id: string;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string;
  rating?: number;
  content?: string;
  state?: number;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
}

export interface FeedbackListMeta {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface FeedbackListResponse extends Partial<FeedbackListMeta> {
  items?: FeedbackItem[];
  data?: FeedbackItem[];
  [key: string]: unknown;
}

export interface DenyFeedbackRequest {
  reason: string;
}

