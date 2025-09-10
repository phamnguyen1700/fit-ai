'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

// Types
export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  features: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'admin' | 'trainer' | 'user';
  isActive: boolean;
  lastLoginAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface Feedback {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  rating: number;
  category: 'general' | 'feature' | 'bug' | 'complaint';
  status: 'pending' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
}

// Main App Store
interface AppState {
  // Plans
  plans: Plan[];
  selectedPlan: Plan | null;
  plansLoading: boolean;
  plansError: string | null;
  
  // Users
  users: User[];
  selectedUser: User | null;
  usersLoading: boolean;
  usersError: string | null;
  
  // Feedback
  feedbacks: Feedback[];
  selectedFeedback: Feedback | null;
  feedbacksLoading: boolean;
  feedbacksError: string | null;
  
  // Home
  newsletterEmail: string;
  newsletterSubscribed: boolean;
  currentTestimonialIndex: number;
  heroAnimationComplete: boolean;
}

interface AppActions {
  // Plans actions
  setPlans: (plans: Plan[]) => void;
  addPlan: (plan: Plan) => void;
  updatePlan: (plan: Plan) => void;
  removePlan: (id: string) => void;
  setSelectedPlan: (plan: Plan | null) => void;
  setPlansLoading: (loading: boolean) => void;
  setPlansError: (error: string | null) => void;
  
  // Users actions
  setUsers: (users: User[]) => void;
  addUser: (user: User) => void;
  updateUser: (user: User) => void;
  removeUser: (id: string) => void;
  setSelectedUser: (user: User | null) => void;
  setUsersLoading: (loading: boolean) => void;
  setUsersError: (error: string | null) => void;
  
  // Feedback actions
  setFeedbacks: (feedbacks: Feedback[]) => void;
  addFeedback: (feedback: Feedback) => void;
  updateFeedback: (feedback: Feedback) => void;
  removeFeedback: (id: string) => void;
  setSelectedFeedback: (feedback: Feedback | null) => void;
  setFeedbacksLoading: (loading: boolean) => void;
  setFeedbacksError: (error: string | null) => void;
  
  // Home actions
  setNewsletterEmail: (email: string) => void;
  setNewsletterSubscribed: (subscribed: boolean) => void;
  setCurrentTestimonialIndex: (index: number) => void;
  nextTestimonial: () => void;
  prevTestimonial: () => void;
  setHeroAnimationComplete: (complete: boolean) => void;
  resetNewsletter: () => void;
}

const initialState: AppState = {
  // Plans
  plans: [],
  selectedPlan: null,
  plansLoading: false,
  plansError: null,
  
  // Users
  users: [],
  selectedUser: null,
  usersLoading: false,
  usersError: null,
  
  // Feedback
  feedbacks: [],
  selectedFeedback: null,
  feedbacksLoading: false,
  feedbacksError: null,
  
  // Home
  newsletterEmail: '',
  newsletterSubscribed: false,
  currentTestimonialIndex: 0,
  heroAnimationComplete: false,
};

export const useAppStore = create<AppState & AppActions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      // Plans actions
      setPlans: (plans) => set({ plans }),
      addPlan: (plan) => set((state) => ({ plans: [plan, ...state.plans] })),
      updatePlan: (updatedPlan) => set((state) => ({
        plans: state.plans.map(plan => 
          plan.id === updatedPlan.id ? updatedPlan : plan
        )
      })),
      removePlan: (id) => set((state) => ({
        plans: state.plans.filter(plan => plan.id !== id)
      })),
      setSelectedPlan: (plan) => set({ selectedPlan: plan }),
      setPlansLoading: (loading) => set({ plansLoading: loading }),
      setPlansError: (error) => set({ plansError: error }),
      
      // Users actions
      setUsers: (users) => set({ users }),
      addUser: (user) => set((state) => ({ users: [user, ...state.users] })),
      updateUser: (updatedUser) => set((state) => ({
        users: state.users.map(user => 
          user.id === updatedUser.id ? updatedUser : user
        )
      })),
      removeUser: (id) => set((state) => ({
        users: state.users.filter(user => user.id !== id)
      })),
      setSelectedUser: (user) => set({ selectedUser: user }),
      setUsersLoading: (loading) => set({ usersLoading: loading }),
      setUsersError: (error) => set({ usersError: error }),
      
      // Feedback actions
      setFeedbacks: (feedbacks) => set({ feedbacks }),
      addFeedback: (feedback) => set((state) => ({ feedbacks: [feedback, ...state.feedbacks] })),
      updateFeedback: (updatedFeedback) => set((state) => ({
        feedbacks: state.feedbacks.map(feedback => 
          feedback.id === updatedFeedback.id ? updatedFeedback : feedback
        )
      })),
      removeFeedback: (id) => set((state) => ({
        feedbacks: state.feedbacks.filter(feedback => feedback.id !== id)
      })),
      setSelectedFeedback: (feedback) => set({ selectedFeedback: feedback }),
      setFeedbacksLoading: (loading) => set({ feedbacksLoading: loading }),
      setFeedbacksError: (error) => set({ feedbacksError: error }),
      
      // Home actions
      setNewsletterEmail: (email) => set({ newsletterEmail: email }),
      setNewsletterSubscribed: (subscribed) => set({ newsletterSubscribed: subscribed }),
      setCurrentTestimonialIndex: (index) => set({ currentTestimonialIndex: index }),
      nextTestimonial: () => {
        const { currentTestimonialIndex } = get();
        set({ currentTestimonialIndex: currentTestimonialIndex + 1 });
      },
      prevTestimonial: () => {
        const { currentTestimonialIndex } = get();
        set({ currentTestimonialIndex: Math.max(0, currentTestimonialIndex - 1) });
      },
      setHeroAnimationComplete: (complete) => set({ heroAnimationComplete: complete }),
      resetNewsletter: () => set({
        newsletterEmail: '',
        newsletterSubscribed: false,
      }),
    }),
    {
      name: 'app-store',
    }
  )
);
