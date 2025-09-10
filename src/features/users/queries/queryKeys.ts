// Query Keys cho React Query
export const userQueryKeys = {
  // Base key cho tất cả queries liên quan đến users
  all: ['users'] as const,
  
  // Danh sách users
  lists: () => [...userQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...userQueryKeys.lists(), { filters }] as const,
  
  // Chi tiết user
  details: () => [...userQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...userQueryKeys.details(), id] as const,
  
  // Stats
  stats: () => [...userQueryKeys.all, 'stats'] as const,
};
