'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { DayMeal } from '@/types/plan';
import { getIngredientById } from '@/features/plan-demo/data/ingredientData';

interface MealPlanDetailsProps {
  meals: DayMeal[];
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

const getMealTypeIcon = (type: string) => {
  switch (type) {
    case 'breakfast':
      return 'mdi:weather-sunny';
    case 'lunch':
      return 'mdi:weather-sunset';
    case 'dinner':
      return 'mdi:weather-night';
    default:
      return 'mdi:food';
  }
};

export const MealPlanDetails: React.FC<MealPlanDetailsProps> = ({ meals }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="mdi:food-apple" size={20} className="text-[var(--primary)]" />
        <h3 className="text-lg font-semibold text-[var(--text)]">Chi tiết kế hoạch dinh dưỡng</h3>
      </div>

      {meals.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          Chưa có thực đơn nào
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {meals.map((dayMeal) => (
            <div
              key={dayMeal.menuNumber}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon name="mdi:food-variant" size={18} className="text-[var(--primary)]" />
                <span className="font-semibold text-[var(--text)]">Thực đơn {dayMeal.menuNumber}</span>
              </div>

              {dayMeal.meals.length === 0 ? (
                <div className="text-sm text-[var(--text-secondary)] italic">Chưa có bữa ăn</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {dayMeal.meals.map((meal, mealIndex) => (
                    <div
                      key={mealIndex}
                      className="rounded-md border border-[var(--border)] bg-white p-3"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Icon
                          name={getMealTypeIcon(meal.type)}
                          size={18}
                          className="text-[var(--primary)]"
                        />
                        <span className="font-semibold text-[var(--text)]">
                          {getMealTypeLabel(meal.type, meal.customName)}
                        </span>
                      </div>

                      {meal.ingredients.length === 0 ? (
                        <div className="text-sm text-[var(--text-secondary)] italic">
                          Chưa có nguyên liệu
                        </div>
                      ) : (
                        <>
                          <div className="flex flex-col gap-2 mb-3">
                            {meal.ingredients.map((ingredient) => {
                              const ingredientInfo = getIngredientById(ingredient.ingredientId);
                              return (
                                <div
                                  key={ingredient.id}
                                  className="flex items-center justify-between text-sm"
                                >
                                  <span className="text-[var(--text)]">
                                    {ingredientInfo?.name || 'Nguyên liệu'}
                                  </span>
                                  <span className="text-[var(--text-secondary)] font-medium">
                                    {ingredient.weight}g
                                  </span>
                                </div>
                              );
                            })}
                          </div>

                          <div className="pt-2 border-t border-[var(--border)]">
                            <div className="grid grid-cols-4 gap-2 text-xs">
                              <div className="flex flex-col">
                                <span className="text-[var(--text-secondary)]">Calories</span>
                                <span className="font-semibold text-[var(--text)]">
                                  {meal.totalCalories}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[var(--text-secondary)]">Carbs</span>
                                <span className="font-semibold text-[var(--text)]">
                                  {meal.totalCarbs}g
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[var(--text-secondary)]">Protein</span>
                                <span className="font-semibold text-[var(--text)]">
                                  {meal.totalProtein}g
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[var(--text-secondary)]">Fat</span>
                                <span className="font-semibold text-[var(--text)]">
                                  {meal.totalFat}g
                                </span>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

