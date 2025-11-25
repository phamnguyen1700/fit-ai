'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { MealPlanDayDetail, MealDetail } from '@/types/planreview';

const mealTypeLabelMap: Record<string, string> = {
  Breakfast: 'Bữa sáng',
  'Morning Snack': 'Ăn nhẹ buổi sáng',
  Lunch: 'Bữa trưa',
  'Afternoon Snack': 'Ăn nhẹ buổi chiều',
  Dinner: 'Bữa tối',
};

interface MealPlanDayViewProps {
  dayMeal: MealPlanDayDetail;
  dayNumber: number;
}

const getMealTypeLabel = (type: string) => {
  return mealTypeLabelMap[type] || type;
};

const MealCard: React.FC<{ meal: MealDetail; index: number }> = ({ meal, index }) => {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4 mb-4">
      {/* Meal Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-[var(--text)]">
            {getMealTypeLabel(meal.type)}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
            AI Gen
          </span>
        </div>
      </div>

      {/* Meal Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        Suất ăn {getMealTypeLabel(meal.type).toLowerCase()} bao gồm {meal.foods.length} món
      </p>

      {/* Total Calories */}
      <div className="mb-4">
        <span className="text-base font-semibold text-[var(--text)]">
          Tổng calo {meal.calories} kcal
        </span>
      </div>

      {/* Ingredients */}
      <div className="border-t border-[var(--border)] pt-4">
        <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
          Thành phần món ăn:
        </h4>
        <div className="flex flex-col gap-3">
          {meal.foods.map((food, idx) => (
            <div
              key={`${food.name}-${idx}`}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-[var(--text)] font-medium">{food.name}</span>
              <span className="text-[var(--text-secondary)]">{food.quantity}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MealPlanDayView: React.FC<MealPlanDayViewProps> = ({ dayMeal, dayNumber }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
        Thực đơn AI đã gen - Ngày {dayNumber}
      </h3>
      <div className="text-sm text-[var(--text-secondary)]">
        Tổng calo cả ngày: <span className="font-semibold text-[var(--text)]">{dayMeal.totalCalories} kcal</span>
      </div>
      {dayMeal.meals.map((meal, index) => (
        <MealCard key={index} meal={meal} index={index} />
      ))}
    </div>
  );
};

