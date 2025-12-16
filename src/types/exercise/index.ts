// Keypoint enum for pose detection (0-16)
export enum KeypointId {
  Nose = 0,
  LeftEye = 1,
  RightEye = 2,
  LeftEar = 3,
  RightEar = 4,
  LeftShoulder = 5,
  RightShoulder = 6,
  LeftElbow = 7,
  RightElbow = 8,
  LeftWrist = 9,
  RightWrist = 10,
  LeftHip = 11,
  RightHip = 12,
  LeftKnee = 13,
  RightKnee = 14,
  LeftAnkle = 15,
  RightAnkle = 16,
}

// Keypoint labels for UI display (Tiếng Việt)
export const KEYPOINT_LABELS: Record<KeypointId, string> = {
  [KeypointId.Nose]: "Mũi",
  [KeypointId.LeftEye]: "Mắt trái",
  [KeypointId.RightEye]: "Mắt phải",
  [KeypointId.LeftEar]: "Tai trái",
  [KeypointId.RightEar]: "Tai phải",
  [KeypointId.LeftShoulder]: "Vai trái",
  [KeypointId.RightShoulder]: "Vai phải",
  [KeypointId.LeftElbow]: "Khuỷu tay trái",
  [KeypointId.RightElbow]: "Khuỷu tay phải",
  [KeypointId.LeftWrist]: "Cổ tay trái",
  [KeypointId.RightWrist]: "Cổ tay phải",
  [KeypointId.LeftHip]: "Hông trái",
  [KeypointId.RightHip]: "Hông phải",
  [KeypointId.LeftKnee]: "Đầu gối trái",
  [KeypointId.RightKnee]: "Đầu gối phải",
  [KeypointId.LeftAnkle]: "Mắt cá chân trái",
  [KeypointId.RightAnkle]: "Mắt cá chân phải",
};

export interface Exercise {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  videoUrl: string;
  thumbnailUrl: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  lastCreate: string;
  lastUpdate: string;
  cameraAngle: string;
  formValidationRules: FormValidationRule[];
}

export interface FormValidationRule {
  ruleName: string;
  keypointIds: number[];
  minAngle: number;
  maxAngle: number;
  errorMessage: string;
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
  cameraAngle?: string; // Optional
  formValidationRules?: FormValidationRule[]; // Optional
}

export interface CreateExerciseData {
  name: string; // Required
  description: string; // Required
  categoryId: string; // Required
  level: "Beginner" | "Intermediate" | "Advanced"; // Required
  video: File; // Required - file video
  cameraAngle?: string; // Optional
  formValidationRules?: FormValidationRule[]; // Optional
}

export interface DeleteExerciseData {
  id: string; // Required - ID của bài tập cần xóa
}