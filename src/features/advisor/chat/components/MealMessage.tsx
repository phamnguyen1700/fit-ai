import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { MealPlanData } from '../types';

interface MealMessageProps {
  mealData: MealPlanData;
}

export const MealMessage: React.FC<MealMessageProps> = ({ mealData }) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
          <Icon name="mdi:food" size={24} className="text-orange-600" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">
            {mealData.MealType} - Ngày {mealData.DayNumber}
          </h4>
          <p className="text-sm font-medium text-orange-600">{mealData.Calories} cal</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-2 border-t border-slate-100 pt-3">
        <div className="flex flex-col items-center rounded-md bg-slate-50 p-2">
          <span className="text-xs text-slate-500">Carbs</span>
          <span className="text-sm font-semibold text-slate-900">{mealData.Nutrition.Carbs}g</span>
        </div>
        <div className="flex flex-col items-center rounded-md bg-slate-50 p-2">
          <span className="text-xs text-slate-500">Protein</span>
          <span className="text-sm font-semibold text-slate-900">{mealData.Nutrition.Protein}g</span>
        </div>
        <div className="flex flex-col items-center rounded-md bg-slate-50 p-2">
          <span className="text-xs text-slate-500">Fat</span>
          <span className="text-sm font-semibold text-slate-900">{mealData.Nutrition.Fat}g</span>
        </div>
        <div className="flex flex-col items-center rounded-md bg-slate-50 p-2">
          <span className="text-xs text-slate-500">Fiber</span>
          <span className="text-sm font-semibold text-slate-900">{mealData.Nutrition.Fiber}g</span>
        </div>
      </div>

      {mealData.Foods && mealData.Foods.length > 0 && (
        <div className="border-t border-slate-100 pt-3">
          <h5 className="mb-2 text-sm font-semibold text-slate-900">Thực phẩm:</h5>
          <div className="flex flex-col gap-2">
            {mealData.Foods.map((food, index) => (
              <div key={index} className="flex items-center justify-between rounded-md bg-slate-50 p-2">
                <span className="text-sm text-slate-700">{food.Name}</span>
                <span className="text-sm font-medium text-slate-900">{food.Quantity}</span>
                {food.Note && (
                  <span className="text-xs text-slate-500">({food.Note})</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
