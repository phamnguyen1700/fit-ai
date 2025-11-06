'use client';

import React, { useState, useMemo } from 'react';
import { Row, Col, Pagination } from '@/shared/ui';
import { PlanHeader } from './components/PlanHeader';
import { PlanCard } from './components/PlanCard';
import { CreatePlanModal } from './components/CreatePlanModal';
import { WorkoutDetailsModal } from './components/WorkoutDetailsModal';
import { CreateMealPlanModal } from './components/CreateMealPlanModal';
import { MealDetailsModal } from './components/MealDetailsModal';
import { mockPlans } from './data/mockPlans';
import type { Plan, CreatePlanFormData, DayWorkout, CreateMealPlanFormData, DayMeal } from '@/types/plan';

export const PlanDemoPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('workout');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  
  // Modal states - Workout
  const [createPlanModalOpen, setCreatePlanModalOpen] = useState(false);
  const [workoutDetailsModalOpen, setWorkoutDetailsModalOpen] = useState(false);
  const [planFormData, setPlanFormData] = useState<CreatePlanFormData | null>(null);
  
  // Modal states - Meal
  const [createMealPlanModalOpen, setCreateMealPlanModalOpen] = useState(false);
  const [mealDetailsModalOpen, setMealDetailsModalOpen] = useState(false);
  const [mealPlanFormData, setMealPlanFormData] = useState<CreateMealPlanFormData | null>(null);

  // Filter plans based on active tab
  const filteredPlans = useMemo(() => {
    if (activeTab === 'workout') {
      return mockPlans.filter(plan => plan.planType === 'workout');
    } else if (activeTab === 'meal') {
      return mockPlans.filter(plan => plan.planType === 'meal');
    } else if (activeTab === 'feedback') {
      return mockPlans.filter(plan => plan.hasFeedback && plan.feedbackRating && plan.feedbackRating >= 4);
    }
    return mockPlans;
  }, [activeTab]);

  // Paginate filtered plans
  const paginatedPlans = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredPlans.slice(startIndex, endIndex);
  }, [filteredPlans, currentPage]);

  // Reset to page 1 when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const handleViewPlan = (id: string) => {
    console.log('View plan:', id);
    // TODO: Navigate to plan detail page
  };

  const handleEditPlan = (id: string) => {
    console.log('Edit plan:', id);
    // TODO: Open edit modal or navigate to edit page
  };

  const handleDeletePlan = (id: string) => {
    console.log('Delete plan:', id);
    // TODO: Show confirmation modal and delete
  };

  const handleExport = () => {
    console.log('Export data');
    // TODO: Export functionality
  };

  const handleCreatePlan = () => {
    console.log('handleCreatePlan called, activeTab:', activeTab);
    if (activeTab === 'workout') {
      console.log('Opening workout plan modal');
      setCreatePlanModalOpen(true);
    } else if (activeTab === 'meal') {
      console.log('Opening meal plan modal');
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

    console.log('Workout plan created:', {
      ...planFormData,
      workouts,
    });

    // TODO: Call API to create plan
    // For now, just close modals and show success message
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

    console.log('Meal plan created:', {
      ...mealPlanFormData,
      menus,
    });

    // TODO: Call API to create meal plan
    // For now, just close modals and show success message
    setMealDetailsModalOpen(false);
    setMealPlanFormData(null);
    
    alert('Kế hoạch dinh dưỡng đã được tạo thành công!');
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div style={{ padding: '24px' }}>
      <PlanHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onExport={handleExport}
        onCreatePlan={handleCreatePlan}
      />

      {/* Plans Grid */}
      <Row gutter={[24, 24]}>
        {paginatedPlans.map((plan) => (
          <Col key={plan.id} xs={24} sm={24} md={12} lg={12} xl={12}>
            <PlanCard
              {...plan}
              onView={handleViewPlan}
              onEdit={handleEditPlan}
              onDelete={handleDeletePlan}
            />
          </Col>
        ))}
      </Row>

      {/* Empty State */}
      {paginatedPlans.length === 0 && (
        <div
          style={{
            textAlign: 'center',
            padding: '60px 20px',
            color: 'var(--text-secondary)',
          }}
        >
          <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
          <div style={{ fontSize: 18, fontWeight: 500, marginBottom: 8 }}>
            Không có kế hoạch nào
          </div>
          <div style={{ fontSize: 14 }}>
            Chưa có kế hoạch nào trong danh mục này.
          </div>
        </div>
      )}

      {/* Pagination */}
      {filteredPlans.length > pageSize && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            marginTop: 32,
          }}
        >
          <Pagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredPlans.length / pageSize)}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {/* Modals - Workout */}
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

      {/* Modals - Meal */}
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
