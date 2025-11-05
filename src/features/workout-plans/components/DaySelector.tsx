"use client";
import React from 'react';

interface DaySelectorProps {
  totalDays: number;
  selectedDay: number;
  addedDays: string[];
  onSelectDay: (day: number) => void;
}

export const DaySelector: React.FC<DaySelectorProps> = ({
  totalDays,
  selectedDay,
  addedDays,
  onSelectDay,
}) => {
  return (
    <div className="mb-4">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
          const isDayAdded = addedDays.includes(`Ngày ${day}`);
          return (
            <button
              key={day}
              type="button"
              onClick={() => onSelectDay(day)}
              className={`
                px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all
                ${selectedDay === day 
                  ? 'bg-orange-500 text-white shadow-md' 
                  : isDayAdded
                  ? 'bg-green-100 text-green-700 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }
              `}
            >
              Ngày {day}
              {isDayAdded && ' ✓'}
            </button>
          );
        })}
      </div>
    </div>
  );
};
