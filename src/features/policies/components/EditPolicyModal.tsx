'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/core/Modal';
import { Input, TextArea } from '@/shared/ui/core/Input';
import { Button } from '@/shared/ui/core/Button';
import { Icon } from '@/shared/ui/icon';
import { UpdatePolicyRequest, Policy } from '@/types/policy';

interface EditPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: UpdatePolicyRequest) => void;
  policy: Policy | null;
  isLoading?: boolean;
}

export const EditPolicyModal: React.FC<EditPolicyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  policy,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<UpdatePolicyRequest>({
    title: '',
    content: '',
    isActive: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdatePolicyRequest, string>>>({});

  // Reset and populate form when modal opens or policy changes
  useEffect(() => {
    if (isOpen && policy) {
      setFormData({
        title: policy.title || '',
        content: policy.content || '',
        isActive: policy.isActive ?? false,
      });
      setErrors({});
    }
  }, [isOpen, policy]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error when user types
    if (errors[name as keyof UpdatePolicyRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdatePolicyRequest, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
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
      title: '',
      content: '',
      isActive: false,
    });
    setErrors({});
    onClose();
  };

  if (!policy) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      variant="centered"
      title="Chỉnh sửa Policy"
    >
      <div className="edit-policy-modal">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:format-title" size={18} className="text-gray-400" />
              </div>
              <Input
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="VD: Điều khoản sử dụng dịch vụ"
                className={`pl-10 ${errors.title ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.title && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">
              Nội dung <span className="text-red-500">*</span>
            </label>
            <TextArea
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              disabled={isLoading}
              placeholder="Nhập nội dung policy..."
              rows={8}
              className={errors.content ? 'border-red-500' : ''}
            />
            {errors.content && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.content}
              </p>
            )}
          </div>

          {/* Is Active */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                disabled={isLoading}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer disabled:opacity-50"
              />
              <span className="text-sm font-semibold text-[var(--text)]">
                Trạng thái hoạt động
              </span>
            </label>
            <p className="mt-1 text-xs text-[var(--text-secondary)] ml-8">
              Bật/tắt trạng thái hoạt động của policy này
            </p>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-[var(--border)] mt-6">
            <Button
              variant="secondary"
              size="md"
              onClick={handleClose}
              disabled={isLoading}
              className="px-6 py-2.5 min-w-[120px] font-semibold hover:shadow-sm transition-all rounded-lg border border-[var(--border-secondary)] hover:bg-[var(--bg-secondary)]"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSubmit()}
              disabled={isLoading}
              className="px-6 py-2.5 min-w-[160px] font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang cập nhật...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon name="mdi:check-circle" size={18} />
                  <span>Cập nhật Policy</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditPolicyModal;

