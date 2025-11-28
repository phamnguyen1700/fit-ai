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

// API Response structure - based on actual API response
export interface ExerciseListResponse {
  data: Exercise[];
}

// For backward compatibility
export type ExerciseState = ExerciseListResponse;

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

export interface CreateExerciseData {
  name: string; // Required
  description: string; // Required
  categoryId: string; // Required
  level: "Beginner" | "Intermediate" | "Advanced"; // Required
  video: File; // Required - file video
}

export interface DeleteExerciseData {
  id: string; // Required - ID của bài tập cần xóa
}