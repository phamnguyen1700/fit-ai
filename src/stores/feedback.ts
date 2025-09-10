import { useAppStore } from './app.store';

// Feedback module - chỉ export những gì cần cho feedback
export const useFeedbackStore = () => {
  const store = useAppStore();
  
  return {
    // Data
    feedbacks: store.feedbacks,
    selectedFeedback: store.selectedFeedback,
    loading: store.feedbacksLoading,
    error: store.feedbacksError,
    
    // Actions
    setFeedbacks: store.setFeedbacks,
    addFeedback: store.addFeedback,
    updateFeedback: store.updateFeedback,
    removeFeedback: store.removeFeedback,
    setSelectedFeedback: store.setSelectedFeedback,
    setFeedbacksLoading: store.setFeedbacksLoading,
    setFeedbacksError: store.setFeedbacksError,
  };
};
