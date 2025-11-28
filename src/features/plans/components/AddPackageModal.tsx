"use client";
import React, { useState } from "react";
import { Modal } from "@/shared/ui/core/Modal";
import { Icon } from "@/shared/ui/icon";
import { CreateSubscriptionRequest } from "@/types/subscription";

interface AddPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSubscriptionRequest) => void;
  isLoading?: boolean;
}

export const AddPackageModal: React.FC<AddPackageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<CreateSubscriptionRequest>({
    name: "",
    description: "",
    amount: 0,
    currency: "VND",
    interval: "month",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateSubscriptionRequest, string>>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    
    // Convert amount to number
    const finalValue = name === "amount" ? parseFloat(value) || 0 : value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));

    // Clear error when user types
    if (errors[name as keyof CreateSubscriptionRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateSubscriptionRequest, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Tên gói không được để trống";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Mô tả không được để trống";
    }

    if (formData.amount <= 0) {
      newErrors.amount = "Giá phải lớn hơn 0";
    }

    if (!formData.currency) {
      newErrors.currency = "Vui lòng chọn loại tiền tệ";
    }

    if (!formData.interval) {
      newErrors.interval = "Vui lòng chọn chu kỳ thanh toán";
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
    // Reset form
    setFormData({
      name: "",
      description: "",
      amount: 0,
      currency: "VND",
      interval: "month",
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
      <div className="add-package-modal">
        {/* Header */}
        <div className="modal-header bg-gradient-to-r from-orange-500 to-orange-600 -m-6 mb-6 px-6 py-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon name="mdi:package-variant-plus" size={22} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Thêm gói đăng ký mới</h2>
              <p className="text-sm text-white/80">Điền thông tin chi tiết cho gói đăng ký</p>
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
          {/* Package Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Tên gói <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:tag-outline" size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="VD: Gói Premium 1 Tháng"
              />
            </div>
            {errors.name && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Mô tả <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={3}
                className={`w-full px-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all resize-none disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Nhập mô tả chi tiết về gói đăng ký..."
              />
            </div>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Giá <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:currency-usd" size={18} className="text-gray-400" />
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                disabled={isLoading}
                min="0"
                step="0.01"
                className={`w-full pl-10 pr-4 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.amount ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="0"
              />
            </div>
            {errors.amount && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Loại tiền tệ <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:cash-multiple" size={18} className="text-gray-400" />
              </div>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.currency ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="VND">VND - Việt Nam Đồng</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="mdi:chevron-down" size={18} className="text-gray-400" />
              </div>
            </div>
            {errors.currency && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.currency}
              </p>
            )}
          </div>

          {/* Interval */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Chu kỳ thanh toán <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon name="mdi:calendar-clock" size={18} className="text-gray-400" />
              </div>
              <select
                name="interval"
                value={formData.interval}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`w-full pl-10 pr-10 py-2.5 text-sm border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                  errors.interval ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="day">Theo ngày</option>
                <option value="week">Theo tuần</option>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <Icon name="mdi:chevron-down" size={18} className="text-gray-400" />
              </div>
            </div>
            {errors.interval && (
              <p className="mt-1 text-xs text-red-500 flex items-center gap-1">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.interval}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-sm font-semibold transition-all shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <Icon name="mdi:check-circle" size={18} />
                  <span>Tạo gói đăng ký</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default AddPackageModal;
