"use client";
import React, { useState, useEffect } from "react";
import { Modal } from "@/shared/ui/core/Modal";
import { Icon } from "@/shared/ui/icon";
import { UpdateSubscriptionRequest } from "@/types/subscription";
import { PackageData } from "./PackageListTable";

interface EditPackageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, data: UpdateSubscriptionRequest) => void;
  isLoading?: boolean;
  packageData: PackageData | null;
}

export const EditPackageModal: React.FC<EditPackageModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  packageData,
}) => {
  const [formData, setFormData] = useState<UpdateSubscriptionRequest>({
    name: "",
    description: "",
    amount: 0,
    currency: "VND",
    interval: "month",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof UpdateSubscriptionRequest, string>>>({});

  // Load package data when modal opens
  useEffect(() => {
    if (packageData && isOpen) {
      setFormData({
        name: packageData.name || "",
        description: "", // Will need to be provided or keep existing
        amount: packageData.price || 0,
        currency: "VND",
        interval: packageData.duration || "month",
      });
    }
  }, [packageData, isOpen]);

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
    if (errors[name as keyof UpdateSubscriptionRequest]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof UpdateSubscriptionRequest, string>> = {};

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
    
    if (validateForm() && packageData) {
      onSubmit(packageData.id, formData);
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
      <div className="subscription-edit-modal">
        {/* Header */}
        <div className="modal-header flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="modal-header-icon">
              <Icon name="mdi:pencil" size={24} color="white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Chỉnh sửa gói đăng ký</h2>
              <p className="text-sm text-white/80">Cập nhật thông tin chi tiết cho gói đăng ký</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="modal-header-close"
          >
            <Icon name="mdi:close" size={20} color="white" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Package Name */}
          <div>
            <label className="form-label">
              Tên gói <span className="form-label-required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="form-icon-wrapper">
                <Icon name="mdi:tag-outline" size={18} />
              </div>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`form-input ${errors.name ? 'error' : ''}`}
                placeholder="VD: Gói Premium 1 Tháng"
              />
            </div>
            {errors.name && (
              <p className="form-error">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.name}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="form-label">
              Mô tả <span className="form-label-required">*</span>
            </label>
            <div className="form-input-wrapper">
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                disabled={isLoading}
                rows={3}
                className={`form-textarea ${errors.description ? 'error' : ''}`}
                placeholder="Nhập mô tả chi tiết về gói đăng ký..."
              />
            </div>
            {errors.description && (
              <p className="form-error">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.description}
              </p>
            )}
          </div>

          {/* Amount */}
          <div>
            <label className="form-label">
              Giá <span className="form-label-required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="form-icon-wrapper">
                <Icon name="mdi:currency-usd" size={18} />
              </div>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleInputChange}
                disabled={isLoading}
                min="0"
                step="0.01"
                className={`form-input ${errors.amount ? 'error' : ''}`}
                placeholder="0"
              />
            </div>
            {errors.amount && (
              <p className="form-error">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.amount}
              </p>
            )}
          </div>

          {/* Currency */}
          <div>
            <label className="form-label">
              Loại tiền tệ <span className="form-label-required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="form-icon-wrapper">
                <Icon name="mdi:cash-multiple" size={18} />
              </div>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`form-select ${errors.currency ? 'error' : ''}`}
              >
                <option value="VND">VND - Việt Nam Đồng</option>
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
              <div className="form-select-icon">
                <Icon name="mdi:chevron-down" size={18} />
              </div>
            </div>
            {errors.currency && (
              <p className="form-error">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.currency}
              </p>
            )}
          </div>

          {/* Interval */}
          <div>
            <label className="form-label">
              Chu kỳ thanh toán <span className="form-label-required">*</span>
            </label>
            <div className="form-input-wrapper">
              <div className="form-icon-wrapper">
                <Icon name="mdi:calendar-clock" size={18} />
              </div>
              <select
                name="interval"
                value={formData.interval}
                onChange={handleInputChange}
                disabled={isLoading}
                className={`form-select ${errors.interval ? 'error' : ''}`}
              >
                <option value="day">Theo ngày</option>
                <option value="week">Theo tuần</option>
                <option value="month">Theo tháng</option>
                <option value="year">Theo năm</option>
              </select>
              <div className="form-select-icon">
                <Icon name="mdi:chevron-down" size={18} />
              </div>
            </div>
            {errors.interval && (
              <p className="form-error">
                <Icon name="mdi:alert-circle" size={14} />
                {errors.interval}
              </p>
            )}
          </div>

          {/* Footer Actions */}
          <div className="form-footer">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="btn-cancel"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-submit"
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  <span>Đang cập nhật...</span>
                </>
              ) : (
                <>
                  <Icon name="mdi:check-circle" size={18} />
                  <span>Cập nhật gói đăng ký</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default EditPackageModal;
