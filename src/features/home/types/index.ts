// Home Types
export interface Stats {
  totalUsers: number;
  totalWorkouts: number;
  totalCaloriesBurned: number;
  averageRating: number;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  benefits: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface NewsletterSubscription {
  email: string;
  subscribedAt: string;
}

export interface HomeFilters {
  featureCategory?: string;
  testimonialRating?: number;
}
