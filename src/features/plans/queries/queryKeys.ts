// Query Keys cho React Query
// Đây là cách tổ chức keys để cache và invalidate data

export const planQueryKeys = {
  // Base key cho tất cả queries liên quan đến plans
  all: ['plans'] as const,
  
  // Danh sách plans
  lists: () => [...planQueryKeys.all, 'list'] as const,
  list: (filters?: Record<string, any>) => [...planQueryKeys.lists(), { filters }] as const,
  
  // Chi tiết plan
  details: () => [...planQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...planQueryKeys.details(), id] as const,
  
  // Stats
  stats: () => [...planQueryKeys.all, 'stats'] as const,
};

// Ví dụ sử dụng:
// - planQueryKeys.all → ['plans']
// - planQueryKeys.lists() → ['plans', 'list']
// - planQueryKeys.list({ active: true }) → ['plans', 'list', { filters: { active: true } }]
// - planQueryKeys.detail('123') → ['plans', 'detail', '123']
