'use client';

import React from 'react';
import { Card } from '@/shared/ui';

interface MealScheduleProps {
  clientId: string;
}

export default function MealSchedule({ clientId }: MealScheduleProps) {
  const days = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật'];
  const [selectedDay, setSelectedDay] = React.useState(0);

  const mealPlan = {
    breakfast: {
      time: '7:00 AM',
      foods: [
        { name: 'Yến mạch với sữa tươi', calories: 250, protein: 12, carbs: 35, fat: 6 },
        { name: 'Chuối', calories: 105, protein: 1, carbs: 27, fat: 0.4 },
        { name: 'Hạnh nhân', calories: 160, protein: 6, carbs: 6, fat: 14 },
      ],
    },
    lunch: {
      time: '12:00 PM',
      foods: [
        { name: 'Cơm gạo lứt', calories: 215, protein: 5, carbs: 45, fat: 2 },
        { name: 'Ức gà nướng', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
        { name: 'Rau xanh luộc', calories: 45, protein: 3, carbs: 9, fat: 0.5 },
        { name: 'Dầu olive', calories: 120, protein: 0, carbs: 0, fat: 14 },
      ],
    },
    snack: {
      time: '3:00 PM',
      foods: [
        { name: 'Sữa chua Hy Lạp', calories: 130, protein: 17, carbs: 9, fat: 3 },
        { name: 'Táo', calories: 95, protein: 0.5, carbs: 25, fat: 0.3 },
      ],
    },
    dinner: {
      time: '7:00 PM',
      foods: [
        { name: 'Cơm gạo lứt', calories: 215, protein: 5, carbs: 45, fat: 2 },
        { name: 'Cá hồi nướng', calories: 206, protein: 22, carbs: 0, fat: 13 },
        { name: 'Súp lơ xanh luộc', calories: 55, protein: 4, carbs: 11, fat: 0.6 },
        { name: 'Salad rau trộn', calories: 65, protein: 2, carbs: 13, fat: 1 },
      ],
    },
  };

  const calculateTotals = () => {
    let totals = { calories: 0, protein: 0, carbs: 0, fat: 0 };
    Object.values(mealPlan).forEach((meal) => {
      meal.foods.forEach((food) => {
        totals.calories += food.calories;
        totals.protein += food.protein;
        totals.carbs += food.carbs;
        totals.fat += food.fat;
      });
    });
    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-4">
      {/* Day Selector */}
      <Card className="p-4">
        <div className="flex gap-2 overflow-x-auto">
          {days.map((day, index) => (
            <button
              key={index}
              onClick={() => setSelectedDay(index)}
              className={`px-6 py-3 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedDay === index
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      </Card>

      {/* Daily Totals */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Tổng dinh dưỡng trong ngày</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Calories</p>
            <p className="text-2xl font-bold text-blue-600">{totals.calories}</p>
            <p className="text-xs text-gray-500">kcal</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Protein</p>
            <p className="text-2xl font-bold text-green-600">{totals.protein.toFixed(1)}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Carbs</p>
            <p className="text-2xl font-bold text-yellow-600">{totals.carbs.toFixed(1)}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Fat</p>
            <p className="text-2xl font-bold text-orange-600">{totals.fat.toFixed(1)}</p>
            <p className="text-xs text-gray-500">g</p>
          </div>
        </div>
      </Card>

      {/* Meals */}
      {Object.entries(mealPlan).map(([mealType, meal]) => (
        <Card key={mealType} className="p-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="text-lg font-semibold capitalize">
                {mealType === 'breakfast' && '🌅 Bữa sáng'}
                {mealType === 'lunch' && '🍱 Bữa trưa'}
                {mealType === 'snack' && '🍎 Bữa phụ'}
                {mealType === 'dinner' && '🌙 Bữa tối'}
              </h3>
              <p className="text-sm text-gray-500">{meal.time}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Tổng calories</p>
              <p className="text-lg font-bold text-primary">
                {meal.foods.reduce((sum, food) => sum + food.calories, 0)} kcal
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {meal.foods.map((food, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{food.name}</h4>
                  <span className="text-sm font-semibold text-blue-600">
                    {food.calories} kcal
                  </span>
                </div>
                <div className="flex gap-4 text-xs text-gray-600">
                  <span>Protein: {food.protein}g</span>
                  <span>Carbs: {food.carbs}g</span>
                  <span>Fat: {food.fat}g</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </div>
  );
}
