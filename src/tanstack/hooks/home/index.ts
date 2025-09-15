// Note: Install @tanstack/react-query for production use
// npm install @tanstack/react-query
import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query';
import { homeService } from '../../services/home';
import { HomeStats, Feature, Testimonial } from '@/types/home';
// Query Keys
export const homeQueryKeys = {
  all: ['home'] as const,
  stats: () => [...homeQueryKeys.all, 'stats'] as const,
  features: () => [...homeQueryKeys.all, 'features'] as const,
  testimonials: () => [...homeQueryKeys.all, 'testimonials'] as const,
};
import { queryClient } from '@/lib/queryClient';
// import { toast } from 'react-toastify'; // Uncomment when installing react-toastify

// Query Hooks
export const useHomeStats = () => {
  return useQuery<HomeStats>({
    queryKey: homeQueryKeys.stats(),
    queryFn: () => homeService.getStats(),
    placeholderData: keepPreviousData,
    staleTime: 10 * 60 * 1000, // 10 phút - stats ít thay đổi
  });
};

export const useHomeFeatures = () => {
  return useQuery<Feature[]>({
    queryKey: homeQueryKeys.features(),
    queryFn: () => homeService.getFeatures(),
    placeholderData: keepPreviousData,
    staleTime: 30 * 60 * 1000, // 30 phút - features ít thay đổi
  });
};

export const useHomeTestimonials = () => {
  return useQuery<Testimonial[]>({
    queryKey: homeQueryKeys.testimonials(),
    queryFn: () => homeService.getTestimonials(),
    placeholderData: keepPreviousData,
    staleTime: 15 * 60 * 1000, // 15 phút
  });
};

// Mutation Hooks
export const useNewsletterSubscriptionMutation = () => {
  return useMutation({
    mutationFn: (email: string) => homeService.subscribeNewsletter(email),
    onSuccess: () => {
      // toast.success('Đăng ký newsletter thành công');
      queryClient.invalidateQueries({ queryKey: homeQueryKeys.stats() });
    },
    onError: () => {
      // toast.error('Đăng ký newsletter thất bại');
    },
  });
};
