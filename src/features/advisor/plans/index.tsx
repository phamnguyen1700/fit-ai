'use client';

import React, { useMemo, useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Flex } from '@/shared/ui/core/Flex';
import { Icon } from '@/shared/ui/icon';
import { CardTable } from '@/shared/ui/core/CardTable';
import {
  PlanReviewCard,
  PlanReviewCardDataProvider,
  usePlanReviewCardData,
} from './components/PlanReviewCard';
import { PlanReviewModal } from './components/PlanReviewModal';
import { approvePlanService } from '@/tanstack/services/planreview';
import toast from 'react-hot-toast';

const SummaryTile: React.FC<{
  icon: string;
  label: string;
  value: React.ReactNode;
  helper?: React.ReactNode;
  accent?: string;
  iconColor?: string;
}> = ({ icon, label, value, helper, accent, iconColor }) => (
  <div className="flex flex-1 min-w-[160px] items-center gap-3 rounded-lg border border-[var(--border)] bg-white p-4 shadow-sm">
    <div
      className="flex h-10 w-10 items-center justify-center rounded-md"
      style={{ background: accent ?? 'rgba(56, 189, 248, 0.12)' }}
    >
      <Icon name={icon} size={20} color={iconColor ?? 'var(--primary)'} />
    </div>
    <div className="flex flex-col">
      <span className="text-sm text-[var(--text-secondary)]">{label}</span>
      <span className="text-lg font-semibold text-[var(--text)]">{value}</span>
      {helper && <span className="text-xs text-[var(--text-secondary)]">{helper}</span>}
    </div>
  </div>
);

type PlanTypeFilter = 'all' | 'workout' | 'meal' | 'combined';

const PLAN_TYPE_TABS: { value: PlanTypeFilter; label: string; icon: string }[] = [
  { value: 'all', label: 'Tất cả', icon: 'mdi:playlist-check' },
  { value: 'workout', label: 'Tập luyện', icon: 'mdi:dumbbell' },
  { value: 'meal', label: 'Ăn uống', icon: 'mdi:food-apple' },
  { value: 'combined', label: 'Kết hợp', icon: 'mdi:clipboard-text-outline' },
];

export const AdvisorPlanReviews: React.FC = () => (
  <PlanReviewCardDataProvider>
    <AdvisorPlanReviewsContent />
  </PlanReviewCardDataProvider>
);

const AdvisorPlanReviewsContent: React.FC = () => {
  const { plans, isLoading, isError, error, refetch } = usePlanReviewCardData();
  const [activeType, setActiveType] = useState<PlanTypeFilter>('all');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isReviewModalOpen, setReviewModalOpen] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  const summary = useMemo(() => {
    const total = plans.length;
    const workout = plans.filter((p: any) => p.planType === 'workout').length;
    const meal = plans.filter((p: any) => p.planType === 'meal').length;
    const combined = plans.filter((p: any) => p.planType === 'combined').length;

    return { total, workout, meal, combined };
  }, [plans]);

  const filteredPlans = useMemo(() => {
    if (activeType === 'all') {
      return plans;
    }
    return plans.filter((plan: any) => plan.planType === activeType);
  }, [plans, activeType]);

  const handleReview = (plan: any) => {
    setSelectedPlan(plan);
    setReviewModalOpen(true);
  };

  const handleSubmitReview = async (payload: any) => {
    if (!payload?.planId) return;

    try {
      setIsApproving(true);
      const response = await approvePlanService(payload.planId);
      toast.success('Duyệt plan thành công');
      setReviewModalOpen(false);
      setSelectedPlan(null);
      refetch();
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        err?.message ||
        'Duyệt plan thất bại. Vui lòng thử lại.';
      toast.error(message);
    } finally {
      setIsApproving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <Flex wrap="wrap" gap={16} className="md:flex-nowrap">
          <SummaryTile
            icon="mdi:inbox-arrow-down"
            label="Tổng cần duyệt"
            value={summary.total}
            helper={`${summary.workout} tập luyện, ${summary.meal} ăn uống`}
          />
          <SummaryTile
            icon="mdi:dumbbell"
            label="Plan tập luyện"
            value={summary.workout}
            accent="rgba(56, 189, 248, 0.12)"
          />
          <SummaryTile
            icon="mdi:food-apple"
            label="Plan ăn uống"
            value={summary.meal}
            accent="rgba(82, 196, 26, 0.12)"
            iconColor="#52c41a"
          />
          <SummaryTile
            icon="mdi:clipboard-text-outline"
            label="Plan kết hợp"
            value={summary.combined}
            accent="rgba(250, 140, 22, 0.12)"
            iconColor="#fa8c16"
          />
        </Flex>
      </Card>

      <Card title={<span className="text-base font-semibold text-[var(--text)]">Danh sách plan cần duyệt</span>}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            {PLAN_TYPE_TABS.map((tab) => {
              const isActive = activeType === tab.value;
              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => setActiveType(tab.value)}
                  className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                      : 'bg-[var(--bg)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text)] hover:border-[var(--primary)]/40'
                  }`}
                >
                  <Icon
                    name={tab.icon}
                    size={16}
                    className={isActive ? 'text-white' : 'text-[var(--primary)]'}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="py-10 text-center text-[var(--text-secondary)] text-sm">
              Đang tải danh sách kế hoạch cần duyệt...
            </div>
          ) : isError ? (
            <div className="py-10 text-center text-red-500 text-sm">
              Không thể tải danh sách plan cần duyệt.{' '}
              <button
                type="button"
                onClick={() => refetch()}
                className="text-[var(--primary)] underline ml-1"
              >
                Thử lại
              </button>
              <div className="text-xs text-[var(--text-tertiary)] mt-2">{(error as Error)?.message}</div>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="py-10 text-center text-[var(--text-secondary)] text-sm">
              Hiện chưa có kế hoạch nào cần duyệt.
            </div>
          ) : (
            <CardTable
              items={filteredPlans}
              pageSize={6}
              renderItem={(item: any) => (
                <PlanReviewCard key={item.id} plan={item} onReview={handleReview} />
              )}
            />
          )}
        </div>
      </Card>

      <PlanReviewModal
        plan={selectedPlan}
        isOpen={isReviewModalOpen}
        isSubmitting={isApproving}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedPlan(null);
        }}
        onSubmit={handleSubmitReview}
      />
    </div>
  );
};

export default AdvisorPlanReviews;

