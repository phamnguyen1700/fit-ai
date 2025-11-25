'use client';

import React, { useState, ChangeEvent, useMemo } from 'react';
import { Modal } from '@/shared/ui';
import { Input } from 'antd';
import { Icon } from '@/shared/ui/icon';
import { MealPlanDayView } from './MealPlanDayView';
import { WorkoutPlanDayView } from './WorkoutPlanDayView';
import { usePlanReviewDetail } from '@/tanstack/hooks/planreview';

const { TextArea } = Input;

interface PlanReviewModalProps {
  plan: any;
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (payload: any) => void;
}

const formatDateTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

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
  const {
    data: detailResponse,
    isLoading: isDetailLoading,
    isError: isDetailError,
    refetch: refetchDetail,
  } = usePlanReviewDetail(plan?.id);

  const detail = detailResponse?.data as any;
  const mealDays: any[] = Array.isArray(detail?.mealPlan?.days) ? detail?.mealPlan?.days : [];
  const workoutDays: any[] = Array.isArray(detail?.workoutPlan?.days) ? detail?.workoutPlan?.days : [];
  const hasMealPlan = mealDays.length > 0;
  const hasWorkoutPlan = workoutDays.length > 0;

  React.useEffect(() => {
    if (plan) {
      setNotes(plan.advisorNotes || '');
    }
  }, [plan?.id, plan?.advisorNotes]);

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

  const handleApprove = () => {
    if (!plan) return;
    onSubmit({
      planId: plan.id,
      status: 'approved',
      advisorNotes: notes,
    });
  };

  const handleRequestModification = () => {
    if (!plan) return;
    onSubmit({
      planId: plan.id,
      status: 'request-modification',
      advisorNotes: notes,
    });
  };

  const handleReject = () => {
    if (!plan) return;
    onSubmit({
      planId: plan.id,
      status: 'rejected',
      advisorNotes: notes,
    });
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
  const planTitle = detail?.fitnessGoal || plan.goal || plan.planName || 'Plan AI';
  const planSubtitle = plan.planName || plan.goal || detail?.workoutPlan?.goal || '';

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
                  {activeTab === 'meal' && currentDayMeal && (
                    <MealPlanDayView dayMeal={currentDayMeal} dayNumber={selectedDay} />
                  )}
                  {activeTab === 'workout' && currentDayWorkout && (
                    <WorkoutPlanDayView workout={currentDayWorkout} dayNumber={selectedDay} />
                  )}
                  {activeTab === 'meal' && !currentDayMeal && (
                    <div className="text-center py-12 text-[var(--text-secondary)]">
                      <Icon name="mdi:information-outline" size={48} className="mx-auto mb-3 opacity-50" />
                      <p>Không có dữ liệu cho ngày {selectedDay}</p>
                    </div>
                  )}
                  {activeTab === 'workout' && !currentDayWorkout && (
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
    </Modal>
  );
};

export default PlanReviewModal;
