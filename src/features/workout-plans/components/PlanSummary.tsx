"use client";
import React from 'react';
import type { DailyWorkoutPlan, DailyMealPlan } from '@/types/workoutPlan';

interface PlanSummaryProps {
  workoutPlans: DailyWorkoutPlan[];
  mealPlans: DailyMealPlan[];
}

export const PlanSummary: React.FC<PlanSummaryProps> = ({ workoutPlans, mealPlans }) => {
  if (workoutPlans.length === 0 && mealPlans.length === 0) {
    return null;
  }

  return (
    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
      <h4 className="font-semibold text-green-700 mb-2">📋 Tổng quan đã thêm:</h4>
      {workoutPlans.length > 0 && (
        <p className="text-sm text-green-600">
          • Lịch tập: {workoutPlans.length} ngày (
          {workoutPlans.reduce(
            (sum, p) => sum + (p.sessions[0]?.exercises.length || 0),
            0
          )}{' '}
          bài tập)
        </p>
      )}
      {mealPlans.length > 0 && (
        <p className="text-sm text-green-600">
          • Dinh dưỡng: {mealPlans.length} ngày (
          {mealPlans.reduce(
            (sum, p) => sum + p.sessions.reduce((s, sess) => s + sess.meals.length, 0),
            0
          )}{' '}
          món ăn)
        </p>
      )}
    </div>
  );
};
