"use client";
import React from 'react';
import { CardTable } from '@/shared/ui/core/CardTable';
import { WorkoutPlanCard } from './WorkoutPlanCard';
import type { WorkoutPlan } from '@/types/workoutPlan';

interface WorkoutPlanTableProps {
  plans: WorkoutPlan[];
  onView?: (planId: string) => void;
  onEdit?: (planId: string) => void;
  onDelete?: (planId: string) => void;
}

export const WorkoutPlanTable: React.FC<WorkoutPlanTableProps> = ({
  plans,
  onView,
  onEdit,
  onDelete,
}) => {
  return (
    <CardTable
      items={plans}
      pageSize={6}
      renderItem={(plan) => (
        <WorkoutPlanCard
          plan={plan}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      )}
    />
  );
};

export default WorkoutPlanTable;
