import { useAppStore } from './app.store';

// Home module - chỉ export những gì cần cho home
export const useHomeStore = () => {
  const store = useAppStore();
  
  return {
    // Data
    newsletterEmail: store.newsletterEmail,
    newsletterSubscribed: store.newsletterSubscribed,
    currentTestimonialIndex: store.currentTestimonialIndex,
    heroAnimationComplete: store.heroAnimationComplete,
    
    // Actions
    setNewsletterEmail: store.setNewsletterEmail,
    setNewsletterSubscribed: store.setNewsletterSubscribed,
    setCurrentTestimonialIndex: store.setCurrentTestimonialIndex,
    nextTestimonial: store.nextTestimonial,
    prevTestimonial: store.prevTestimonial,
    setHeroAnimationComplete: store.setHeroAnimationComplete,
    resetNewsletter: store.resetNewsletter,
  };
};
