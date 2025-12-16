"use client";
import React, { useState, useEffect, useMemo } from "react";
import { Icon } from "../icon";
import { useUpdateExerciseMutation } from "@/tanstack/hooks/exercise";
import { UpdateExerciseData, FormValidationRule, KeypointId, KEYPOINT_LABELS } from "@/types/exercise";
import { useGetExerciseCategories } from "@/tanstack/hooks/exercisecategory";
export type ExerciseItem = {
  id: string;
  title: string;
  videoThumbnail: string;
  categoryId: string;
  muscleGroup: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  cameraAngle?: string;
  formValidationRules?: FormValidationRule[];
};

interface EditExercisePopupProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    id: string;
    title: string;
    videoThumbnail: string;
    muscleGroup: string;
    categoryId: string; // Thêm categoryId
    difficulty: string;
    description: string;
  } | null;
  onSave?: (updatedExercise: ExerciseItem) => void; // Optional callback
}

export const EditExercisePopup: React.FC<EditExercisePopupProps> = ({
  isOpen,
  onClose,
  exercise,
  onSave,
}) => {
  const updateMutation = useUpdateExerciseMutation();
  
  // Fetch exercise categories
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetExerciseCategories({
    page: 1,
    pageSize: 1000, // Get all categories
  });

  // Extract categories from response
  const categories = useMemo(() => {
    if (!categoriesResponse?.data) return [];
    
    // Check if data is array directly
    if (Array.isArray(categoriesResponse.data)) {
      return categoriesResponse.data;
    }
    
    // Check if data is object with nested data array
    if (categoriesResponse.data && typeof categoriesResponse.data === 'object') {
      if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
        return categoriesResponse.data.data;
      }
    }
    
    return [];
  }, [categoriesResponse]);

  const [videoFile, setVideoFile] = useState<File | undefined>(undefined);
  const [formData, setFormData] = useState({
    title: "",
    videoThumbnail: "",
    categoryId: "",
    muscleGroup: "",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    description: "",
    cameraAngle: "",
    formValidationRules: [] as FormValidationRule[],
  });

  // Helper to create empty rule
  const createEmptyRule = (): FormValidationRule => ({
    ruleName: "",
    keypointIds: [],
    minAngle: 0,
    maxAngle: 180,
    errorMessage: "",
  });

  // Load exercise data when popup opens
  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title,
        videoThumbnail: exercise.videoThumbnail,
        categoryId: exercise.categoryId,
        muscleGroup: exercise.muscleGroup,
        difficulty: exercise.difficulty as "Beginner" | "Intermediate" | "Advanced",
        description: exercise.description,
        cameraAngle: (exercise as any).cameraAngle || "",
        formValidationRules: ((exercise as any).formValidationRules as FormValidationRule[] | undefined) || [],
      });
      setVideoFile(undefined); // Reset video file
    }
  }, [exercise]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate video file
      if (!file.type.startsWith('video/')) {
        alert('Vui lòng chọn file video hợp lệ');
        return;
      }
      setVideoFile(file);
    }
  };

  // Form validation rules handlers
  const handleAddRule = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setFormData((prev) => ({
      ...prev,
      formValidationRules: [...prev.formValidationRules, createEmptyRule()],
    }));
  };

  const handleRemoveRule = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      formValidationRules: prev.formValidationRules.filter((_, i) => i !== index),
    }));
  };

  const handleRuleChange = (index: number, field: keyof FormValidationRule, value: any) => {
    setFormData((prev) => ({
      ...prev,
      formValidationRules: prev.formValidationRules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  const handleKeypointToggle = (ruleIndex: number, keypointId: KeypointId) => {
    setFormData((prev) => ({
      ...prev,
      formValidationRules: prev.formValidationRules.map((rule, i) => {
        if (i !== ruleIndex) return rule;
        const currentIds = rule.keypointIds;
        const isSelected = currentIds.includes(keypointId);
        return {
          ...rule,
          keypointIds: isSelected
            ? currentIds.filter((id) => id !== keypointId)
            : [...currentIds, keypointId].sort((a, b) => a - b),
        };
      }),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exercise) return;

    // Prepare update data
    const updateData: UpdateExerciseData = {
      name: formData.title,
      description: formData.description,
      categoryId: formData.categoryId,
      level: formData.difficulty,
      videoUrl: formData.videoThumbnail,
      video: videoFile,
    };

    if (formData.cameraAngle) {
      updateData.cameraAngle = formData.cameraAngle;
    }

    const validRules = formData.formValidationRules.filter(
      (rule) => rule.ruleName.trim() && rule.keypointIds.length > 0
    );
    if (validRules.length > 0) {
      updateData.formValidationRules = validRules;
    }

    // Call API update
    updateMutation.mutate(
      { id: exercise.id, data: updateData },
      {
        onSuccess: () => {
          // Call optional callback
          onSave?.({
            ...exercise,
            ...formData,
          });
          onClose();
        },
      }
    );
  };

  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon name="mdi:pencil" size={18} color="white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Chỉnh sửa bài tập</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-all"
          >
            <Icon name="mdi:close" size={18} color="#374151" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="space-y-3.5">
            {/* Exercise Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Tên bài tập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:dumbbell" size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Nhập tên bài tập"
                />
              </div>
            </div>

            {/* Muscle Group / Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Nhóm cơ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:arm-flex" size={16} className="text-gray-400" />
                </div>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={(e) => {
                    const selectedCategoryId = e.target.value;
                    const selectedCategory = categories.find(cat => cat.id === selectedCategoryId);
                    setFormData((prev) => ({
                      ...prev,
                      categoryId: selectedCategoryId,
                      muscleGroup: selectedCategory?.name || "",
                    }));
                  }}
                  required
                  disabled={isCategoriesLoading}
                  className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer disabled:bg-gray-50 disabled:cursor-not-allowed"
                >
                  <option value="">
                    {isCategoriesLoading ? "Đang tải..." : "Chọn nhóm cơ"}
                  </option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:chevron-down" size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mức độ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:chart-line" size={16} className="text-gray-400" />
                </div>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="Beginner">Beginner - Người mới</option>
                  <option value="Intermediate">Intermediate - Trung bình</option>
                  <option value="Advanced">Advanced - Nâng cao</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:chevron-down" size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Video URL - hiển thị video hiện tại */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Video hiện tại
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:video" size={16} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="videoThumbnail"
                  value={formData.videoThumbnail}
                  onChange={handleInputChange}
                  disabled
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg bg-gray-50 text-gray-600 outline-none"
                  placeholder="Chưa có video"
                />
              </div>
            </div>

            {/* Upload Video mới */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Tải lên Video mới (tùy chọn)
              </label>

              {/* Custom File Upload Button */}
              <div className="relative">
                <input
                  type="file"
                  id="video-upload"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="hidden"
                />
                <label
                  htmlFor="video-upload"
                  className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 bg-primary/10 group-hover:bg-primary/20 rounded-lg flex items-center justify-center transition-all">
                      <Icon name="mdi:cloud-upload" size={20} className="text-primary" />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-semibold text-gray-700 group-hover:text-primary transition-colors">
                        {videoFile ? 'Chọn video khác' : 'Chọn video từ máy'}
                      </p>
                      <p className="text-xs text-gray-500">
                        MP4, MOV, AVI - Tối đa 100MB
                      </p>
                    </div>
                  </div>
                </label>
              </div>

              {/* Selected File Display */}
              {videoFile && (
                <div className="mt-2.5 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon name="mdi:video-check" size={18} color="white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-green-800 truncate">
                        {videoFile.name}
                      </p>
                      <p className="text-xs text-green-600">
                        {(videoFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVideoFile(undefined)}
                      className="w-6 h-6 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-all flex-shrink-0"
                      title="Xóa file"
                    >
                      <Icon name="mdi:close" size={14} className="text-green-700" />
                    </button>
                  </div>
                </div>
              )}

              {/* Helper Text */}
              <div className="mt-2 flex items-start gap-1.5">
                <Icon name="mdi:information" size={14} className="text-blue-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-gray-600 leading-relaxed">
                  {videoFile
                    ? 'Video này sẽ thay thế video hiện tại khi bạn lưu thay đổi.'
                    : 'Bỏ trống để giữ nguyên video hiện tại. Chỉ upload khi muốn thay đổi video.'
                  }
                </p>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mô tả bài tập
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Nhập mô tả chi tiết về bài tập..."
              />
            </div>

            {/* Camera Angle */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Góc quay (Camera Angle)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:camera-outline" size={16} className="text-gray-400" />
                </div>
                <select
                  name="cameraAngle"
                  value={formData.cameraAngle}
                  onChange={handleInputChange}
                  className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="">Giữ nguyên / Không đặt</option>
                  <option value="Front">Front</option>
                  <option value="Side">Side</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:chevron-down" size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Form Validation Rules */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-semibold text-gray-700">
                  Luật kiểm tra động tác (Form Validation Rules)
                </label>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddRule(e);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-all cursor-pointer"
                >
                  <Icon name="mdi:plus" size={14} />
                  Thêm rule
                </button>
              </div>

              {formData.formValidationRules.length === 0 ? (
                <p className="text-xs text-gray-500 bg-gray-50 border border-dashed border-gray-300 rounded-lg px-3 py-2">
                  Chưa có rule nào. Nhấn "Thêm rule" để cấu hình kiểm tra góc khớp.
                </p>
              ) : (
                <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                  {formData.formValidationRules.map((rule, index) => (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-xs font-semibold text-gray-700">
                          Rule #{index + 1}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleRemoveRule(index)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Icon name="mdi:delete" size={16} />
                        </button>
                      </div>

                      <div className="space-y-2.5">
                        {/* Rule name */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Tên rule
                          </label>
                          <input
                            type="text"
                            value={rule.ruleName}
                            onChange={(e) =>
                              handleRuleChange(index, "ruleName", e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="VD: Pushup Phase"
                          />
                        </div>

                        {/* Keypoints */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Các điểm khớp (Keypoints)
                          </label>
                          <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto bg-white border border-gray-200 rounded-lg p-2">
                            {Object.entries(KEYPOINT_LABELS).map(([key, label]) => {
                              const keypointId = Number(key) as KeypointId;
                              const isSelected = rule.keypointIds.includes(keypointId);
                              return (
                                <label
                                  key={keypointId}
                                  className="flex items-center gap-1.5 text-[11px] cursor-pointer"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() =>
                                      handleKeypointToggle(index, keypointId)
                                    }
                                    className="w-3.5 h-3.5 text-primary border-gray-300 rounded focus:ring-primary"
                                  />
                                  <span>
                                    <span className="font-mono mr-0.5">
                                      {keypointId}
                                    </span>
                                    - {label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                          {rule.keypointIds.length > 0 && (
                            <p className="text-[11px] text-gray-500 mt-1">
                              Đã chọn: [{rule.keypointIds.join(", ")}]
                            </p>
                          )}
                        </div>

                        {/* Min / Max angle */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Góc tối thiểu
                            </label>
                            <input
                              type="number"
                              value={rule.minAngle}
                              onChange={(e) =>
                                handleRuleChange(index, "minAngle", Number(e.target.value))
                              }
                              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent outline-none"
                              min={0}
                              max={180}
                            />
                          </div>
                          <div>
                            <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                              Góc tối đa
                            </label>
                            <input
                              type="number"
                              value={rule.maxAngle}
                              onChange={(e) =>
                                handleRuleChange(index, "maxAngle", Number(e.target.value))
                              }
                              className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent outline-none"
                              min={0}
                              max={180}
                            />
                          </div>
                        </div>

                        {/* Error message */}
                        <div>
                          <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                            Thông báo lỗi
                          </label>
                          <input
                            type="text"
                            value={rule.errorMessage}
                            onChange={(e) =>
                              handleRuleChange(index, "errorMessage", e.target.value)
                            }
                            className="w-full px-2.5 py-1.5 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-primary focus:border-transparent outline-none"
                            placeholder="VD: Complete proper pushup in burpee"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={updateMutation.isPending}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Đang lưu...</span>
              </>
            ) : (
              <>
                <Icon name="mdi:content-save" size={16} />
                <span>Lưu thay đổi</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExercisePopup;
