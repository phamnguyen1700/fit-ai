'use client';

import React, { useState, ChangeEvent, useMemo } from 'react';
import { Modal } from '@/shared/ui';
import { Input } from 'antd';
import { Icon } from '@/shared/ui/icon';
import { usePlanReviewDetail } from '@/tanstack/hooks/planreview';
import {
  updatePlanMealService,
  updatePlanWorkoutService,
} from '@/tanstack/services/planreview';
import type {
  MealPlanDayDetail,
  MealDetail,
  MealFoodDetail,
  WorkoutPlanDayDetail,
  WorkoutPlanExerciseDetail,
} from '@/types/planreview';
import toast from 'react-hot-toast';
import { useGetExercises } from '@/tanstack/hooks/exercise';
import type { Exercise } from '@/types/exercise';

const { TextArea } = Input;
export type SubmittedPlanReview = {
  planId: string;
  status: 'approved' | 'rejected';
  advisorNotes?: string;
};
interface PlanReviewModalProps {
  plan: any;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: SubmittedPlanReview) => void;
}

export const PlanReviewModal: React.FC<PlanReviewModalProps> = ({
  plan,
  isOpen,
  isSubmitting,
  onClose,
  onSubmit,
}) => {
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'meal' | 'workout'>('meal');
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [workoutGoal, setWorkoutGoal] = useState('');
  const [workoutNotes, setWorkoutNotes] = useState('');
  const [mealDietType, setMealDietType] = useState('');
  const [mealTotalCalories, setMealTotalCalories] = useState('');
  const [workoutDaysState, setWorkoutDaysState] = useState<WorkoutPlanDayDetail[]>([]);
  const [mealDaysState, setMealDaysState] = useState<MealPlanDayDetail[]>([]);
  const [isSavingWorkout, setIsSavingWorkout] = useState(false);
  const [isSavingMeal, setIsSavingMeal] = useState(false);
  const [isEditingWorkout, setIsEditingWorkout] = useState(false);
  const [isEditingMeal, setIsEditingMeal] = useState(false);
  const {
    data: detailResponse,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = usePlanReviewDetail(plan?.id);
  const { data: exerciseResponse } = useGetExercises();
  const exerciseOptions: Exercise[] = exerciseResponse?.data ?? [];

  const detail = detailResponse?.data as any;
  const mealDays = mealDaysState;
  const workoutDays = workoutDaysState;
  const hasMealPlan = mealDays.length > 0;
  const hasWorkoutPlan = workoutDays.length > 0;

  React.useEffect(() => {
    if (plan) {
      setNotes(plan.advisorNotes || '');
    }
  }, [plan?.id, plan?.advisorNotes]);

  React.useEffect(() => {
  if (!detail) {
    setWorkoutGoal(plan?.goal || '');
    setWorkoutNotes('');
    setMealDietType('');
    setMealTotalCalories('');
    setWorkoutDaysState([]);
    setMealDaysState([]);
    return;
  }

  const cloneWorkout =
    Array.isArray(detail?.workoutPlan?.days) && detail?.workoutPlan?.days.length
      ? detail.workoutPlan.days.map((day: WorkoutPlanDayDetail) => ({
          ...day,
          exercises: day.exercises.map((exercise) => ({ ...exercise })),
        }))
      : [];

  const cloneMeal =
    Array.isArray(detail?.mealPlan?.days) && detail?.mealPlan?.days.length
      ? detail.mealPlan.days.map((day: MealPlanDayDetail) => ({
          ...day,
          meals: day.meals.map((meal: MealDetail) => ({
            ...meal,
            foods: meal.foods.map((food: MealFoodDetail) => ({ ...food })),
          })),
        }))
      : [];

  setWorkoutDaysState(cloneWorkout);
  setMealDaysState(cloneMeal);
  setWorkoutGoal(detail?.workoutPlan?.goal || plan?.goal || '');
  setWorkoutNotes(detail?.workoutPlan?.notes || '');
  setMealDietType(detail?.mealPlan?.dietType || '');
  setMealTotalCalories(
    detail?.mealPlan?.totalCalories ? String(detail?.mealPlan?.totalCalories) : ''
  );
  setIsEditingWorkout(false);
  setIsEditingMeal(false);
}, [detail?.planId, plan?.goal, plan?.id]);

React.useEffect(() => {
  if (!detail) return;
  setActiveTab((prev) => {
    if (prev === 'meal' && hasMealPlan) return prev;
    if (prev === 'workout' && hasWorkoutPlan) return prev;
    if (hasMealPlan) return 'meal';
    if (hasWorkoutPlan) return 'workout';
    return prev;
  });
}, [detail?.planId, hasMealPlan, hasWorkoutPlan]);

  React.useEffect(() => {
    const days = activeTab === 'meal' ? mealDays : workoutDays;
    if (days.length === 0) return;
    const exists = days.some((day) => day.dayNumber === selectedDay);
    if (!exists) {
      setSelectedDay(days[0].dayNumber);
    }
  }, [activeTab, mealDays, workoutDays, selectedDay]);

  const summaryStats = useMemo(() => {
    if (activeTab !== 'meal') return null;
    const dayMeal = mealDays.find((day) => day.dayNumber === selectedDay);
    if (!dayMeal) return null;
    return {
      calories: dayMeal.totalCalories,
      meals: dayMeal.meals.length,
      dietType: detail?.mealPlan?.dietType,
    };
  }, [activeTab, mealDays, selectedDay, detail?.mealPlan?.dietType]);

  const availableDays = useMemo(() => {
    const days = activeTab === 'meal' ? mealDays : workoutDays;
    return days.map((day) => day.dayNumber);
  }, [activeTab, mealDays, workoutDays]);

const handleWorkoutFieldChange = (
  dayNumber: number,
  exerciseIndex: number,
  field: keyof WorkoutPlanExerciseDetail,
  value: any
) => {
  setWorkoutDaysState((prev) =>
    prev.map((day) =>
      day.dayNumber === dayNumber
        ? {
            ...day,
            exercises: day.exercises.map((exercise, idx) =>
              idx === exerciseIndex ? { ...exercise, [field]: value } : exercise
            ),
          }
        : day
    )
  );
};

const handleWorkoutSessionNameChange = (dayNumber: number, value: string) => {
  setWorkoutDaysState((prev) =>
    prev.map((day) => (day.dayNumber === dayNumber ? { ...day, sessionName: value } : day))
  );
};

const handleMealFieldChange = (
  dayNumber: number,
  mealIndex: number,
  field: keyof MealDetail,
  value: any
) => {
  setMealDaysState((prev) =>
    prev.map((day) =>
      day.dayNumber === dayNumber
        ? {
            ...day,
            meals: day.meals.map((meal, idx) =>
              idx === mealIndex ? { ...meal, [field]: value } : meal
            ),
          }
        : day
    )
  );
};

const handleMealFoodChange = (
  dayNumber: number,
  mealIndex: number,
  foodIndex: number,
  field: keyof MealFoodDetail,
  value: any
) => {
  setMealDaysState((prev) =>
    prev.map((day) =>
      day.dayNumber === dayNumber
        ? {
            ...day,
            meals: day.meals.map((meal, idx) =>
              idx === mealIndex
                ? {
                    ...meal,
                    foods: meal.foods.map((food, fIdx) =>
                      fIdx === foodIndex ? { ...food, [field]: value } : food
                    ),
                  }
                : meal
            ),
          }
        : day
    )
  );
};

const handleMealDayFieldChange = (
  dayNumber: number,
  field: keyof MealPlanDayDetail,
  value: any
) => {
  setMealDaysState((prev) =>
    prev.map((day) => (day.dayNumber === dayNumber ? { ...day, [field]: value } : day))
  );
};

const handleWorkoutExerciseSelect = (
  dayNumber: number,
  exerciseIndex: number,
  exerciseId: string
) => {
  const selected = exerciseOptions.find((exercise) => exercise.id === exerciseId);
  setWorkoutDaysState((prev) =>
    prev.map((day) =>
      day.dayNumber === dayNumber
        ? {
            ...day,
            exercises: day.exercises.map((exercise, idx) =>
              idx === exerciseIndex
                ? {
                    ...exercise,
                    exerciseId,
                    name: selected?.name || exercise.name,
                    category: selected?.categoryName || exercise.category,
                  }
                : exercise
            ),
          }
        : day
    )
  );
};

  const handleApprove = () => {
    if (!plan) return;
    onSubmit({
      planId: plan.id,
      status: 'approved',
      advisorNotes: notes,
    });
  };

  const handleSaveWorkoutChanges = async () => {
    if (!plan) return;
    try {
      setIsSavingWorkout(true);
      await updatePlanWorkoutService(plan.id, workoutDaysState);
      toast.success('Đã lưu workout plan');
      refetchDetail();
      setIsEditingWorkout(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lưu workout plan thất bại');
    } finally {
      setIsSavingWorkout(false);
    }
  };

  const handleSaveMealChanges = async () => {
    if (!plan) return;
    try {
      setIsSavingMeal(true);
      await updatePlanMealService(plan.id, mealDaysState);
      toast.success('Đã lưu meal plan');
      refetchDetail();
      setIsEditingMeal(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Lưu meal plan thất bại');
    } finally {
      setIsSavingMeal(false);
    }
  };

  const handleTabChange = (tab: 'meal' | 'workout') => {
    setActiveTab(tab);
    const days = tab === 'meal' ? mealDays : workoutDays;
    if (days.length > 0) {
      setSelectedDay(days[0].dayNumber);
    } else {
      setSelectedDay(1);
    }
  };

  if (!plan) return null;

  const currentDayMeal = mealDays.find((day) => day.dayNumber === selectedDay);
  const currentDayWorkout = workoutDays.find((day) => day.dayNumber === selectedDay);
  const planTitle = workoutGoal || detail?.fitnessGoal || plan.goal || plan.planName || 'Plan AI';
  const planSubtitle = plan.planName || workoutGoal || mealDietType || '';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="2xl"
      className="plan-review-modal"
    >
      <div className="flex flex-col h-full max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center pb-5 border-b border-[var(--border)] mb-5">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary)]/80 flex items-center justify-center">
              <Icon name="mdi:robot" size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-[var(--text)] leading-tight">
                Plan AI - {plan.userName}
              </h2>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {planSubtitle || planTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs for Meal/Workout */}
        {(hasMealPlan || hasWorkoutPlan) && (
          <div className="flex gap-1 mb-6 border-b border-[var(--border)] -mb-6">
            {hasMealPlan && (
                <button
                  type="button"
                onClick={() => handleTabChange('meal')}
                  className={`px-5 py-3 font-semibold text-sm transition-all duration-200 border-b-2 relative ${
                    activeTab === 'meal'
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--primary)]/30'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon name="mdi:food-apple" size={18} />
                    Thực đơn
                  </span>
                </button>
            )}
            {hasWorkoutPlan && (
                <button
                  type="button"
                onClick={() => handleTabChange('workout')}
                  className={`px-5 py-3 font-semibold text-sm transition-all duration-200 border-b-2 relative ${
                    activeTab === 'workout'
                      ? 'border-[var(--primary)] text-[var(--primary)]'
                      : 'border-transparent text-[var(--text-secondary)] hover:text-[var(--text)] hover:border-[var(--primary)]/30'
                  }`}
              >
                <span className="flex items-center gap-2">
                  <Icon name="mdi:dumbbell" size={18} />
                  Tập luyện
                </span>
              </button>
            )}
          </div>
        )}

        <div className="flex gap-6 flex-1 min-h-0 pt-6">
          {/* Left Content */}
          <div className="flex-1 flex flex-col min-w-0">
            {isDetailLoading ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-3 text-[var(--text-secondary)]">
                <Icon name="mdi:loading" size={32} className="animate-spin" />
                <p>Đang tải chi tiết kế hoạch...</p>
              </div>
            ) : isDetailError ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center text-red-500">
                <Icon name="mdi:alert-circle-outline" size={40} />
                <p>Không thể tải chi tiết kế hoạch. Vui lòng thử lại.</p>
                <button
                  type="button"
                  onClick={() => refetchDetail()}
                  className="px-4 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold"
                >
                  Thử lại
                </button>
              </div>
            ) : !hasMealPlan && !hasWorkoutPlan ? (
              <div className="flex-1 flex items-center justify-center text-[var(--text-secondary)]">
                Chưa có dữ liệu chi tiết cho plan này.
              </div>
            ) : (
              <>
                {activeTab === 'meal' && summaryStats && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-secondary)] to-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="mdi:fire" size={16} className="text-orange-500" />
                    <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                      Calories/ngày
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text)]">
                    {summaryStats.calories}
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-secondary)] to-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-2 mb-2">
                        <Icon name="mdi:silverware-fork-knife" size={16} className="text-blue-500" />
                    <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                          Số bữa ăn
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text)]">
                        {summaryStats.meals}
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-secondary)] to-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-2 mb-2">
                        <Icon name="mdi:leaf" size={16} className="text-green-500" />
                    <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                          Chế độ ăn
                    </div>
                  </div>
                      <div className="text-lg font-bold text-[var(--text)]">
                        {summaryStats.dietType || '—'}
                  </div>
                </div>
              </div>
            )}

            {availableDays.length > 0 && (
              <div className="mb-5">
                <div className="text-sm font-medium text-[var(--text-secondary)] mb-3 flex items-center gap-2">
                  <Icon name="mdi:calendar-range" size={16} />
                  <span>Xem {activeTab === 'meal' ? 'thực đơn' : 'kế hoạch tập luyện'} theo ngày:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availableDays.map((day) => (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDay(day)}
                      className={`px-4 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 ${
                        selectedDay === day
                          ? 'bg-[var(--primary)] text-white shadow-lg shadow-[var(--primary)]/30 transform scale-105'
                          : 'bg-white text-[var(--text)] border-2 border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)] hover:shadow-md'
                      }`}
                    >
                      Ngày {day}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="flex-1 overflow-y-auto pr-3 custom-scrollbar">
                  {activeTab === 'workout' && currentDayWorkout && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center gap-3 justify-between">
                        <Icon name="mdi:dumbbell" size={20} className="text-[var(--primary)]" />
                        <div className="flex-1 flex flex-col gap-1">
                          <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                            Tên buổi tập
                          </span>
                          <Input
                            value={currentDayWorkout.sessionName}
                            disabled={!isEditingWorkout}
                            placeholder="Ví dụ: Chest day"
                            onChange={(e) =>
                              handleWorkoutSessionNameChange(
                                currentDayWorkout.dayNumber,
                                e.target.value
                              )
                            }
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingWorkout((prev) => !prev)}
                          className="text-xs font-semibold text-[var(--primary)] underline"
                        >
                          {isEditingWorkout ? 'Hủy' : 'Update'}
                        </button>
                      </div>
                      {currentDayWorkout.exercises.map((exercise, index) => (
                        <div
                          key={`${currentDayWorkout.dayNumber}-exercise-${index}`}
                          className="rounded-lg border border-[var(--border)] bg-white p-4 flex flex-col gap-3"
                        >
                          {isEditingWorkout && (
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                                Chọn từ kho bài tập
                              </span>
                              <select
                                value={exercise.exerciseId || ''}
                                onChange={(e) =>
                                  handleWorkoutExerciseSelect(
                                    currentDayWorkout.dayNumber,
                                    index,
                                    e.target.value
                                  )
                                }
                                className="border border-[var(--border)] rounded-lg px-3 py-2 text-sm bg-white focus:border-[var(--primary)] outline-none"
                              >
                                <option value="">Chọn bài tập</option>
                                {exerciseOptions.map((option) => (
                                  <option key={option.id} value={option.id}>
                                    {option.name}
                                  </option>
                                ))}
                              </select>
                            </div>
                          )}
                          <div className="text-sm font-semibold text-[var(--text)]">
                            Bài tập {index + 1}
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-[var(--text-secondary)]">Tên bài tập</span>
                              <Input
                                value={exercise.name}
                                disabled={!isEditingWorkout}
                                placeholder="Ví dụ: Push up"
                                onChange={(e) =>
                                  handleWorkoutFieldChange(
                                    currentDayWorkout.dayNumber,
                                    index,
                                    'name',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-[var(--text-secondary)]">Nhóm cơ</span>
                              <Input
                                value={exercise.category}
                                disabled={!isEditingWorkout}
                                placeholder="Ví dụ: Ngực"
                                onChange={(e) =>
                                  handleWorkoutFieldChange(
                                    currentDayWorkout.dayNumber,
                                    index,
                                    'category',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-[var(--text-secondary)]">Số set</span>
                              <Input
                                type="number"
                                value={exercise.sets}
                                disabled={!isEditingWorkout}
                                placeholder="Ví dụ: 4"
                                onChange={(e) =>
                                  handleWorkoutFieldChange(
                                    currentDayWorkout.dayNumber,
                                    index,
                                    'sets',
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-[var(--text-secondary)]">Số reps</span>
                              <Input
                                value={exercise.reps}
                                disabled={!isEditingWorkout}
                                placeholder="Ví dụ: 12"
                                onChange={(e) =>
                                  handleWorkoutFieldChange(
                                    currentDayWorkout.dayNumber,
                                    index,
                                    'reps',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-[var(--text-secondary)]">Thời lượng (phút)</span>
                              <Input
                                type="number"
                                value={exercise.durationMinutes ?? ''}
                                disabled={!isEditingWorkout}
                                placeholder="Ví dụ: 30"
                                onChange={(e) =>
                                  handleWorkoutFieldChange(
                                    currentDayWorkout.dayNumber,
                                    index,
                                    'durationMinutes',
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs text-[var(--text-secondary)]">Link video</span>
                              <Input
                                value={exercise.videoUrl}
                                disabled={!isEditingWorkout}
                                placeholder="https://..."
                                onChange={(e) =>
                                  handleWorkoutFieldChange(
                                    currentDayWorkout.dayNumber,
                                    index,
                                    'videoUrl',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-[var(--text-secondary)]">Ghi chú</span>
                            <TextArea
                              value={exercise.note}
                              rows={2}
                              disabled={!isEditingWorkout}
                              placeholder="Ví dụ: Giữ lưng thẳng"
                              onChange={(e) =>
                                handleWorkoutFieldChange(
                                  currentDayWorkout.dayNumber,
                                  index,
                                  'note',
                                  e.target.value
                                )
                              }
                            />
                          </div>
                        </div>
                      ))}
                      {isEditingWorkout && (
                        <button
                          type="button"
                          onClick={handleSaveWorkoutChanges}
                          disabled={isSavingWorkout}
                          className={`mt-2 w-full h-11 rounded-lg border border-[var(--primary)] font-semibold ${
                            isSavingWorkout
                              ? 'opacity-60 cursor-not-allowed'
                              : 'text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all'
                          }`}
                        >
                          {isSavingWorkout ? 'Đang lưu workout...' : 'Lưu thay đổi workout'}
                        </button>
                      )}
                    </div>
                  )}
              {activeTab === 'meal' && currentDayMeal && (
                    <div className="flex flex-col gap-4">
                      <div className="flex items-center justify-between gap-2">
                        <div className="grid grid-cols-2 gap-4 flex-1">
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                              Calories/ngày
                            </span>
                            <Input
                              type="number"
                              value={currentDayMeal.totalCalories}
                              disabled={!isEditingMeal}
                              placeholder="Ví dụ: 2400"
                              onChange={(e) =>
                                handleMealDayFieldChange(
                                  currentDayMeal.dayNumber,
                                  'totalCalories',
                                  Number(e.target.value)
                                )
                              }
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                              Chế độ ăn
                            </span>
                            <Input
                              value={mealDietType}
                              disabled={!isEditingMeal}
                              placeholder="Ví dụ: Normal"
                              onChange={(e) => setMealDietType(e.target.value)}
                            />
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsEditingMeal((prev) => !prev)}
                          className="text-xs font-semibold text-[var(--primary)] underline"
                        >
                          {isEditingMeal ? 'Hủy' : 'Update'}
                        </button>
                      </div>
                      {currentDayMeal.meals.map((meal, mealIndex) => (
                        <div
                          key={`${currentDayMeal.dayNumber}-meal-${mealIndex}`}
                          className="rounded-lg border border-[var(--border)] bg-white p-4 flex flex-col gap-3"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                                Loại bữa
                              </span>
                              <Input
                                value={meal.type}
                                disabled={!isEditingMeal}
                                placeholder="Ví dụ: Breakfast"
                                onChange={(e) =>
                                  handleMealFieldChange(
                                    currentDayMeal.dayNumber,
                                    mealIndex,
                                    'type',
                                    e.target.value
                                  )
                                }
                              />
                            </div>
                            <div className="flex flex-col gap-1">
                              <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
                                Calories bữa ăn
                              </span>
                              <Input
                                type="number"
                                value={meal.calories}
                                disabled={!isEditingMeal}
                                placeholder="Ví dụ: 450"
                                onChange={(e) =>
                                  handleMealFieldChange(
                                    currentDayMeal.dayNumber,
                                    mealIndex,
                                    'calories',
                                    Number(e.target.value)
                                  )
                                }
                              />
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <span className="text-xs font-semibold text-[var(--text-secondary)]">
                              Thành phần
                            </span>
                            {meal.foods.map((food, foodIndex) => (
                              <div
                                key={`${currentDayMeal.dayNumber}-meal-${mealIndex}-food-${foodIndex}`}
                                className="grid grid-cols-2 gap-4"
                              >
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs text-[var(--text-secondary)]">Tên món</span>
                                  <Input
                                    value={food.name}
                                    disabled={!isEditingMeal}
                                    placeholder="Ví dụ: Bún bò"
                                    onChange={(e) =>
                                      handleMealFoodChange(
                                        currentDayMeal.dayNumber,
                                        mealIndex,
                                        foodIndex,
                                        'name',
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-xs text-[var(--text-secondary)]">Định lượng</span>
                                  <Input
                                    value={food.quantity}
                                    disabled={!isEditingMeal}
                                    placeholder="Ví dụ: 1 tô"
                                    onChange={(e) =>
                                      handleMealFoodChange(
                                        currentDayMeal.dayNumber,
                                        mealIndex,
                                        foodIndex,
                                        'quantity',
                                        e.target.value
                                      )
                                    }
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                      {isEditingMeal && (
                        <button
                          type="button"
                          onClick={handleSaveMealChanges}
                          disabled={isSavingMeal}
                          className={`mt-2 w-full h-11 rounded-lg border border-[var(--primary)] font-semibold ${
                            isSavingMeal
                              ? 'opacity-60 cursor-not-allowed'
                              : 'text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white transition-all'
                          }`}
                        >
                          {isSavingMeal ? 'Đang lưu meal...' : 'Lưu thay đổi meal'}
                        </button>
                      )}
                </div>
              )}

                  {((activeTab === 'meal' && !currentDayMeal) ||
                    (activeTab === 'workout' && !currentDayWorkout)) && (
                <div className="text-center py-12 text-[var(--text-secondary)]">
                  <Icon name="mdi:information-outline" size={48} className="mx-auto mb-3 opacity-50" />
                  <p>Không có dữ liệu cho ngày {selectedDay}</p>
                </div>
              )}
            </div>
              </>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="w-80 flex-shrink-0 border-l-2 border-[var(--border)] pl-6 flex flex-col gap-5">
            {/* Decision Section */}
            <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-white rounded-xl p-4 border border-[var(--border)]">
              <h3 className="text-sm font-bold text-[var(--text)] mb-4 flex items-center gap-2">
                <Icon name="mdi:check-circle-outline" size={18} className="text-[var(--primary)]" />
                Quyết định của bạn:
              </h3>
              <div className="flex flex-col gap-2.5">
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => {
                    if (notes.trim() === '') {
                      alert('Vui lòng nhập nhận xét trước khi gửi quyết định');
                      return;
                    }
                    handleApprove();
                  }}
                  className={`w-full h-11 rounded-lg bg-gradient-to-r from-[#52c41a] to-[#73d13d] text-white font-semibold flex items-center justify-center gap-2 shadow-md transition-all duration-200 ${
                    isSubmitting
                      ? 'opacity-60 cursor-not-allowed'
                      : 'hover:from-[#73d13d] hover:to-[#52c41a] hover:shadow-lg transform hover:scale-[1.02]'
                  }`}
                >
                  <Icon name="mdi:check-circle" size={18} />
                  <span>{isSubmitting ? 'Đang duyệt...' : 'Duyệt plan'}</span>
                </button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gradient-to-br from-[var(--bg-secondary)] to-white rounded-xl p-4 border border-[var(--border)]">
              <label className="flex items-center gap-2 text-sm font-bold text-[var(--text)] mb-3">
                <Icon name="mdi:note-text-outline" size={18} className="text-[var(--primary)]" />
                Nhận xét chi tiết:
              </label>
              <TextArea
                value={notes}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setNotes(e.target.value)}
                rows={6}
                placeholder="Nhập nhận xét của bạn về plan này..."
                className="resize-none rounded-lg border-2 border-[var(--border)] focus:border-[var(--primary)] transition-colors"
              />
            </div>

            {/* Health Issues */}
            {plan.healthIssues && plan.healthIssues.length > 0 && (
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-4 border-2 border-purple-200">
                <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                  <Icon name="mdi:heart-pulse" size={18} className="text-purple-600" />
                  Vấn đề sức khỏe:
                </h3>
                <div className="flex flex-col gap-2">
                  {plan.healthIssues.map((issue: string, index: number) => (
                    <div
                      key={index}
                      className="rounded-lg bg-white border border-purple-200 p-3 text-sm text-purple-900 shadow-sm"
                    >
                      <div className="flex items-start gap-2">
                        <Icon name="mdi:alert-circle" size={16} className="text-purple-600 mt-0.5 flex-shrink-0" />
                        <span>{issue}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .plan-review-modal input.ant-input[disabled],
        .plan-review-modal textarea.ant-input[disabled] {
          color: var(--text) !important;
          -webkit-text-fill-color: var(--text);
          font-weight: 600;
          opacity: 1;
        }

        .plan-review-modal input.ant-input[disabled]::placeholder,
        .plan-review-modal textarea.ant-input[disabled]::placeholder {
          color: var(--text-secondary) !important;
          font-weight: 500;
        }

        .plan-review-modal select:disabled {
          color: var(--text);
          font-weight: 600;
          opacity: 1;
          background-color: var(--bg-secondary);
        }
      `}</style>
    </Modal>
  );
};

export default PlanReviewModal;
