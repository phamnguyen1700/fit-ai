'use client';

import React, { createContext, useContext, useMemo } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Avatar } from '@/shared/ui/core/Avatar';
import { Flex } from '@/shared/ui/core/Flex';
import { Icon } from '@/shared/ui/icon';
import { usePendingPlans } from '@/tanstack/hooks/planreview';
import { PendingPlan } from '@/types/planreview';

type PlanReviewCardDataContextType = {
  plans: MappedPlanReview[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;
}
const PlanReviewCardDataContext = createContext<PlanReviewCardDataContextType>({} as PlanReviewCardDataContextType);

const normalizeGender = (gender?: string) => {
  if (!gender) return undefined;
  const lower = gender.toLowerCase();
  if (lower === 'male' || lower === 'female') {
    return lower;
  }
  return 'other';
};

export type MappedPlanReview = {
  id: string,
  userId: string,
  userName: string,
  userEmail: string,
  userAvatar?: string,
  userGender?: string;
  planName: string;
  planType: string,
  goal: string;
  duration: string;
  startDate?: string;
  endDate?: string;
  status: string,
  totalDays: number,
  completedDays: number,
  progress: number,
  generatedBy: string,
  createdAt: string,
  reviewStatus: string,
  submittedAt: string,
  workoutDetails?: unknown,
  mealDetails?: unknown,
  apiSource: PendingPlan,
  advisorNotes?: string;
  healthIssues?: string[];
};

const mapPendingPlanToPlanReview = (plan: PendingPlan): MappedPlanReview => {
  const mapped = {
    id: plan.planId,
    userId: plan.userId,
    userName: plan.userName || 'Khách hàng',
    userEmail: '',
    userAvatar: undefined,
    userGender: normalizeGender(plan.userGender),
    planName: '',
    planType: 'combined',
    goal: plan.fitnessGoal,
    duration: '',
    startDate: undefined,
    endDate: undefined,
    status: 'pending',
    totalDays: 0,
    completedDays: 0,
    progress: 0,
    generatedBy: 'ai',
    createdAt: plan.createdAt,
    reviewStatus: 'pending',
    submittedAt: plan.createdAt,
    workoutDetails: undefined,
    mealDetails: undefined,
    apiSource: plan,
  };

  return mapped;
};

export const PlanReviewCardDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data, isLoading, isError, error, refetch } = usePendingPlans();
  const plans = useMemo(() => {
    const pendingPlans = data?.data ?? [];
    return pendingPlans.map(mapPendingPlanToPlanReview);
  }, [data]);

  const value = {
    plans,
    isLoading,
    isError,
    error,
    refetch,
  };

  return (
    <PlanReviewCardDataContext.Provider value={value}>
      {children}
    </PlanReviewCardDataContext.Provider>
  );
};

export const usePlanReviewCardData = () => {
  const context = useContext(PlanReviewCardDataContext);
  if (!context) {
    throw new Error('usePlanReviewCardData must be used within PlanReviewCardDataProvider');
  }
  return context;
};

type PlanReviewCardProps = {
  plan: MappedPlanReview;
  onReview?: (plan: MappedPlanReview) => void;
};

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

export const PlanReviewCard: React.FC<PlanReviewCardProps> = ({ plan, onReview }) => {
  const apiPlan = plan.apiSource;
  const userGender = apiPlan?.userGender || plan.userGender;
  const fitnessGoal = apiPlan?.fitnessGoal || plan.goal;
  const statusLabel = apiPlan?.status || plan.status;

  return (
    <Card className="h-full flex flex-col">
      <div className="flex h-full flex-col gap-4">
        {/* Header Section */}
        <Flex align="center" justify="space-between" className="flex-shrink-0 pb-3 border-b border-[var(--border)]">
          <Flex align="center" gap={12} wrap className="flex-1 min-w-0">
            <Avatar
              size={52}
              src={plan.userAvatar}
              className="flex-shrink-0"
            >
              {plan.userName.charAt(0)}
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-base font-semibold text-[var(--text)] mb-1">{plan.userName}</div>
              {userGender && (
                <div className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] mb-1 capitalize">
                  <Icon name="mdi:account-badge" size={14} />
                  <span>{userGender}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 text-xs text-[var(--text-tertiary)]">
                <Icon name="mdi:clock-outline" size={12} />
                <span>Gửi: {formatDateTime(plan.submittedAt)}</span>
              </div>
              {statusLabel && (
                <div className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--primary)] bg-[var(--primary)]/10 px-2 py-1 rounded mt-2">
                  <Icon name="mdi:progress-check" size={12} />
                  {statusLabel}
                </div>
              )}
            </div>
          </Flex>
        </Flex>

        {/* Content Section */}
        <div className="flex flex-col gap-3.5 flex-1 min-h-0">
          {/* Goal */}
          {fitnessGoal && (
            <div className="rounded-lg bg-[var(--bg-secondary)] p-3.5 border-l-4 border-[var(--primary)]">
              <div className="flex items-center gap-2 mb-2">
                <Icon name="mdi:target" size={16} className="text-[var(--primary)]" />
                <span className="text-xs font-semibold text-[var(--text-secondary)]">Mục tiêu</span>
              </div>
              <p className="text-sm text-[var(--text)] leading-relaxed pl-6">{fitnessGoal}</p>
            </div>
          )}

          {!fitnessGoal && (
            <div className="text-xs text-[var(--text-tertiary)] bg-[var(--bg-secondary)] border border-[var(--border)] rounded-lg p-3">
              Người dùng chưa cung cấp thêm thông tin cho kế hoạch này.
            </div>
          )}
        </div>

        {/* Action Button */}
        <div className="flex-shrink-0 pt-2.5 border-t border-[var(--border)]">
          <button
            type="button"
            onClick={() => onReview?.(plan)}
            className="w-full h-10 rounded-lg bg-[var(--primary)] text-white font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Icon name="mdi:eye-outline" size={18} />
            <span>Xem chi tiết và duyệt</span>
          </button>
        </div>
      </div>
    </Card>
  );
};

export default PlanReviewCard;

