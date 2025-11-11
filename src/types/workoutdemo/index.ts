export interface WorkoutDemoExerciseCategory {
  name: string | null;
  description: string | null;
}

export interface WorkoutDemoExercise {
  name: string | null;
  description: string | null;
  videoUrl: string | null;
  level: string | null;
  category: WorkoutDemoExerciseCategory | null;
  sets: number | null;
  reps: number | null;
  minutes: number | null;
}

export interface WorkoutDemoDay {
  day: number;
  dayName: string;
  exercises: WorkoutDemoExercise[];
}

export interface WorkoutDemo {
  workoutDemoId: string;
  planName: string;
  isDeleted: boolean;
  days: WorkoutDemoDay[];
}

export interface WorkoutDemoListParams {
  pageNumber?: number;
  pageSize?: number;
  isDeleted?: boolean;
}

export interface WorkoutDemoListResponse {
  totalRecords: number;
  data: WorkoutDemo[];
}
