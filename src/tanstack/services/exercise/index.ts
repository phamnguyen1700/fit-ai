import { get, post, put, del } from "@/shared/api/http";
import { Exercise, ExerciseParams, UpdateExerciseData, CreateExerciseData } from "@/types/exercise";

export const getExercisesService = (params: ExerciseParams) => 
  get<Exercise[]>(`api/exercise`, { params });

export const createExerciseService = (data: CreateExerciseData) => {
  const formData = new FormData();
  
  // Validate required fields
  const categoryId = data.categoryId?.trim();
  if (!categoryId) {
    console.error('CategoryId is required but missing!', data);
    throw new Error('CategoryId is required');
  }
  
  // Required fields - đảm bảo luôn có giá trị
  formData.append('Name', (data.name || '').trim());
  formData.append('Description', (data.description || '').trim());
  formData.append('CategoryId', categoryId); // Đảm bảo có giá trị
  formData.append('Level', data.level || 'Beginner');
  formData.append('Video', data.video);
  
  // Optional fields
  if (data.cameraAngle && data.cameraAngle.trim()) {
    formData.append('CameraAngle', data.cameraAngle.trim());
  }
  
  // FormValidationRules - ASP.NET Core model binding cần format array items riêng lẻ
  if (data.formValidationRules && data.formValidationRules.length > 0) {
    console.log('Appending FormValidationRules to FormData:', data.formValidationRules);
    
    // Gửi từng rule riêng lẻ theo format ASP.NET Core model binding
    // Format: FormValidationRules[0].ruleName, FormValidationRules[0].keypointIds, etc.
    data.formValidationRules.forEach((rule, index) => {
      formData.append(`FormValidationRules[${index}].ruleName`, rule.ruleName);
      // keypointIds là array, cần gửi từng item hoặc JSON string
      rule.keypointIds.forEach((keypointId, keypointIndex) => {
        formData.append(`FormValidationRules[${index}].keypointIds[${keypointIndex}]`, keypointId.toString());
      });
      formData.append(`FormValidationRules[${index}].minAngle`, rule.minAngle.toString());
      formData.append(`FormValidationRules[${index}].maxAngle`, rule.maxAngle.toString());
      formData.append(`FormValidationRules[${index}].errorMessage`, rule.errorMessage);
    });
    
    console.log('FormValidationRules appended as array items for ASP.NET Core model binding');
  }
  
  // Debug: Log tất cả FormData entries để verify
  console.log('=== FormData entries before sending ===');
  console.log('CategoryId value:', categoryId);
  const formDataEntries: Array<[string, string | File]> = [];
  for (const [key, value] of formData.entries()) {
    const val = value as File | Blob | string;
    formDataEntries.push([key, val instanceof File ? val : String(val)]);
    if (val instanceof File) {
      console.log(`  ${key}:`, `File(${val.name}, ${val.size} bytes)`);
    } else {
      console.log(`  ${key}:`, val);
    }
  }
  console.log('=== End FormData entries ===');
  
  // Đảm bảo CategoryId có trong FormData
  const hasCategoryId = formDataEntries.some(([key]) => key === 'CategoryId');
  if (!hasCategoryId) {
    console.error('CategoryId NOT FOUND in FormData entries!');
    throw new Error('CategoryId is missing from FormData');
  }
  
  // Không set Content-Type header - để axios tự động set với boundary cho FormData
  // Đảm bảo FormData được gửi đúng cách
  return post(`api/exercise`, formData, {
    // Không set headers - axios sẽ tự động set multipart/form-data với boundary
  });
};

export const updateExerciseService = (id: string, data: UpdateExerciseData) => {
  const formData = new FormData();
  
  // Required fields - luôn phải có giá trị
  formData.append('Name', data.name);
  formData.append('Description', data.description);
  formData.append('CategoryId', data.categoryId);
  formData.append('Level', data.level);
  
  // Optional fields
  if (data.cameraAngle) {
    formData.append('CameraAngle', data.cameraAngle);
  }

  if (data.formValidationRules && data.formValidationRules.length > 0) {
    // Gửi từng rule riêng lẻ theo format ASP.NET Core model binding
    data.formValidationRules.forEach((rule, index) => {
      formData.append(`FormValidationRules[${index}].ruleName`, rule.ruleName);
      rule.keypointIds.forEach((keypointId, keypointIndex) => {
        formData.append(`FormValidationRules[${index}].keypointIds[${keypointIndex}]`, keypointId.toString());
      });
      formData.append(`FormValidationRules[${index}].minAngle`, rule.minAngle.toString());
      formData.append(`FormValidationRules[${index}].maxAngle`, rule.maxAngle.toString());
      formData.append(`FormValidationRules[${index}].errorMessage`, rule.errorMessage);
    });
  }
  
  // Video handling - ưu tiên video file mới, nếu không có thì gửi videoUrl
  if (data.video) {
    // User chọn video mới - upload file
    formData.append('Video', data.video);
  } else if (data.videoUrl) {
    // Không có video mới - giữ nguyên videoUrl cũ
    formData.append('VideoUrl', data.videoUrl);
  }
  
  // Không set Content-Type header - để axios tự động set với boundary cho FormData
  return put(`api/exercise/${id}`, formData, {
    headers: {
      // Xóa Content-Type để axios tự động set multipart/form-data với boundary
      // 'Content-Type': 'multipart/form-data', // REMOVED - axios sẽ tự set
    },
  });
};

export const deleteExerciseService = (id: string) => 
  del(`api/exercise/${id}`);