import React from 'react';
import { Icon } from '@/shared/ui/icon';
import type { ExercisePlanData } from '../types';

interface ExerciseMessageProps {
  exerciseData: ExercisePlanData;
}

export const ExerciseMessage: React.FC<ExerciseMessageProps> = ({ exerciseData }) => {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
          <Icon name="mdi:dumbbell" size={24} className="text-primary" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-slate-900">{exerciseData.Name}</h4>
          <p className="text-xs text-slate-500">{exerciseData.Category}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 border-t border-slate-100 pt-3">
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Số hiệp</span>
          <span className="text-sm font-semibold text-slate-900">{exerciseData.Sets}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-slate-500">Số lần lặp</span>
          <span className="text-sm font-semibold text-slate-900">{exerciseData.Reps}</span>
        </div>
        {exerciseData.DurationMinutes && (
          <div className="flex flex-col">
            <span className="text-xs text-slate-500">Thời gian (phút)</span>
            <span className="text-sm font-semibold text-slate-900">{exerciseData.DurationMinutes}</span>
          </div>
        )}
      </div>

      {exerciseData.Note && (
        <div className="rounded-md bg-slate-50 p-3">
          <p className="text-sm text-slate-700">{exerciseData.Note}</p>
        </div>
      )}

      {exerciseData.VideoUrl && (
        <a
          href={exerciseData.VideoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 text-sm text-primary hover:text-primary/80"
        >
          <Icon name="mdi:play-circle" size={20} />
          <span>Xem video hướng dẫn</span>
        </a>
      )}
    </div>
  );
};
