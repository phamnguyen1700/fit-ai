import React from 'react';
import { ExerciseCard } from '@/shared/ui';

export default function ExerciseCardExample() {
  const sampleExercise = {
    title: "Bài tập Squat - cơ mông",
    videoThumbnail: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b",
    muscleGroup: "Chân, Mông",
    exerciseType: "Strength",
    difficulty: "Trung bình",
    duration: "15 phút",
    equipment: "Tạ đơn (Dumbbell)",
    calories: "~100 kcal"
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-8">Exercise Card Example</h1>
      <div className="max-w-sm">
        <ExerciseCard
          {...sampleExercise}
          onPlay={() => console.log('Play video')}
          onEdit={() => console.log('Edit exercise')}
          onView={() => console.log('View details')}
          onDelete={() => console.log('Delete exercise')}
        />
      </div>
    </div>
  );
}
