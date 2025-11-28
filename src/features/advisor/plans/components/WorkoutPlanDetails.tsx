'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { DayWorkout } from '@/types/plan';

interface WorkoutPlanDetailsProps {
  workouts: DayWorkout[];
}

export const WorkoutPlanDetails: React.FC<WorkoutPlanDetailsProps> = ({ workouts }) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon name="mdi:dumbbell" size={20} className="text-[var(--primary)]" />
        <h3 className="text-lg font-semibold text-[var(--text)]">Chi tiết kế hoạch tập luyện</h3>
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-8 text-[var(--text-secondary)]">
          Chưa có bài tập nào
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {workouts.map((workout) => (
            <div
              key={workout.day}
              className="rounded-lg border border-[var(--border)] bg-[var(--bg-secondary)] p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <Icon name="mdi:calendar-today" size={18} className="text-[var(--primary)]" />
                <span className="font-semibold text-[var(--text)]">Ngày {workout.day}</span>
              </div>

              {workout.exercises.length === 0 ? (
                <div className="text-sm text-[var(--text-secondary)] italic">Chưa có bài tập</div>
              ) : (
                <div className="flex flex-col gap-3">
                  {workout.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="rounded-md border border-[var(--border)] bg-white p-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-medium text-[var(--text-secondary)]">
                              {index + 1}.
                            </span>
                            <span className="font-semibold text-[var(--text)]">
                              {exercise.sessionName}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] mb-2">
                            <span>{exercise.categoryName || exercise.categoryId || 'Danh mục'}</span>
                            <span>•</span>
                            <span>{exercise.exerciseName || exercise.exerciseId || 'Bài tập'}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-[var(--primary)]">
                            {exercise.minutes ? (
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
                      </div>
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

