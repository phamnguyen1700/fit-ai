import type { ExerciseCategory, Exercise } from '@/types/plan';

export const exerciseCategories: ExerciseCategory[] = [
  {
    id: 'cardio',
    name: 'Cardio',
    type: 'cardio',
  },
  {
    id: 'chest',
    name: 'Ngực (Chest)',
    type: 'strength',
  },
  {
    id: 'back',
    name: 'Lưng (Back)',
    type: 'strength',
  },
  {
    id: 'shoulders',
    name: 'Vai (Shoulders)',
    type: 'strength',
  },
  {
    id: 'arms',
    name: 'Tay (Arms)',
    type: 'strength',
  },
  {
    id: 'legs',
    name: 'Chân (Legs)',
    type: 'strength',
  },
  {
    id: 'core',
    name: 'Bụng/Core',
    type: 'strength',
  },
];

export const exercises: Exercise[] = [
  // Cardio exercises
  {
    id: 'running',
    name: 'Chạy bộ (Running)',
    categoryId: 'cardio',
    type: 'cardio',
  },
  {
    id: 'cycling',
    name: 'Đạp xe (Cycling)',
    categoryId: 'cardio',
    type: 'cardio',
  },
  {
    id: 'jump-rope',
    name: 'Nhảy dây (Jump Rope)',
    categoryId: 'cardio',
    type: 'cardio',
  },
  {
    id: 'burpees',
    name: 'Burpees',
    categoryId: 'cardio',
    type: 'cardio',
  },
  
  // Chest exercises
  {
    id: 'bench-press',
    name: 'Bench Press',
    categoryId: 'chest',
    type: 'strength',
  },
  {
    id: 'push-ups',
    name: 'Push-ups (Chống đẩy)',
    categoryId: 'chest',
    type: 'strength',
  },
  {
    id: 'dumbbell-fly',
    name: 'Dumbbell Fly',
    categoryId: 'chest',
    type: 'strength',
  },
  {
    id: 'incline-press',
    name: 'Incline Press',
    categoryId: 'chest',
    type: 'strength',
  },
  
  // Back exercises
  {
    id: 'pull-ups',
    name: 'Pull-ups (Kéo xà)',
    categoryId: 'back',
    type: 'strength',
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    categoryId: 'back',
    type: 'strength',
  },
  {
    id: 'bent-over-row',
    name: 'Bent Over Row',
    categoryId: 'back',
    type: 'strength',
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    categoryId: 'back',
    type: 'strength',
  },
  
  // Shoulder exercises
  {
    id: 'shoulder-press',
    name: 'Shoulder Press',
    categoryId: 'shoulders',
    type: 'strength',
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    categoryId: 'shoulders',
    type: 'strength',
  },
  {
    id: 'front-raise',
    name: 'Front Raise',
    categoryId: 'shoulders',
    type: 'strength',
  },
  {
    id: 'rear-delt-fly',
    name: 'Rear Delt Fly',
    categoryId: 'shoulders',
    type: 'strength',
  },
  
  // Arms exercises
  {
    id: 'bicep-curl',
    name: 'Bicep Curl',
    categoryId: 'arms',
    type: 'strength',
  },
  {
    id: 'tricep-dips',
    name: 'Tricep Dips',
    categoryId: 'arms',
    type: 'strength',
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    categoryId: 'arms',
    type: 'strength',
  },
  {
    id: 'tricep-extension',
    name: 'Tricep Extension',
    categoryId: 'arms',
    type: 'strength',
  },
  
  // Legs exercises
  {
    id: 'squat',
    name: 'Squat (Gánh tạ)',
    categoryId: 'legs',
    type: 'strength',
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    categoryId: 'legs',
    type: 'strength',
  },
  {
    id: 'lunges',
    name: 'Lunges (Chùng chân)',
    categoryId: 'legs',
    type: 'strength',
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    categoryId: 'legs',
    type: 'strength',
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    categoryId: 'legs',
    type: 'strength',
  },
  
  // Core exercises
  {
    id: 'plank',
    name: 'Plank',
    categoryId: 'core',
    type: 'strength',
  },
  {
    id: 'crunches',
    name: 'Crunches (Gập bụng)',
    categoryId: 'core',
    type: 'strength',
  },
  {
    id: 'russian-twist',
    name: 'Russian Twist',
    categoryId: 'core',
    type: 'strength',
  },
  {
    id: 'leg-raises',
    name: 'Leg Raises',
    categoryId: 'core',
    type: 'strength',
  },
];

// Helper function to get exercises by category
export const getExercisesByCategory = (categoryId: string): Exercise[] => {
  return exercises.filter(exercise => exercise.categoryId === categoryId);
};

// Helper function to get category by id
export const getCategoryById = (categoryId: string): ExerciseCategory | undefined => {
  return exerciseCategories.find(category => category.id === categoryId);
};

// Helper function to get exercise by id
export const getExerciseById = (exerciseId: string): Exercise | undefined => {
  return exercises.find(exercise => exercise.id === exerciseId);
};
