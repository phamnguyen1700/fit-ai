import { get, post, put } from "@/shared/api/http";
import { Exercise, ExerciseParams, UpdateExerciseData, CreateExerciseData } from "@/types/exercise";

export const getExercisesService = (params: ExerciseParams) => get<Exercise[]>(`fitness/api/exercise`, { params });

export const createExerciseService = (data: CreateExerciseData) => {
  const formData = new FormData();
  
  // Required fields
  formData.append('Name', data.name);
  formData.append('Description', data.description);
  formData.append('CategoryId', data.categoryId);
  formData.append('Level', data.level);
  formData.append('Video', data.video);
  
  return post(`fitness/api/exercise`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateExerciseService = (id: string, data: UpdateExerciseData) => {
  const formData = new FormData();
  
  // Required fields - luôn phải có giá trị
  formData.append('Name', data.name);
  formData.append('Description', data.description);
  formData.append('CategoryId', data.categoryId);
  formData.append('Level', data.level);
  
  // Video handling - ưu tiên video file mới, nếu không có thì gửi videoUrl
  if (data.video) {
    // User chọn video mới - upload file
    formData.append('Video', data.video);
  } else if (data.videoUrl) {
    // Không có video mới - giữ nguyên videoUrl cũ
    formData.append('VideoUrl', data.videoUrl);
  }
  
  return put(`fitness/api/exercise/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};  