"use client";
import React, { useState } from "react";
import { Modal } from "@/shared/ui/core/Modal";
import { Icon } from "@/shared/ui/icon";
import { CreateExerciseData, FormValidationRule, KeypointId, KEYPOINT_LABELS } from "@/types/exercise";
import { useGetExerciseCategories } from "@/tanstack/hooks/exercisecategory";
import type { ExerciseCategory } from "@/types/exercisecategory";

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExerciseData) => void;
  isLoading?: boolean;
}

const INITIAL_FORM = { 
  name: "", 
  description: "", 
  categoryId: "", 
  level: "Beginner" as const, 
  video: null,
  cameraAngle: "",
  formValidationRules: [] as FormValidationRule[],
};
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

// Helper to create empty form validation rule
const createEmptyRule = (): FormValidationRule => ({
  ruleName: "",
  keypointIds: [],
  minAngle: 0,
  maxAngle: 180,
  errorMessage: "",
});

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Omit<CreateExerciseData, 'video'> & { video: File | null; formValidationRules: FormValidationRule[] }>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateExerciseData, string>>>({});
  const [videoPreview, setVideoPreview] = useState<string>("");

  // Fetch exercise categories - get all categories for dropdown
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetExerciseCategories({
    page: 1,
    pageSize: 1000, // Get all categories
  });

  // Debug: Log the response
  React.useEffect(() => {
    if (categoriesResponse) {
      console.log('Categories Response:', categoriesResponse);
      console.log('Categories Data:', categoriesResponse?.data);
    }
  }, [categoriesResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Debug: Log khi categoryId thay đổi
    if (name === 'categoryId') {
      console.log('CategoryId changed:', value);
    }
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      // Debug: Log formData sau khi update
      if (name === 'categoryId') {
        console.log('Updated formData.categoryId:', updated.categoryId);
      }
      return updated;
    });
    
    if (errors[name as keyof CreateExerciseData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrors(prev => ({ ...prev, video: "Vui lòng chọn file video" }));
      return;
    }

    if (file.size > MAX_VIDEO_SIZE) {
      setErrors(prev => ({ ...prev, video: "File video không được vượt quá 100MB" }));
      return;
    }

    setFormData(prev => ({ ...prev, video: file }));
    setVideoPreview(URL.createObjectURL(file));
    setErrors(prev => ({ ...prev, video: undefined }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateExerciseData, string>> = {};
    if (!formData.name.trim()) newErrors.name = "Tên bài tập không được để trống";
    if (!formData.description.trim()) newErrors.description = "Mô tả không được để trống";
    if (!formData.categoryId) newErrors.categoryId = "Vui lòng chọn danh mục";
    if (!formData.level) newErrors.level = "Vui lòng chọn mức độ";
    if (!formData.video) newErrors.video = "Vui lòng chọn video";
    
    // Validate FormValidationRules: nếu có rules thì phải điền đầy đủ
    if (formData.formValidationRules.length > 0) {
      const incompleteRules = formData.formValidationRules.filter(
        rule => !rule.ruleName.trim() || rule.keypointIds.length === 0
      );
      if (incompleteRules.length > 0) {
        // Không set error nhưng sẽ cảnh báo trong console và alert
        console.warn('Có rules chưa điền đầy đủ:', incompleteRules);
        const shouldContinue = window.confirm(
          `Bạn có ${incompleteRules.length} rule chưa điền đầy đủ thông tin (thiếu tên rule hoặc chưa chọn keypoints).\n\n` +
          'Các rule không hợp lệ sẽ bị bỏ qua khi tạo bài tập.\n\n' +
          'Bạn có muốn tiếp tục không?'
        );
        if (!shouldContinue) {
          return false;
        }
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate categoryId trước khi submit
    if (!formData.categoryId || !formData.categoryId.trim()) {
      setErrors(prev => ({ ...prev, categoryId: "Vui lòng chọn danh mục" }));
      return;
    }
    
    if (validateForm() && formData.video) {
      // Đảm bảo categoryId có giá trị hợp lệ
      const categoryId = formData.categoryId.trim();
      if (!categoryId) {
        console.error('CategoryId is empty!', formData);
        setErrors(prev => ({ ...prev, categoryId: "Vui lòng chọn danh mục" }));
        return;
      }
      
      const submitData: CreateExerciseData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        categoryId: categoryId, // Đảm bảo có giá trị
        level: formData.level,
        video: formData.video,
      };
      
      // Debug: Log để kiểm tra
      console.log('Submitting exercise with categoryId:', categoryId);
      console.log('Full submitData:', submitData);
      
      // Add optional fields if they have values
      if (formData.cameraAngle?.trim()) {
        submitData.cameraAngle = formData.cameraAngle.trim();
      }
      
      // Filter out empty rules and add valid ones
      // Chỉ lọc rules có đầy đủ thông tin: ruleName và keypointIds
      const validRules = formData.formValidationRules.filter(
        rule => rule.ruleName.trim() && rule.keypointIds.length > 0
      );
      
      // Debug: Log để kiểm tra
      console.log('FormValidationRules before filter:', formData.formValidationRules);
      console.log('Valid rules after filter:', validRules);
      
      // Gửi rules nếu có ít nhất 1 rule hợp lệ
      if (validRules.length > 0) {
        submitData.formValidationRules = validRules;
        console.log('Sending FormValidationRules to API:', submitData.formValidationRules);
      } else if (formData.formValidationRules.length > 0) {
        // Có rules nhưng không hợp lệ - cảnh báo user
        console.warn('Có rules nhưng chưa điền đầy đủ thông tin:', formData.formValidationRules);
      }
      
      onSubmit(submitData);
    }
  };

  // Handle form validation rules
  const handleAddRule = () => {
    setFormData(prev => ({
      ...prev,
      formValidationRules: [...prev.formValidationRules, createEmptyRule()],
    }));
  };

  const handleRemoveRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      formValidationRules: prev.formValidationRules.filter((_, i) => i !== index),
    }));
  };

  const handleRuleChange = (index: number, field: keyof FormValidationRule, value: any) => {
    setFormData(prev => ({
      ...prev,
      formValidationRules: prev.formValidationRules.map((rule, i) =>
        i === index ? { ...rule, [field]: value } : rule
      ),
    }));
  };

  const handleKeypointToggle = (ruleIndex: number, keypointId: KeypointId) => {
    setFormData(prev => ({
      ...prev,
      formValidationRules: prev.formValidationRules.map((rule, i) => {
        if (i !== ruleIndex) return rule;
        const currentIds = rule.keypointIds;
        const isSelected = currentIds.includes(keypointId);
        return {
          ...rule,
          keypointIds: isSelected
            ? currentIds.filter(id => id !== keypointId)
            : [...currentIds, keypointId].sort((a, b) => a - b),
        };
      }),
    }));
  };

  const handleClose = () => {
    setFormData(INITIAL_FORM);
    setErrors({});
    setVideoPreview("");
    onClose();
  };

  const handleRemoveVideo = () => {
    setVideoPreview("");
    setFormData(prev => ({ ...prev, video: null }));
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="add-exercise-modal">
        {/* Header Banner */}
        <div className="exercise-modal-header-banner">
          <div className="exercise-modal-header-icon">
            <Icon name="mdi:dumbbell" size={24} className="text-white" />
          </div>
          <div className="exercise-modal-header-text">
            <h3 className="exercise-modal-header-title">Tạo bài tập mới</h3>
            <p className="exercise-modal-header-subtitle">Điền đầy đủ thông tin để thêm bài tập vào hệ thống</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name & Level Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Name */}
            <div>
              <label className="exercise-modal-form-label">
                <Icon name="mdi:format-text" size={16} className="text-[var(--primary)]" />
                Tên bài tập <span className="required">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="VD: Bench Press"
                className="exercise-modal-form-input"
              />
              {errors.name && (
                <p className="exercise-modal-form-error">
                  <Icon name="mdi:alert-circle" size={14} />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Level */}
            <div>
              <label className="exercise-modal-form-label">
                <Icon name="mdi:signal" size={16} className="text-[var(--primary)]" />
                Mức độ <span className="required">*</span>
              </label>
              <select
                name="level"
                value={formData.level}
                onChange={handleInputChange}
                className="exercise-modal-form-select"
              >
                <option value="Beginner">Beginner - Người mới</option>
                <option value="Intermediate">Intermediate - Trung bình</option>
                <option value="Advanced">Advanced - Nâng cao</option>
              </select>
              {errors.level && (
                <p className="exercise-modal-form-error">
                  <Icon name="mdi:alert-circle" size={14} />
                  {errors.level}
                </p>
              )}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="exercise-modal-form-label">
              <Icon name="mdi:folder-outline" size={16} className="text-[var(--primary)]" />
              Danh mục <span className="required">*</span>
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleInputChange}
              className="exercise-modal-form-select"
              disabled={isCategoriesLoading}
            >
              <option value="" className="text-[var(--text-secondary)]">
                {isCategoriesLoading ? 'Đang tải danh mục...' : 'Chọn danh mục bài tập'}
              </option>
              {(() => {
                // Extract categories from response
                let categories: ExerciseCategory[] = [];
                if (categoriesResponse?.data) {
                  if (Array.isArray(categoriesResponse.data)) {
                    // Response is array directly
                    categories = categoriesResponse.data;
                  } else if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
                    // Response is object with nested data array
                    categories = categoriesResponse.data.data;
                  }
                }
                return categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ));
              })()}
            </select>
            {errors.categoryId && (
              <p className="exercise-modal-form-error">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="exercise-modal-form-label">
              <Icon name="mdi:text-box-outline" size={16} className="text-[var(--primary)]" />
              Mô tả <span className="required">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="exercise-modal-form-textarea"
              placeholder="Mô tả chi tiết về bài tập: cách thực hiện, nhóm cơ tập trung, lợi ích..."
            />
            {errors.description && (
              <p className="exercise-modal-form-error">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Camera Angle */}
          <div>
            <label className="exercise-modal-form-label">
              <Icon name="mdi:camera-outline" size={16} className="text-[var(--primary)]" />
              Góc quay (Camera Angle)
            </label>
            <select
              name="cameraAngle"
              value={formData.cameraAngle}
              onChange={handleInputChange}
              className="exercise-modal-form-select"
            >
              <option value="">Chọn góc quay</option>
              <option value="Front">Front</option>
              <option value="Side">Side</option>
            </select>
          </div>

          {/* Video Upload */}
          <div>
            <label className="exercise-modal-form-label">
              <Icon name="mdi:video-outline" size={16} className="text-[var(--primary)]" />
              Video hướng dẫn <span className="required">*</span>
            </label>
            <div className="space-y-3">
              <div className="exercise-modal-video-upload">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleVideoChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="exercise-modal-video-upload-content">
                  <div className="exercise-modal-video-upload-icon">
                    <Icon name="mdi:cloud-upload" size={24} className="text-[var(--primary)]" />
                  </div>
                  <div className="exercise-modal-video-upload-text">
                    <p className="exercise-modal-video-upload-title">
                      {formData.video ? formData.video.name : 'Chọn video để tải lên'}
                    </p>
                    <p className="exercise-modal-video-upload-subtitle">hoặc kéo thả file vào đây</p>
                  </div>
                  <div className="exercise-modal-video-upload-button">
                    <Icon name="mdi:folder-open" size={16} />
                    Chọn file
                  </div>
                </div>
                <p className="exercise-modal-video-upload-info">
                  <Icon name="mdi:information-outline" size={14} />
                  MP4, MOV, AVI • Tối đa 100MB
                </p>
              </div>
              {errors.video && (
                <div className="exercise-modal-video-error-box">
                  <p className="exercise-modal-video-error-text">
                    <Icon name="mdi:alert-circle" size={16} />
                    {errors.video}
                  </p>
                </div>
              )}
              {videoPreview && (
                <div className="exercise-modal-video-preview-card">
                  <div className="exercise-modal-video-preview-header">
                    <p className="exercise-modal-video-preview-title">
                      <Icon name="mdi:eye" size={18} className="text-[var(--primary)]" />
                      Xem trước video
                    </p>
                    <button type="button" onClick={handleRemoveVideo} className="exercise-modal-video-preview-close">
                      <Icon name="mdi:close-circle" size={20} />
                    </button>
                  </div>
                  <video src={videoPreview} controls className="exercise-modal-video-preview-player">
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
            </div>
          </div>

          {/* Form Validation Rules */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="exercise-modal-form-label">
                <Icon name="mdi:ruler" size={16} className="text-[var(--primary)]" />
                Form Validation Rules (Tùy chọn)
              </label>
              <button
                type="button"
                onClick={handleAddRule}
                className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-semibold text-[var(--primary)] bg-[var(--primary)]/10 rounded-lg hover:bg-[var(--primary)]/20 transition-all"
              >
                <Icon name="mdi:plus" size={16} />
                Thêm rule
              </button>
            </div>

            {formData.formValidationRules.length === 0 ? (
              <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-gray-200">
                Chưa có rule nào. Nhấn "Thêm rule" để thêm rule validation cho bài tập.
              </div>
            ) : (
              <div className="space-y-4">
                {formData.formValidationRules.map((rule, ruleIndex) => (
                  <div key={ruleIndex} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-semibold text-gray-700">
                        Rule #{ruleIndex + 1}
                      </h4>
                      <button
                        type="button"
                        onClick={() => handleRemoveRule(ruleIndex)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Icon name="mdi:delete" size={18} />
                      </button>
                    </div>

                    <div className="space-y-3">
                      {/* Rule Name */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Tên rule <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={rule.ruleName}
                          onChange={(e) => handleRuleChange(ruleIndex, 'ruleName', e.target.value)}
                          placeholder="VD: Pushup Phase, Squat Depth"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                      </div>

                      {/* Keypoint IDs - Multi-select with checkboxes */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-2">
                          Keypoint IDs <span className="text-red-500">*</span>
                        </label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-2 bg-white border border-gray-300 rounded-lg">
                          {Object.entries(KEYPOINT_LABELS).map(([key, label]) => {
                            const keypointId = Number(key) as KeypointId;
                            const isSelected = rule.keypointIds.includes(keypointId);
                            return (
                              <label
                                key={keypointId}
                                className="flex items-center gap-2 p-2 rounded hover:bg-gray-100 cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => handleKeypointToggle(ruleIndex, keypointId)}
                                  className="w-4 h-4 text-[var(--primary)] border-gray-300 rounded focus:ring-[var(--primary)]"
                                />
                                <span className="text-xs text-gray-700">
                                  {keypointId}: {label}
                                </span>
                              </label>
                            );
                          })}
                        </div>
                        {rule.keypointIds.length > 0 && (
                          <p className="text-xs text-gray-500 mt-1">
                            Đã chọn: [{rule.keypointIds.join(", ")}]
                          </p>
                        )}
                      </div>

                      {/* Min/Max Angle */}
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Góc tối thiểu (Min Angle)
                          </label>
                          <input
                            type="number"
                            value={rule.minAngle}
                            onChange={(e) => handleRuleChange(ruleIndex, 'minAngle', Number(e.target.value))}
                            min="0"
                            max="180"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 mb-1">
                            Góc tối đa (Max Angle)
                          </label>
                          <input
                            type="number"
                            value={rule.maxAngle}
                            onChange={(e) => handleRuleChange(ruleIndex, 'maxAngle', Number(e.target.value))}
                            min="0"
                            max="180"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                          />
                        </div>
                      </div>

                      {/* Error Message */}
                      <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1">
                          Thông báo lỗi (Error Message)
                        </label>
                        <input
                          type="text"
                          value={rule.errorMessage}
                          onChange={(e) => handleRuleChange(ruleIndex, 'errorMessage', e.target.value)}
                          placeholder="VD: Complete proper pushup in burpee"
                          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent outline-none"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="exercise-modal-form-actions">
            <button type="button" onClick={handleClose} disabled={isLoading} className="exercise-modal-cancel-button">
              <Icon name="mdi:close" size={18} />
              Hủy bỏ
            </button>
            <button type="submit" disabled={isLoading} className="exercise-modal-submit-button">
              {isLoading ? (
                <>
                  <Icon name="mdi:loading" className="animate-spin" size={18} />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Icon name="mdi:check-circle" size={18} />
                  Tạo bài tập
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddExerciseModal;
