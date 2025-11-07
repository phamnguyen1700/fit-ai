'use client';

import React, { useState } from 'react';
import { PlanHeader } from './components/PlanHeader';
import { CreatePlanModal } from './components/CreatePlanModal';
import { WorkoutDetailsModal } from './components/WorkoutDetailsModal';
import { CreateMealPlanModal } from './components/CreateMealPlanModal';
import { MealDetailsModal } from './components/MealDetailsModal';
import { mockPlans } from './data/mockPlans';
import type { CreatePlanFormData, DayWorkout, CreateMealPlanFormData, DayMeal } from '@/types/plan';
import FeedbackTab from './components/tabs/FeedbackTab';

import MealTab from './components/tabs/MealTab';
import WorkoutTab from './components/tabs/WorkoutTab';

export const PlanDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('workout');
  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);
  const [workoutDetailsModalOpen, setWorkoutDetailsModalOpen] = useState(false);
  const [planFormData, setPlanFormData] = useState<CreatePlanFormData | null>(null);
  const [createMealPlanModalOpen, setCreateMealPlanModalOpen] = useState(false);
  const [mealDetailsModalOpen, setMealDetailsModalOpen] = useState(false);
  const [mealPlanFormData, setMealPlanFormData] = useState<CreateMealPlanFormData | null>(null);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleViewPlan = (id: string) => {
    console.log('View plan:', id);
  };

  const handleEditPlan = (id: string) => {
    console.log('Edit plan:', id);
  };

  const handleDeletePlan = (id: string) => {
    console.log('Delete plan:', id);
  };

  const handleExport = () => {
    console.log('Export data');
  };

  const handleCreatePlan = () => {
    if (activeTab === 'workout') {
      setCreatePlanModalOpen(true);
    } else if (activeTab === 'meal') {
      setCreateMealPlanModalOpen(true);
    }
  };

  const handleCreatePlanSubmit = (data: CreatePlanFormData) => {
    setPlanFormData(data);
    setCreatePlanModalOpen(false);
    setWorkoutDetailsModalOpen(true);
  };

  const handleWorkoutDetailsSubmit = (workouts: DayWorkout[]) => {
    if (!planFormData) return;
    console.log('Workout plan created:', { ...planFormData, workouts });
    setWorkoutDetailsModalOpen(false);
    setPlanFormData(null);
    alert('Kế hoạch tập luyện đã được tạo thành công!');
  };

  const handleCreateMealPlanSubmit = (data: CreateMealPlanFormData) => {
    setMealPlanFormData(data);
    setCreateMealPlanModalOpen(false);
    setMealDetailsModalOpen(true);
  };

  const handleMealDetailsSubmit = (menus: DayMeal[]) => {
    if (!mealPlanFormData) return;
    console.log('Meal plan created:', { ...mealPlanFormData, menus });
    setMealDetailsModalOpen(false);
    setMealPlanFormData(null);
    alert('Kế hoạch dinh dưỡng đã được tạo thành công!');
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'workout':
        return <WorkoutTab />;
      case 'meal':
        return <MealTab/>;
      case 'feedback':
        return <FeedbackTab plans={mockPlans} onView={handleViewPlan} onEdit={handleEditPlan} onDelete={handleDeletePlan} />;
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px', backgroundColor: '#ffffff', minHeight: '100vh', borderRadius: '12px' }}>
      <PlanHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onExport={handleExport}
        onCreatePlan={handleCreatePlan}
      />
      {renderTabContent()}

      <CreatePlanModal
        open={createPlanModalOpen}
        onCancel={() => setCreatePlanModalOpen(false)}
        onSubmit={handleCreatePlanSubmit}
      />
      <WorkoutDetailsModal
        open={workoutDetailsModalOpen}
        planData={planFormData}
        onCancel={() => {
          setWorkoutDetailsModalOpen(false);
          setPlanFormData(null);
        }}
        onSubmit={handleWorkoutDetailsSubmit}
      />
      <CreateMealPlanModal
        open={createMealPlanModalOpen}
        onCancel={() => setCreateMealPlanModalOpen(false)}
        onSubmit={handleCreateMealPlanSubmit}
      />
      <MealDetailsModal
        open={mealDetailsModalOpen}
        planData={mealPlanFormData}
        onCancel={() => {
          setMealDetailsModalOpen(false);
          setMealPlanFormData(null);
        }}
        onSubmit={handleMealDetailsSubmit}
      />
    </div>
  );
};

export default PlanDemoPage;
