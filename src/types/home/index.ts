export interface HomeStats {
  totalUsers: number;
  totalPlans: number;
  totalRevenue: number;
  newUsersThisMonth: number;
  activeSubscriptions: number;
  averageRating: number;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: string;
  isHighlighted: boolean;
  order: number;
}

export interface HeroSection {
  title: string;
  subtitle: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundImage?: string;
  isActive: boolean;
}

export interface HomeContent {
  hero: HeroSection;
  features: Feature[];
  testimonials: Testimonial[];
  stats: HomeStats;
}
