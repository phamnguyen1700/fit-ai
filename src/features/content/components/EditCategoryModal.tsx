"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, TextArea } from "@/shared/ui";
import { UpdateExerciseCategoryRequest, ExerciseCategory } from "@/types/exercisecategory";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdateExerciseCategoryRequest) => void;
  categoryData: ExerciseCategory | null;
  isLoading?: boolean;
}

export const EditCategoryModal: React.FC<EditCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  categoryData,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdateExerciseCategoryRequest>({
    id: "",
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof UpdateExerciseCategoryRequest, string>>>({});

  // Load category data when modal opens
  useEffect(() => {
    if (isOpen && categoryData) {
      setFormData({
        id: categoryData.id,
        name: categoryData.name || "",
        description: categoryData.description || "",
      });
      setErrors({});
    }
  }, [isOpen, categoryData]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof UpdateExerciseCategoryRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateExerciseCategoryRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên danh mục không được để trống";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      id: "",
      name: "",
      description: "",
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      title="Sửa danh mục bài tập"
      isOpen={isOpen}
      onClose={handleClose}
      size="md"
      showFooter={true}
      footerContent={
        <div className="flex justify-end gap-3">
          <Button
            variant="secondary"
            onClick={handleClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tên danh mục */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Tên danh mục <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Nhập tên danh mục"
            className={errors.name ? "border-red-500" : ""}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* Mô tả */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-2">
            Mô tả <span className="text-red-500">*</span>
          </label>
          <TextArea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Nhập mô tả danh mục"
            rows={4}
            className={errors.description ? "border-red-500" : ""}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-500">{errors.description}</p>
          )}
        </div>
      </form>
    </Modal>
  );
};

export default EditCategoryModal;

