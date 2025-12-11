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

// Public Feedback Types
export interface PublicFeedbackParams {
  pageNumber?: number;
  pageSize?: number;
}

export interface PublicFeedbackItem {
  id: string;
  userId: string;
  content: string;
  rating: number;
  state: number;
  approvedAt: string | null;
  approvedBy: string | null;
  deniedAt: string | null;
  deniedBy: string | null;
  denialReason: string | null;
  publishedAt: string | null;
  isEdited: boolean;
  lastEditedAt: string | null;
  lastCreate: string;
  lastUpdate: string;
}

// PublicFeedbackResponse can be either array directly or object with data array
export type PublicFeedbackResponse = PublicFeedbackItem[] | { data: PublicFeedbackItem[] };

