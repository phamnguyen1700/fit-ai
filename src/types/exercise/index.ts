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

export interface UpdateExerciseData {
  name: string; // Required - không được bỏ trống
  description: string; // Required - không được bỏ trống
  categoryId: string; // Required - không được bỏ trống
  level: "Beginner" | "Intermediate" | "Advanced"; // Required - không được bỏ trống
  videoUrl?: string; // Optional - URL video hiện tại, để hiển thị
  video?: File; // Optional - chỉ gửi khi muốn thay đổi video
}