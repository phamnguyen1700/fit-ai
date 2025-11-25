'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { DayWorkout } from '@/types/plan';
import { getCategoryById, getExerciseById } from '@/features/plan-demo/data/exerciseData';

interface WorkoutPlanDayViewProps {
  workout: DayWorkout;
  dayNumber: number;
}

export const WorkoutPlanDayView: React.FC<WorkoutPlanDayViewProps> = ({ workout, dayNumber }) => {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-lg font-semibold text-[var(--text)] mb-2">
        Kế hoạch tập luyện AI đã gen - Ngày {dayNumber}
      </h3>
      {workout.exercises.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          Chưa có bài tập nào cho ngày này
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {workout.exercises.map((exercise, index) => {
            const category = getCategoryById(exercise.categoryId);
            const exerciseInfo = getExerciseById(exercise.exerciseId);

            return (
              <div
                key={exercise.id}
                className="rounded-lg border border-[var(--border)] bg-white p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-[var(--text)]">
                      {exercise.sessionName}
                    </span>
                    <span className="px-2 py-0.5 rounded text-xs font-medium bg-[var(--primary)]/10 text-[var(--primary)]">
                      AI Gen
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-3">
                  <Icon name="mdi:dumbbell" size={16} />
                  <span>{category?.name}</span>
                  <span>•</span>
                  <span>{exerciseInfo?.name}</span>
                </div>

                <div className="flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
                  {category?.type === 'cardio' ? (
                    <>
                      <Icon name="mdi:timer-outline" size={16} />
                      <span>{exercise.minutes} phút</span>
                    </>
                  ) : (
                    <>
                      <Icon name="mdi:repeat" size={16} />
                      <span>
                        {exercise.sets} sets × {exercise.reps} reps
                      </span>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

