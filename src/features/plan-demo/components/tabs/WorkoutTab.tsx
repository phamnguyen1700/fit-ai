'use client';
import React from 'react';
import WorkoutCard from '../WorkoutCard';
import type { WorkoutPlanCreation } from '@/types/plan';

const WorkoutTab = () => {
  // Sample exercise categories
  const sampleCategories = [
    { id: 'cardio-1', name: 'Cardio' },
    { id: 'chest-1', name: 'Ngực' },
    { id: 'shoulder-1', name: 'Vai' },
    { id: 'back-1', name: 'Lưng' },
    { id: 'legs-1', name: 'Chân' },
    { id: 'arms-1', name: 'Tay' },
    { id: 'abs-1', name: 'Bụng' },
  ];

  // Sample exercises
  const sampleExercises = [
    { id: 'ex-1', name: 'Chạy bộ', categoryId: 'cardio-1' },
    { id: 'ex-2', name: 'Bench Press', categoryId: 'chest-1' },
    { id: 'ex-3', name: 'Chống đẩy', categoryId: 'chest-1' },
    { id: 'ex-4', name: 'Shoulder Press', categoryId: 'shoulder-1' },
    { id: 'ex-5', name: 'Pull-up', categoryId: 'back-1' },
    { id: 'ex-6', name: 'Barbell Row', categoryId: 'back-1' },
    { id: 'ex-7', name: 'Đạp xe', categoryId: 'cardio-1' },
    { id: 'ex-8', name: 'Squat', categoryId: 'legs-1' },
    { id: 'ex-9', name: 'Leg Press', categoryId: 'legs-1' },
    { id: 'ex-10', name: 'Lunge', categoryId: 'legs-1' },
    { id: 'ex-11', name: 'Bicep Curl', categoryId: 'arms-1' },
    { id: 'ex-12', name: 'Tricep Dips', categoryId: 'arms-1' },
    { id: 'ex-13', name: 'Plank', categoryId: 'abs-1' },
    { id: 'ex-14', name: 'Crunches', categoryId: 'abs-1' },
    { id: 'ex-15', name: 'Deadlift', categoryId: 'back-1' },
  ];

  // Multiple sample workout plans
  const workoutPlans: WorkoutPlanCreation[] = [
    {
      planName: 'Kế hoạch giảm cân 4 tuần',
      gender: 'male',
      startDate: '2025-01-01',
      goal: 'Giảm cân và tăng cơ',
      totalDays: 28,
      workouts: [
        {
          day: 1,
          dayName: 'Ngực & Vai',
          exercises: [
            {
              id: '1',
              sessionName: 'Cardio',
              categoryId: 'cardio-1',
              exerciseId: 'ex-1',
              minutes: 30,
            },
            {
              id: '2',
              sessionName: 'Ngực & Vai',
              categoryId: 'chest-1',
              exerciseId: 'ex-2',
              sets: 4,
              reps: 12,
            },
            {
              id: '3',
              sessionName: 'Ngực & Vai',
              categoryId: 'chest-1',
              exerciseId: 'ex-3',
              sets: 3,
              reps: 10,
            },
          ],
        },
        {
          day: 2,
          dayName: 'Lưng & Tay sau',
          exercises: [
            {
              id: '4',
              sessionName: 'Cardio',
              categoryId: 'cardio-1',
              exerciseId: 'ex-7',
              minutes: 25,
            },
            {
              id: '5',
              sessionName: 'Lưng',
              categoryId: 'back-1',
              exerciseId: 'ex-5',
              sets: 4,
              reps: 10,
            },
            {
              id: '6',
              sessionName: 'Lưng',
              categoryId: 'back-1',
              exerciseId: 'ex-6',
              sets: 4,
              reps: 12,
            },
          ],
        },
        {
          day: 3,
          dayName: 'Chân',
          exercises: [
            {
              id: '7',
              sessionName: 'Chân',
              categoryId: 'legs-1',
              exerciseId: 'ex-8',
              sets: 5,
              reps: 10,
            },
            {
              id: '8',
              sessionName: 'Chân',
              categoryId: 'legs-1',
              exerciseId: 'ex-9',
              sets: 4,
              reps: 12,
            },
            {
              id: '9',
              sessionName: 'Bụng',
              categoryId: 'abs-1',
              exerciseId: 'ex-13',
              sets: 3,
              reps: 30,
            },
          ],
        },
        {
          day: 4,
          dayName: 'Nghỉ ngơi & giãn cơ',
          exercises: [
            {
              id: '10',
              sessionName: 'Giãn cơ',
              categoryId: 'cardio-1',
              exerciseId: 'ex-1',
              minutes: 15,
            },
          ],
        },
      ],
    },
    {
      planName: 'Kế hoạch tăng cơ cho người mới',
      gender: 'male',
      startDate: '2025-02-01',
      goal: 'Tăng cơ bắp và sức mạnh',
      totalDays: 21,
      workouts: [
        {
          day: 1,
          dayName: 'Chân',
          exercises: [
            {
              id: '11',
              sessionName: 'Chân trước',
              categoryId: 'legs-1',
              exerciseId: 'ex-8',
              sets: 5,
              reps: 8,
            },
            {
              id: '12',
              sessionName: 'Chân sau',
              categoryId: 'legs-1',
              exerciseId: 'ex-9',
              sets: 4,
              reps: 10,
            },
            {
              id: '13',
              sessionName: 'Chân toàn diện',
              categoryId: 'legs-1',
              exerciseId: 'ex-10',
              sets: 3,
              reps: 12,
            },
          ],
        },
        {
          day: 2,
          dayName: 'Ngực & Tay trước',
          exercises: [
            {
              id: '14',
              sessionName: 'Ngực',
              categoryId: 'chest-1',
              exerciseId: 'ex-2',
              sets: 4,
              reps: 8,
            },
            {
              id: '15',
              sessionName: 'Ngực',
              categoryId: 'chest-1',
              exerciseId: 'ex-3',
              sets: 3,
              reps: 12,
            },
            {
              id: '16',
              sessionName: 'Tay trước',
              categoryId: 'arms-1',
              exerciseId: 'ex-11',
              sets: 3,
              reps: 15,
            },
          ],
        },
        {
          day: 3,
          dayName: 'Lưng & Vai',
          exercises: [
            {
              id: '17',
              sessionName: 'Lưng',
              categoryId: 'back-1',
              exerciseId: 'ex-15',
              sets: 5,
              reps: 6,
            },
            {
              id: '18',
              sessionName: 'Lưng',
              categoryId: 'back-1',
              exerciseId: 'ex-5',
              sets: 4,
              reps: 8,
            },
            {
              id: '19',
              sessionName: 'Vai',
              categoryId: 'shoulder-1',
              exerciseId: 'ex-4',
              sets: 4,
              reps: 10,
            },
          ],
        },
      ],
    },
    {
      planName: 'Thể dục buổi sáng',
      gender: 'female',
      startDate: '2025-01-15',
      goal: 'Tăng sức khỏe và dẻo dai',
      totalDays: 14,
      workouts: [
        {
          day: 1,
          dayName: 'Cardio & Bụng',
          exercises: [
            {
              id: '21',
              sessionName: 'Cardio',
              categoryId: 'cardio-1',
              exerciseId: 'ex-1',
              minutes: 20,
            },
            {
              id: '22',
              sessionName: 'Core',
              categoryId: 'abs-1',
              exerciseId: 'ex-13',
              sets: 3,
              reps: 30,
            },
            {
              id: '23',
              sessionName: 'Core',
              categoryId: 'abs-1',
              exerciseId: 'ex-14',
              sets: 3,
              reps: 25,
            },
          ],
        },
        {
          day: 2,
          dayName: 'Toàn thân',
          exercises: [
            {
              id: '24',
              sessionName: 'Chân',
              categoryId: 'legs-1',
              exerciseId: 'ex-10',
              sets: 3,
              reps: 15,
            },
            {
              id: '25',
              sessionName: 'Ngực',
              categoryId: 'chest-1',
              exerciseId: 'ex-3',
              sets: 3,
              reps: 12,
            },
            {
              id: '26',
              sessionName: 'Tay',
              categoryId: 'arms-1',
              exerciseId: 'ex-12',
              sets: 3,
              reps: 10,
            },
          ],
        },
      ],
    },
    {
      planName: 'Kế hoạch Fullbody 3 tháng',
      gender: 'male',
      startDate: '2025-03-01',
      goal: 'Tăng cơ toàn thân',
      totalDays: 90,
      workouts: [
        {
          day: 1,
          dayName: 'Upper Body',
          exercises: [
            {
              id: '31',
              sessionName: 'Ngực',
              categoryId: 'chest-1',
              exerciseId: 'ex-2',
              sets: 4,
              reps: 10,
            },
            {
              id: '32',
              sessionName: 'Lưng',
              categoryId: 'back-1',
              exerciseId: 'ex-15',
              sets: 4,
              reps: 8,
            },
            {
              id: '33',
              sessionName: 'Vai',
              categoryId: 'shoulder-1',
              exerciseId: 'ex-4',
              sets: 3,
              reps: 12,
            },
            {
              id: '34',
              sessionName: 'Tay',
              categoryId: 'arms-1',
              exerciseId: 'ex-11',
              sets: 3,
              reps: 15,
            },
          ],
        },
        {
          day: 2,
          dayName: 'Lower Body',
          exercises: [
            {
              id: '35',
              sessionName: 'Chân',
              categoryId: 'legs-1',
              exerciseId: 'ex-8',
              sets: 5,
              reps: 12,
            },
            {
              id: '36',
              sessionName: 'Chân',
              categoryId: 'legs-1',
              exerciseId: 'ex-9',
              sets: 4,
              reps: 10,
            },
            {
              id: '37',
              sessionName: 'Bụng',
              categoryId: 'abs-1',
              exerciseId: 'ex-13',
              sets: 4,
              reps: 45,
            },
          ],
        },
        {
          day: 3,
          dayName: 'Cardio & Core',
          exercises: [
            {
              id: '38',
              sessionName: 'Cardio',
              categoryId: 'cardio-1',
              exerciseId: 'ex-1',
              minutes: 30,
            },
            {
              id: '39',
              sessionName: 'Core',
              categoryId: 'abs-1',
              exerciseId: 'ex-14',
              sets: 4,
              reps: 30,
            },
          ],
        },
      ],
    },
  ];

  return (
    <div style={{ padding: '20px 0' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
          gap: '20px',
          alignItems: 'start',
        }}
      >
        {workoutPlans.map((plan, index) => (
          <WorkoutCard
            key={index}
            workoutPlan={plan}
            exerciseCategories={sampleCategories}
            exercises={sampleExercises}
          />
        ))}
      </div>
    </div>
  );
};

export default WorkoutTab;