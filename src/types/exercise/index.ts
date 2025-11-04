export interface Exercise {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  videoUrl: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lastCreate: string;
  lastUpdate: string;
}

export type ExerciseState = Exercise[];

export interface ExerciseParams {
  categoryId?: string;
  level?: "Beginner" | "Intermediate" | "Advanced";
  search?: string;
}