// Query Keys cho React Query
export const feedbackQueryKeys = {
  // Base key cho tất cả queries liên quan đến feedbacks
  all: ['feedbacks'] as const,
  
  // Danh sách feedbacks
  lists: () => [...feedbackQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...feedbackQueryKeys.lists(), { filters }] as const,
  
  // Chi tiết feedback
  details: () => [...feedbackQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...feedbackQueryKeys.details(), id] as const,
  
  // Stats
  stats: () => [...feedbackQueryKeys.all, 'stats'] as const,
};
