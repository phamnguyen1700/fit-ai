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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleClose = () => {
    setFormData({
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
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
      closable={false}
    >
      <div className="add-advisor-modal">
        {/* Header */}
        <div className="modal-header bg-gradient-to-r from-orange-500 to-orange-600 -m-6 mb-6 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon name="mdi:account-plus" size={22} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Thêm advisor mới</h2>
              <p className="text-sm text-white/80">Điền thông tin để tạo tài khoản advisor</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="w-8 h-8 rounded-lg bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Icon name="mdi:close" size={20} color="white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
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

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
              className="bg-orange-500 hover:bg-orange-600 border-orange-500 hover:border-orange-600"
            >
              {isLoading ? (
                <>
                  <Icon name="mdi:loading" className="animate-spin mr-2" />
                  Đang tạo...
                </>
              ) : (
                <>
                  <Icon name="mdi:check" className="mr-2" />
                  Tạo advisor
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddAdvisorModal;
