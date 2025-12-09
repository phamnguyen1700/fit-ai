"use client";
import React, { useState, useEffect } from "react";
import { Modal, Button, Input, TextArea } from "@/shared/ui";
import { CreateExerciseCategoryRequest } from "@/types/exercisecategory";

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateExerciseCategoryRequest) => void;
  isLoading?: boolean;
}

const INITIAL_FORM: CreateExerciseCategoryRequest = {
  name: "",
  description: "",
};

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateExerciseCategoryRequest>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<Record<keyof CreateExerciseCategoryRequest, string>>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(INITIAL_FORM);
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof CreateExerciseCategoryRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateExerciseCategoryRequest, string>> = {};

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
    setFormData(INITIAL_FORM);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      title="Thêm danh mục bài tập"
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
            {isLoading ? "Đang tạo..." : "Tạo danh mục"}
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

export default AddCategoryModal;

