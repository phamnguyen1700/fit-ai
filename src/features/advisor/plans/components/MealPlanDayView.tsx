'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { DayMeal, Meal } from '@/types/plan';
import { getIngredientById } from '@/features/plan-demo/data/ingredientData';

interface MealPlanDayViewProps {
  dayMeal: DayMeal;
  dayNumber: number;
}

const getMealTypeLabel = (type: string, customName?: string) => {
  if (type === 'custom' && customName) {
    return customName;
  }
  switch (type) {
    case 'breakfast':
      return 'Bữa sáng';
    case 'lunch':
      return 'Bữa trưa';
    case 'dinner':
      return 'Bữa tối';
    default:
      return type;
  }
};

const getMealTypeTime = (type: string) => {
  switch (type) {
    case 'breakfast':
      return '7:00 AM';
    case 'lunch':
      return '12:00 PM';
    case 'dinner':
      return '7:00 PM';
    default:
      return '';
  }
};

const MealCard: React.FC<{ meal: Meal; index: number }> = ({ meal, index }) => {
  return (
    <div className="rounded-lg border border-[var(--border)] bg-white p-4 mb-4">
      {/* Meal Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg font-semibold text-[var(--text)]">
            {getMealTypeLabel(meal.type, meal.customName)}
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
            AI Gen
          </span>
        </div>
        <div className="text-sm text-[var(--text-secondary)]">
          {getMealTypeTime(meal.type)}
        </div>
      </div>

      {/* Meal Description */}
      <p className="text-sm text-[var(--text-secondary)] mb-3">
        Món ăn {getMealTypeLabel(meal.type, meal.customName).toLowerCase()} giàu dinh dưỡng, cung cấp năng lượng bền vững
      </p>

      {/* Total Calories */}
      <div className="mb-4">
        <span className="text-base font-semibold text-[var(--text)]">
          Tổng calo {meal.totalCalories} kcal
        </span>
      </div>

      {/* Ingredients */}
      <div className="border-t border-[var(--border)] pt-4">
        <h4 className="text-sm font-semibold text-[var(--text)] mb-3">
          Thành phần món ăn:
        </h4>
        <div className="flex flex-col gap-3">
          {meal.ingredients.map((ingredient) => {
            const ingredientInfo = getIngredientById(ingredient.ingredientId);
            return (
              <div
                key={ingredient.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex-1">
                  <span className="text-[var(--text)] font-medium">
                    {ingredientInfo?.name || 'Nguyên liệu'} ({ingredient.weight}g)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[var(--text-secondary)]">
                  <span>P: {ingredient.protein}g</span>
                  <span>C: {ingredient.carbs}g</span>
                  <span>F: {ingredient.fat}g</span>
                  <span className="font-semibold text-[var(--text)]">
                    {ingredient.calories} kcal
                  </span>
                </div>
              </div>
            );
          })}
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
      {dayMeal.meals.map((meal, index) => (
        <MealCard key={index} meal={meal} index={index} />
      ))}
    </div>
  );
};

