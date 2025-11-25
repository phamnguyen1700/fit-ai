'use client';

import React, { useState, ChangeEvent, useMemo } from 'react';
import { Modal } from '@/shared/ui';
import { Input } from 'antd';
import { Icon } from '@/shared/ui/icon';
import { Avatar } from '@/shared/ui/core/Avatar';
import type { PlanReview, PlanReviewPayload } from '../types';
import { MealPlanDayView } from './MealPlanDayView';
import { WorkoutPlanDayView } from './WorkoutPlanDayView';

const { TextArea } = Input;

interface PlanReviewModalProps {
  plan: PlanReview | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: PlanReviewPayload) => void;
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
  onClose,
  onSubmit,
}) => {
  const [notes, setNotes] = useState('');
  const [activeTab, setActiveTab] = useState<string>('meal');
  const [selectedDay, setSelectedDay] = useState<number>(1);

  React.useEffect(() => {
    if (plan) {
      setNotes(plan.advisorNotes || '');
      // Set default tab based on plan type
      if (plan.planType === 'workout') {
        setActiveTab('workout');
      } else if (plan.planType === 'meal') {
        setActiveTab('meal');
      } else {
        setActiveTab('meal'); // Default to meal for combined
      }
      setSelectedDay(1);
    }
  }, [plan]);

  // Calculate summary stats from meal details for selected day
  const summaryStats = useMemo(() => {
    if (!plan?.mealDetails || plan.mealDetails.length === 0) {
      return { calories: 0, protein: 0, carbs: 0 };
    }

    // Get stats for selected day
    const dayMeal = plan.mealDetails[selectedDay - 1];
    if (!dayMeal) {
      return { calories: 0, protein: 0, carbs: 0 };
    }

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;

    dayMeal.meals.forEach((meal) => {
      totalCalories += meal.totalCalories;
      totalProtein += meal.totalProtein;
      totalCarbs += meal.totalCarbs;
    });

    return {
      calories: Math.round(totalCalories),
      protein: Math.round(totalProtein * 10) / 10,
      carbs: Math.round(totalCarbs * 10) / 10,
    };
  }, [plan, selectedDay]);

  // Get available days
  const availableDays = useMemo(() => {
    if (!plan) return [];
    const days: number[] = [];
    if (plan.planType === 'meal' || plan.planType === 'combined') {
      const maxDays = plan.mealDetails?.length || 0;
      for (let i = 1; i <= maxDays; i++) {
        days.push(i);
      }
    } else if (plan.planType === 'workout') {
      const maxDays = plan.workoutDetails?.length || 0;
      for (let i = 1; i <= maxDays; i++) {
        days.push(i);
      }
    }
    return days;
  }, [plan]);

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

  if (!plan) return null;

  // Get current day data
  const currentDayMeal = plan.mealDetails?.[selectedDay - 1];
  const currentDayWorkout = plan.workoutDetails?.find((w) => w.day === selectedDay);

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
                {plan.planName}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs for Meal/Workout */}
        {(plan.planType === 'combined' || plan.planType === 'meal' || plan.planType === 'workout') && (
          <div className="flex gap-1 mb-6 border-b border-[var(--border)] -mb-6">
            {plan.planType === 'combined' && (
              <>
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('meal');
                    setSelectedDay(1);
                  }}
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
                <button
                  type="button"
                  onClick={() => {
                    setActiveTab('workout');
                    setSelectedDay(1);
                  }}
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
              </>
            )}
            {plan.planType === 'meal' && (
              <button
                type="button"
                className="px-5 py-3 font-semibold text-sm border-b-2 border-[var(--primary)] text-[var(--primary)]"
              >
                <span className="flex items-center gap-2">
                  <Icon name="mdi:food-apple" size={18} />
                  Thực đơn
                </span>
              </button>
            )}
            {plan.planType === 'workout' && (
              <button
                type="button"
                className="px-5 py-3 font-semibold text-sm border-b-2 border-[var(--primary)] text-[var(--primary)]"
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
            {/* Summary Cards */}
            {activeTab === 'meal' && plan.mealDetails && plan.mealDetails.length > 0 && (
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
                    <Icon name="mdi:weight-lifter" size={16} className="text-blue-500" />
                    <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                      Protein
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text)]">
                    {summaryStats.protein}g
                  </div>
                </div>
                <div className="rounded-xl border border-[var(--border)] bg-gradient-to-br from-[var(--bg-secondary)] to-white p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name="mdi:grain" size={16} className="text-green-500" />
                    <div className="text-xs font-medium text-[var(--text-secondary)] uppercase tracking-wide">
                      Carbs
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-[var(--text)]">
                    {summaryStats.carbs}g
                  </div>
                </div>
              </div>
            )}

            {/* Day Navigation */}
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

            {/* Day Content */}
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
                  onClick={() => {
                    if (notes.trim() === '') {
                      alert('Vui lòng nhập nhận xét trước khi gửi quyết định');
                      return;
                    }
                    handleApprove();
                  }}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-[#52c41a] to-[#73d13d] text-white font-semibold hover:from-[#73d13d] hover:to-[#52c41a] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  <Icon name="mdi:check-circle" size={18} />
                  <span>Duyệt plan</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (notes.trim() === '') {
                      alert('Vui lòng nhập nhận xét trước khi gửi quyết định');
                      return;
                    }
                    handleRequestModification();
                  }}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-[#fa8c16] to-[#ffa940] text-white font-semibold hover:from-[#ffa940] hover:to-[#fa8c16] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  <Icon name="mdi:pencil" size={18} />
                  <span>Yêu cầu chỉnh sửa</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (notes.trim() === '') {
                      alert('Vui lòng nhập nhận xét trước khi gửi quyết định');
                      return;
                    }
                    handleReject();
                  }}
                  className="w-full h-11 rounded-lg bg-gradient-to-r from-[var(--error)] to-[#ff7875] text-white font-semibold hover:from-[#ff7875] hover:to-[var(--error)] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                >
                  <Icon name="mdi:close-circle" size={18} />
                  <span>Từ chối plan</span>
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
                  {plan.healthIssues.map((issue, index) => (
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
