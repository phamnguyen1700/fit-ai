"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/ui/core/Modal";
import { Icon } from "@/shared/ui/icon";
import { Input } from "@/shared/ui/core/Input";
import { Button } from "@/shared/ui/core/Button";
import { CreateAdvisorRequest } from "@/types/advisor";

interface AddAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAdvisorRequest) => void;
  isLoading?: boolean;
}

export const AddAdvisorModal: React.FC<AddAdvisorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateAdvisorRequest>({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
  });
  const [certificateFile, setCertificateFile] = useState<File | undefined>(undefined);

  const [errors, setErrors] = useState<Partial<Record<keyof CreateAdvisorRequest, string>>>({});

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        phone: "",
      });
      setErrors({});
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user types
    if (errors[name as keyof CreateAdvisorRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateAdvisorRequest, string>> = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "Tên không được để trống";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Họ không được để trống";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Số điện thoại không được để trống";
    } else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = "Số điện thoại không hợp lệ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCertificateFile(file);
      // Clear error if exists
      if (errors.certificateFile) {
        setErrors((prev) => ({
          ...prev,
          certificateFile: undefined,
        }));
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit({
        ...formData,
        certificateFile: certificateFile,
      });
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
    });
    setCertificateFile(undefined);
    setErrors({});
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="lg"
      variant="centered"
      closable={false}
    >
      <div className="add-advisor-modal">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Thêm advisor mới</h2>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="mdi:close" size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                prefix={<Icon name="mdi:email" />}
                placeholder="Nhập email"
                className={errors.email ? "border-red-500" : ""}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                disabled={isLoading}
                prefix={<Icon name="mdi:account" />}
                placeholder="Nhập tên"
                className={errors.firstName ? "border-red-500" : ""}
              />
            </div>
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
            )}
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Họ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                disabled={isLoading}
                prefix={<Icon name="mdi:account" />}
                placeholder="Nhập họ"
                className={errors.lastName ? "border-red-500" : ""}
              />
            </div>
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Số điện thoại <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
                prefix={<Icon name="mdi:phone" />}
                placeholder="Nhập số điện thoại"
                className={errors.phone ? "border-red-500" : ""}
              />
            </div>
            {errors.phone && (
              <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
            )}
          </div>

          {/* Certificate File Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chứng chỉ (tùy chọn)
            </label>
            <div className="relative">
              <input
                type="file"
                id="certificate-upload"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />
              <label
                htmlFor="certificate-upload"
                className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  <Icon name="mdi:file-document" size={20} className="text-gray-500" />
                  <div className="text-left">
                    <p className="text-sm font-medium text-gray-700">
                      {certificateFile ? certificateFile.name : "Chọn file chứng chỉ"}
                    </p>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, JPG, PNG (tối đa 10MB)
                    </p>
                  </div>
                </div>
              </label>
            </div>
            {certificateFile && (
              <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon name="mdi:check-circle" size={18} className="text-green-600" />
                  <span className="text-sm text-green-800 font-medium">
                    {certificateFile.name}
                  </span>
                  <span className="text-xs text-green-600">
                    ({(certificateFile.size / (1024 * 1024)).toFixed(2)} MB)
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setCertificateFile(undefined)}
                  disabled={isLoading}
                  className="w-6 h-6 bg-green-100 hover:bg-green-200 rounded-full flex items-center justify-center transition-all disabled:opacity-50"
                >
                  <Icon name="mdi:close" size={14} className="text-green-700" />
                </button>
              </div>
            )}
            {errors.certificateFile && (
              <p className="mt-1 text-sm text-red-500">{errors.certificateFile}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 mt-6">
            <Button
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="border-gray-300 hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Icon name="mdi:loading" className="animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : (
                "Tạo advisor"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddAdvisorModal;
