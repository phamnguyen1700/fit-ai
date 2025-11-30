'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/core/Modal';
import { Input, TextArea } from '@/shared/ui/core/Input';
import { Button } from '@/shared/ui/core/Button';
import { Icon } from '@/shared/ui/icon';
import { CreatePolicyRequest } from '@/types/policy';

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePolicyRequest) => void;
  isLoading?: boolean;
}

export const CreatePolicyModal: React.FC<CreatePolicyModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreatePolicyRequest>({
    policyType: '',
    title: '',
    version: '',
    content: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreatePolicyRequest, string>>>({});

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData({
        policyType: '',
        title: '',
        version: '',
        content: '',
      });
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
    if (errors[name as keyof CreatePolicyRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreatePolicyRequest, string>> = {};

    if (!formData.policyType.trim()) {
      newErrors.policyType = 'Loại policy không được để trống';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (!formData.version.trim()) {
      newErrors.version = 'Phiên bản không được để trống';
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
    // Reset form
    setFormData({
      policyType: '',
      title: '',
      version: '',
      content: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      variant="centered"
      title="Tạo Policy mới"
    >
      <div className="create-policy-modal">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Policy Type */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">
              Loại Policy <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:file-document-edit-outline" size={18} className="text-gray-400" />
              </div>
              <Input
                name="policyType"
                value={formData.policyType}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="VD: Điều khoản sử dụng, Chính sách bảo mật..."
                className={`pl-10 ${errors.policyType ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.policyType && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.policyType}
              </p>
            )}
          </div>

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

          {/* Version */}
          <div>
            <label className="block text-sm font-semibold text-[var(--text)] mb-2">
              Phiên bản <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:tag-outline" size={18} className="text-gray-400" />
              </div>
              <Input
                name="version"
                value={formData.version}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="VD: 1.0.0"
                className={`pl-10 ${errors.version ? 'border-red-500' : ''}`}
              />
            </div>
            {errors.version && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.version}
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
                  <span>Đang tạo...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Icon name="mdi:check-circle" size={18} />
                  <span>Tạo Policy</span>
                </div>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default CreatePolicyModal;

