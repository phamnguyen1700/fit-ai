// Query Keys cho React Query
export const homeQueryKeys = {
  // Base key cho tất cả queries liên quan đến home
  all: ['home'] as const,
  
  // Stats
  stats: () => [...homeQueryKeys.all, 'stats'] as const,
  
  // Features
  features: () => [...homeQueryKeys.all, 'features'] as const,
  
  // Testimonials
  testimonials: () => [...homeQueryKeys.all, 'testimonials'] as const,
};
