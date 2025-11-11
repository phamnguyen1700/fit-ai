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
  exerciseId?: string | null;
  exerciseCategoryId?: string | null;
  sessionName?: string | null;
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

export interface WorkoutDemoDetail extends WorkoutDemo {
  gender: string | null;
  goal: string | null;
  totalDays: number | null;
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

export type WorkoutDemoDetailResponse = WorkoutDemoDetail;

export interface CreateWorkoutDemoPayload {
  planName: string;
  gender: string;
  goal: string;
  totalDays: number;
}

export type CreateWorkoutDemoResponse = WorkoutDemoDetailResponse;

export interface UpdateWorkoutDemoExercisePayload {
  exerciseId: string;
  exerciseCategoryId: string;
  sets?: number;
  reps?: number;
  minutes?: number;
}

export interface UpdateWorkoutDemoDayPayload {
  day: number;
  dayName?: string;
  exercises: UpdateWorkoutDemoExercisePayload[];
}

export type UpdateWorkoutDemoDetailPayload = UpdateWorkoutDemoDayPayload[];

export type UpdateWorkoutDemoDetailResponse = WorkoutDemoDetailResponse;
