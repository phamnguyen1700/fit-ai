'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import Header from './components/header';
import { WorkoutPlanTable } from './components/WorkoutPlanTable';
import { CreateWorkoutPlanModal } from './components/CreateWorkoutPlanModal';
import { AddPlanContentModal } from './components/AddPlanContentModal';
import type { WorkoutPlan, DailyWorkoutPlan, DailyMealPlan } from '@/types/workoutPlan';

// Mock data for demonstration
const mockWorkoutPlans: WorkoutPlan[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'Nguyễn Văn A',
    userEmail: 'nguyenvana@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c',
    planName: 'Kế hoạch giảm cân 4 tuần',
    planType: 'combined',
    goal: 'Giảm cân, giảm mỡ bụng',
    duration: '4 tuần',
    startDate: '2025-11-01',
    endDate: '2025-11-28',
    status: 'active',
    totalWorkoutDays: 28,
    workoutsCompleted: 12,
    totalMealDays: 28,
    mealsCompleted: 15,
    generatedBy: 'ai',
    aiModel: 'GPT-4',
    generatedAt: '2025-11-01T08:00:00Z',
    createdAt: '2025-11-01T08:00:00Z',
    progress: 50,
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'Trần Thị B',
    userEmail: 'tranthib@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    planName: 'Tăng cơ bắp hiệu quả',
    planType: 'workout',
    goal: 'Tăng cơ, tăng sức mạnh',
    duration: '8 tuần',
    startDate: '2025-10-15',
    endDate: '2025-12-10',
    status: 'active',
    totalWorkoutDays: 56,
    workoutsCompleted: 35,
    generatedBy: 'ai',
    aiModel: 'GPT-4',
    generatedAt: '2025-10-15T09:00:00Z',
    createdAt: '2025-10-15T09:00:00Z',
    progress: 62,
  },
  {
    id: '3',
    userId: 'user3',
    userName: 'Lê Văn C',
    userEmail: 'levanc@example.com',
    planName: 'Chế độ ăn healthy',
    planType: 'meal',
    goal: 'Ăn sạch, tăng cường sức khỏe',
    duration: '30 ngày',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: 'completed',
    totalMealDays: 30,
    mealsCompleted: 30,
    generatedBy: 'ai',
    generatedAt: '2025-11-01T10:00:00Z',
    createdAt: '2025-11-01T10:00:00Z',
    progress: 100,
  },
  {
    id: '4',
    userId: 'user4',
    userName: 'Phạm Thị D',
    userEmail: 'phamthid@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
    planName: 'Giảm mỡ toàn thân',
    planType: 'combined',
    goal: 'Giảm mỡ, tăng cơ nạc',
    duration: '6 tuần',
    startDate: '2025-10-20',
    endDate: '2025-12-01',
    status: 'active',
    totalWorkoutDays: 42,
    workoutsCompleted: 20,
    totalMealDays: 42,
    mealsCompleted: 22,
    generatedBy: 'ai',
    aiModel: 'GPT-4',
    generatedAt: '2025-10-20T11:00:00Z',
    createdAt: '2025-10-20T11:00:00Z',
    progress: 48,
  },
  {
    id: '5',
    userId: 'user5',
    userName: 'Hoàng Văn E',
    userEmail: 'hoangvane@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
    planName: 'Cardio cơ bản',
    planType: 'workout',
    goal: 'Tăng sức bền, giảm cân',
    duration: '4 tuần',
    startDate: '2025-11-05',
    endDate: '2025-12-03',
    status: 'pending',
    totalWorkoutDays: 28,
    workoutsCompleted: 0,
    generatedBy: 'ai',
    generatedAt: '2025-11-05T07:00:00Z',
    createdAt: '2025-11-05T07:00:00Z',
    progress: 0,
  },
  {
    id: '6',
    userId: 'user6',
    userName: 'Vũ Thị F',
    userEmail: 'vuthif@example.com',
    planName: 'Chế độ ăn kiêng Keto',
    planType: 'meal',
    goal: 'Giảm cân nhanh',
    duration: '21 ngày',
    startDate: '2025-10-25',
    endDate: '2025-11-15',
    status: 'cancelled',
    totalMealDays: 21,
    mealsCompleted: 10,
    generatedBy: 'ai',
    generatedAt: '2025-10-25T12:00:00Z',
    createdAt: '2025-10-25T12:00:00Z',
    progress: 48,
  },
  {
    id: '7',
    userId: 'user7',
    userName: 'Đặng Văn G',
    userEmail: 'dangvang@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d',
    planName: 'Yoga & Thư giãn',
    planType: 'workout',
    goal: 'Cải thiện sức khỏe tinh thần',
    duration: '8 tuần',
    startDate: '2025-10-01',
    endDate: '2025-11-26',
    status: 'active',
    totalWorkoutDays: 56,
    workoutsCompleted: 40,
    generatedBy: 'ai',
    generatedAt: '2025-10-01T06:00:00Z',
    createdAt: '2025-10-01T06:00:00Z',
    progress: 71,
  },
  {
    id: '8',
    userId: 'user8',
    userName: 'Bùi Thị H',
    userEmail: 'buithih@example.com',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
    planName: 'Kế hoạch ăn uống cân bằng',
    planType: 'meal',
    goal: 'Duy trì cân nặng ổn định',
    duration: '30 ngày',
    startDate: '2025-11-01',
    endDate: '2025-11-30',
    status: 'active',
    totalMealDays: 30,
    mealsCompleted: 10,
    generatedBy: 'ai',
    generatedAt: '2025-11-01T13:00:00Z',
    createdAt: '2025-11-01T13:00:00Z',
    progress: 33,
  },
];

export const WorkoutPlanPage: React.FC = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isContentModalVisible, setIsContentModalVisible] = useState(false);
  const [plans, setPlans] = useState<WorkoutPlan[]>(mockWorkoutPlans);
  const [currentPlan, setCurrentPlan] = useState<Partial<WorkoutPlan> | null>(null);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
  };

  const handleCreateNew = () => {
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
  };

  const handleCreateSubmit = (newPlan: Partial<WorkoutPlan>) => {
    // Store current plan for later
    setCurrentPlan(newPlan);
    message.success('Tạo kế hoạch cơ bản thành công! Tiếp tục thêm nội dung chi tiết.');
  };

  const handleOpenContentModal = (
    planType: 'workout' | 'meal' | 'combined',
    totalWorkoutDays: number,
    totalMealDays: number
  ) => {
    setIsContentModalVisible(true);
  };

  const handleContentModalClose = () => {
    setIsContentModalVisible(false);
  };

  const handleContentSubmit = (workoutPlans: DailyWorkoutPlan[], mealPlans: DailyMealPlan[]) => {
    if (!currentPlan) return;

    // Add detailed content to the plan
    const completePlan = {
      ...currentPlan,
      id: currentPlan.id || `plan-${Date.now()}`,
      userId: currentPlan.userId || '',
      userName: currentPlan.userName || '',
      userEmail: currentPlan.userEmail || '',
      planName: currentPlan.planName || '',
      planType: currentPlan.planType || 'combined',
      status: currentPlan.status || 'pending',
      generatedBy: currentPlan.generatedBy || 'manual',
      generatedAt: currentPlan.generatedAt || new Date().toISOString(),
      createdAt: currentPlan.createdAt || new Date().toISOString(),
      progress: currentPlan.progress || 0,
      workoutPlans,
      mealPlans,
    } as WorkoutPlan;

    setPlans([completePlan, ...plans]);
    setCurrentPlan(null);
    message.success('Đã thêm nội dung chi tiết cho kế hoạch!');
  };

  const handleExport = () => {
    console.log('Export workout plans data');
    message.info('Tính năng xuất dữ liệu đang được phát triển');
    // TODO: Implement export functionality
  };

  const handleView = (planId: string) => {
    console.log('View plan:', planId);
    router.push(`/admin/workout-plans/${planId}`);
  };

  const handleEdit = (planId: string) => {
    console.log('Edit plan:', planId);
    message.info('Tính năng chỉnh sửa đang được phát triển');
    // TODO: Implement edit functionality
  };

  const handleDelete = (planId: string) => {
    console.log('Delete plan:', planId);
    setPlans(plans.filter(p => p.id !== planId));
    message.success('Đã xóa kế hoạch!');
  };

  // Filter plans based on active tab
  const filteredPlans = useMemo(() => {
    if (activeTab === 'all') {
      return plans;
    }
    return plans.filter(plan => plan.planType === activeTab);
  }, [activeTab, plans]);

  return (
    <div className="workout-plan-page">
      <Header 
        activeTab={activeTab} 
        onTabChange={handleTabChange}
        onExport={handleExport}
        onCreateNew={handleCreateNew}
      />
      <div className="workout-plan-page-content p-6">
        <WorkoutPlanTable
          plans={filteredPlans}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <CreateWorkoutPlanModal
        visible={isModalVisible}
        onClose={handleModalClose}
        onSubmit={handleCreateSubmit}
        onOpenContentModal={handleOpenContentModal}
      />

      <AddPlanContentModal
        visible={isContentModalVisible}
        onClose={handleContentModalClose}
        onSubmit={handleContentSubmit}
        planType={currentPlan?.planType || 'combined'}
        totalWorkoutDays={currentPlan?.totalWorkoutDays || 0}
        totalMealDays={currentPlan?.totalMealDays || 0}
      />
    </div>
  );
};
