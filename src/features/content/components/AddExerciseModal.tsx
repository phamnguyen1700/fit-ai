"use client";
import React, { useState } from "react";
import { Modal } from "@/shared/ui/core/Modal";
import { Icon } from "@/shared/ui/icon";
import { CreateExerciseData } from "@/types/exercise";
import { useGetExerciseCategories } from "@/tanstack/hooks/exercisecategory";

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExerciseData) => void;
  isLoading?: boolean;
}

const INITIAL_FORM = { name: "", description: "", categoryId: "", level: "Beginner" as const, video: null };
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export const AddExerciseModal: React.FC<AddExerciseModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<Omit<CreateExerciseData, 'video'> & { video: File | null }>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateExerciseData, string>>>({});
  const [videoPreview, setVideoPreview] = useState<string>("");

  // Fetch exercise categories
  const { data: categoriesResponse, isLoading: isCategoriesLoading } = useGetExerciseCategories();

  // Debug: Log the response
  React.useEffect(() => {
    if (categoriesResponse) {
      console.log('Categories Response:', categoriesResponse);
      console.log('Categories Data:', categoriesResponse?.data);
    }
  }, [categoriesResponse]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && formData.video) {
      onSubmit({
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        level: formData.level,
        video: formData.video,
      });
    }
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
              {categoriesResponse?.data && Array.isArray(categoriesResponse.data) && 
                categoriesResponse.data.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))
              }
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
