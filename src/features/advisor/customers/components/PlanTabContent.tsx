'use client';

import React, { useState } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Icon } from '@/shared/ui/icon';
import { Tabs } from '@/shared/ui/core/Tabs';
import { useActivePlan } from '@/tanstack/hooks/advisorplan';
import { WorkoutPlanView } from './WorkoutPlanView';
import { MealPlanView } from './MealPlanView';
import { InfoItem } from './InfoItem';

interface PlanTabContentProps {
  userId: string;
}

export const PlanTabContent: React.FC<PlanTabContentProps> = ({ userId }) => {
  const [activeSubTab, setActiveSubTab] = useState<'workout' | 'meal'>('workout');
  const { data: activePlanData, isLoading: isLoadingPlan } = useActivePlan(userId);

  const activePlan = activePlanData?.data;
  const checkpointNumber = activePlan?.currentCheckpointNumber;

  if (isLoadingPlan) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-[var(--text-secondary)]">Đang tải thông tin kế hoạch...</div>
      </div>
    );
  }

  if (!activePlan) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-secondary)]">
        Khách hàng chưa có kế hoạch đang hoạt động
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Icon name="mdi:clipboard-text-outline" size={20} className="text-[var(--primary)]" />
              <span className="text-lg font-semibold text-[var(--text)]">Thông tin kế hoạch</span>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <InfoItem
              label="Plan ID"
              value={activePlan.planId ? activePlan.planId.slice(-8) : '--'}
            />
            <InfoItem
              label="Tên kế hoạch"
              value={activePlan.planName || 'Chưa có tên'}
            />
            <InfoItem
              label="Checkpoint hiện tại"
              value={activePlan.currentCheckpointNumber}
            />
            {activePlan.checkpointIntervalDays && (
              <InfoItem
                label="Khoảng cách checkpoint"
                value={`${activePlan.checkpointIntervalDays} ngày`}
              />
            )}
          </div>
        </div>
      </Card>

      <Tabs
        activeKey={activeSubTab}
        onChange={(key) => setActiveSubTab(key as 'workout' | 'meal')}
        items={[
          {
            key: 'workout',
            label: (
              <span className="flex items-center gap-2">
                <Icon name="mdi:dumbbell" size={16} />
                Kế hoạch tập luyện
              </span>
            ),
            children: <WorkoutPlanView userId={userId} checkpointNumber={checkpointNumber} />,
          },
          {
            key: 'meal',
            label: (
              <span className="flex items-center gap-2">
                <Icon name="mdi:food" size={16} />
                Kế hoạch dinh dưỡng
              </span>
            ),
            children: <MealPlanView userId={userId} checkpointNumber={checkpointNumber} />,
          },
        ]}
      />
    </div>
  );
};

