"use client";
import React, { useState } from 'react';
import { Modal, Button } from '@/shared/ui';
import { Form, Tabs } from 'antd';
import type { DailyWorkoutPlan, DailyMealPlan, Exercise, Meal } from '@/types/workoutPlan';
import { DaySelector } from './DaySelector';
import { WorkoutForm } from './WorkoutForm';
import { MealForm } from './MealForm';
import { PlanSummary } from './PlanSummary';

interface AddPlanContentModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (workoutPlans: DailyWorkoutPlan[], mealPlans: DailyMealPlan[]) => void;
  planType: 'workout' | 'meal' | 'combined';
  totalWorkoutDays?: number;
  totalMealDays?: number;
}

const getExerciseTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    chest: 'Tập ngực',
    back: 'Tập lưng',
    legs: 'Tập chân',
    shoulders: 'Tập vai',
    arms: 'Tập tay',
    abs: 'Tập bụng',
    cardio: 'Cardio',
    fullbody: 'Toàn thân',
  };
  return labels[type] || type;
};

export const AddPlanContentModal: React.FC<AddPlanContentModalProps> = ({
  visible,
  onClose,
  onSubmit,
  planType,
  totalWorkoutDays = 0,
  totalMealDays = 0,
}) => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);
  const [selectedWorkoutDay, setSelectedWorkoutDay] = useState(1);
  const [selectedMealDay, setSelectedMealDay] = useState(1);
  const [workoutPlans, setWorkoutPlans] = useState<DailyWorkoutPlan[]>([]);
  const [mealPlans, setMealPlans] = useState<DailyMealPlan[]>([]);
  const [activeTab, setActiveTab] = useState<'workout' | 'meal'>('workout');

  const handleAddWorkoutDay = async () => {
    try {
      const values = await form.validateFields(['exercises']);

      const exercises: Exercise[] = values.exercises?.map((ex: any, index: number) => ({
        id: `ex-${Date.now()}-${index}`,
        name: ex.name,
        sets: ex.sets,
        reps: ex.reps,
        duration: '30 phút',
        caloriesBurned: 100,
        description: ex.type ? `Loại: ${getExerciseTypeLabel(ex.type)}` : '',
      })) || [];

      const totalCalories = exercises.length * 100;

      const newWorkoutPlan: DailyWorkoutPlan = {
        day: `Ngày ${selectedWorkoutDay}`,
        date: new Date(Date.now() + selectedWorkoutDay * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        totalCalories,
        sessions: [
          {
            id: `session-${Date.now()}`,
            time: 'Buổi tập',
            exercises,
            totalCalories,
            totalDuration: `${exercises.length * 15} phút`,
          },
        ],
      };

      setWorkoutPlans([...workoutPlans, newWorkoutPlan]);
      form.resetFields(['exercises']);
      
      // Auto move to next day if not all days are filled
      if (selectedWorkoutDay < totalWorkoutDays) {
        setSelectedWorkoutDay(selectedWorkoutDay + 1);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAddMealDay = async () => {
    try {
      const values = await form.validateFields([
        'breakfast',
        'lunch',
        'dinner',
      ]);

      const createMeals = (mealData: any[]): Meal[] => {
        return mealData?.map((meal: any, index: number) => ({
          id: `meal-${Date.now()}-${index}`,
          name: meal.name,
          calories: meal.calories || 0,
          protein: meal.protein || 0,
          carbs: meal.carbs || 0,
          fat: meal.fat || 0,
          description: meal.description,
          ingredients: meal.ingredients?.split(',').map((i: string) => i.trim()) || [],
        })) || [];
      };

      const breakfast = createMeals(values.breakfast || []);
      const lunch = createMeals(values.lunch || []);
      const dinner = createMeals(values.dinner || []);

      const totalCalories = [...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.calories, 0);
      const totalProtein = [...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.protein, 0);
      const totalCarbs = [...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.carbs, 0);
      const totalFat = [...breakfast, ...lunch, ...dinner].reduce((sum, m) => sum + m.fat, 0);

      const newMealPlan: DailyMealPlan = {
        day: `Ngày ${selectedMealDay}`,
        date: new Date(Date.now() + selectedMealDay * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        completed: false,
        totalCalories,
        totalProtein,
        totalCarbs,
        totalFat,
        sessions: [
          { id: 'breakfast', time: 'Bữa sáng (7:00 AM)', meals: breakfast },
          { id: 'lunch', time: 'Bữa trưa (12:00 PM)', meals: lunch },
          { id: 'dinner', time: 'Bữa tối (7:00 PM)', meals: dinner },
        ].filter(s => s.meals.length > 0),
      };

      setMealPlans([...mealPlans, newMealPlan]);
      form.resetFields(['breakfast', 'lunch', 'dinner']);
      
      // Auto move to next day if not all days are filled
      if (selectedMealDay < totalMealDays) {
        setSelectedMealDay(selectedMealDay + 1);
      }
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleComplete = () => {
    setLoading(true);
    onSubmit(workoutPlans, mealPlans);
    setLoading(false);
    handleClose();
  };

  const handleClose = () => {
    form.resetFields();
    setWorkoutPlans([]);
    setMealPlans([]);
    setCurrentDay(1);
    onClose();
  };

  const tabItems = [
    ...(planType === 'workout' || planType === 'combined'
      ? [{
          key: 'workout',
          label: `Lịch tập (${workoutPlans.length}/${totalWorkoutDays})`,
        }]
      : []),
    ...(planType === 'meal' || planType === 'combined'
      ? [{
          key: 'meal',
          label: `Dinh dưỡng (${mealPlans.length}/${totalMealDays})`,
        }]
      : []),
  ];

  return (
    <Modal
      title="Thêm nội dung kế hoạch chi tiết"
      isOpen={visible}
      onClose={handleClose}
      size="xl"
      showFooter={true}
      className="workout-plan-modal"
      footerContent={
        <div className="flex justify-between items-center w-full">
          <div className="text-sm text-[var(--text-secondary)]">
            {planType === 'workout' && `Đã thêm ${workoutPlans.length}/${totalWorkoutDays} ngày tập`}
            {planType === 'meal' && `Đã thêm ${mealPlans.length}/${totalMealDays} ngày ăn`}
            {planType === 'combined' && `Tập: ${workoutPlans.length}/${totalWorkoutDays} | Ăn: ${mealPlans.length}/${totalMealDays}`}
          </div>
          <div className="flex gap-2">
            <Button onClick={handleClose}>
              Hủy
            </Button>
            <Button
              className="bg-orange-500 text-white hover:bg-orange-600"
              onClick={handleComplete}
              disabled={
                (planType === 'workout' && workoutPlans.length === 0) ||
                (planType === 'meal' && mealPlans.length === 0) ||
                (planType === 'combined' && (workoutPlans.length === 0 || mealPlans.length === 0))
              }
            >
              {loading ? 'Đang lưu...' : 'Hoàn thành'}
            </Button>
          </div>
        </div>
      }
    >
      <Tabs
        activeKey={activeTab}
        onChange={(key) => setActiveTab(key as 'workout' | 'meal')}
        items={tabItems}
        className="custom-orange-tabs"
      />

      <div className="modal-content-scroll">
        <Form form={form} layout="vertical" className="mt-4">
        {/* Workout Tab */}
        {activeTab === 'workout' && (planType === 'workout' || planType === 'combined') && (
          <div>
            <DaySelector
              totalDays={totalWorkoutDays}
              selectedDay={selectedWorkoutDay}
              addedDays={workoutPlans.map(p => p.day)}
              onSelectDay={setSelectedWorkoutDay}
            />
            <WorkoutForm onSubmit={handleAddWorkoutDay} />
          </div>
        )}

        {/* Meal Tab */}
        {activeTab === 'meal' && (planType === 'meal' || planType === 'combined') && (
          <div>
            <DaySelector
              totalDays={totalMealDays}
              selectedDay={selectedMealDay}
              addedDays={mealPlans.map(p => p.day)}
              onSelectDay={setSelectedMealDay}
            />

            <MealForm onSubmit={handleAddMealDay} />
          </div>
        )}
      </Form>

      <PlanSummary workoutPlans={workoutPlans} mealPlans={mealPlans} />
      </div>
    </Modal>
  );
};

export default AddPlanContentModal;
