import { useAppStore } from './app.store';

// Plans module - chỉ export những gì cần cho plans
export const usePlansStore = () => {
  const store = useAppStore();
  
  return {
    // Data
    plans: store.plans,
    selectedPlan: store.selectedPlan,
    loading: store.plansLoading,
    error: store.plansError,
    
    // Actions
    setPlans: store.setPlans,
    addPlan: store.addPlan,
    updatePlan: store.updatePlan,
    removePlan: store.removePlan,
    setSelectedPlan: store.setSelectedPlan,
    setPlansLoading: store.setPlansLoading,
    setPlansError: store.setPlansError,
  };
};
