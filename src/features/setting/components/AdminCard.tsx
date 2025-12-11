"use client";
import React, { useState, useEffect } from 'react';
import Card from '../../../shared/ui/core/Card';
import { Input } from '../../../shared/ui/core/Input';
import { Button } from '../../../shared/ui/core/Button';
import { useAdminProfile, useUpdateAdminProfile } from '@/tanstack/hooks/admin';

export interface AdminCardProps {
  className?: string;
  systemName?: string;
  email?: string;
  contact?: string;
  address?: string;
  isEditing?: boolean;
  onCancel?: () => void;
  onSave?: () => void;
}

const AdminCard: React.FC<AdminCardProps> = ({
  className = "",
  systemName,
  email: propEmail,
  contact: propContact,
  address,
  isEditing = false,
  onCancel,
  onSave,
}) => {
  const { data: adminProfileResponse, isLoading, error } = useAdminProfile();
  const updateAdminProfileMutation = useUpdateAdminProfile();
  
  const adminProfile = adminProfileResponse?.data;
  // Nếu API đã có response, dùng data từ API (nếu null thì hiển thị "N/A")
  // Nếu chưa có response, có thể dùng props
  const initialEmail = adminProfile !== undefined 
    ? (adminProfile?.email ?? "")
    : (propEmail ?? "");
  const initialPhone = adminProfile !== undefined 
    ? (adminProfile?.phone ?? "")
    : (propContact ?? "");
  const initialFirstName = adminProfile?.firstName ?? "";
  const initialLastName = adminProfile?.lastName ?? "";

  // Form state
  const [formData, setFormData] = useState({
    email: initialEmail,
    phone: initialPhone,
    firstName: initialFirstName,
    lastName: initialLastName,
  });

  // Update form data when adminProfile changes
  useEffect(() => {
    if (adminProfile) {
      setFormData({
        email: adminProfile?.email ?? "",
        phone: adminProfile?.phone ?? "",
        firstName: adminProfile?.firstName ?? "",
        lastName: adminProfile?.lastName ?? "",
      });
    }
  }, [adminProfile]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = () => {
    updateAdminProfileMutation.mutate(
      {
        email: formData.email,
        phone: formData.phone,
        firstName: formData.firstName,
        lastName: formData.lastName,
      },
      {
        onSuccess: () => {
          onSave?.();
        },
      }
    );
  };

  const handleCancel = () => {
    // Reset form data to original values
    setFormData({
      email: initialEmail,
      phone: initialPhone,
      firstName: initialFirstName,
      lastName: initialLastName,
    });
    onCancel?.();
  };

  // Display values
  const email = adminProfile !== undefined 
    ? (adminProfile?.email ?? "N/A")
    : (propEmail ?? "N/A");
  const phone = adminProfile !== undefined 
    ? (adminProfile?.phone ?? "N/A")
    : (propContact ?? "N/A");
  const firstName = adminProfile?.firstName ?? "N/A";
  const lastName = adminProfile?.lastName ?? "N/A";

  if (isLoading) {
    return (
      <Card className={`admin-info-card ${className}`}>
        <div className="admin-card-content">
          <h3 className="admin-card-title">Thông tin hệ thống</h3>
          <div className="admin-info-grid">
            <div className="admin-info-row">
              <div className="admin-info-label">Đang tải...</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`admin-info-card ${className}`}>
        <div className="admin-card-content">
          <h3 className="admin-card-title">Thông tin hệ thống</h3>
          <div className="admin-info-grid">
            <div className="admin-info-row">
              <div className="admin-info-label">Lỗi khi tải dữ liệu</div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`admin-info-card ${className}`}>
      <div className="admin-card-content">
        <h3 className="admin-card-title">Thông tin hệ thống</h3>
        
        <div className="admin-info-grid">
          {/* Tên hệ thống */}
          {systemName && (
            <div className="admin-info-row">
              <div className="admin-info-label">Tên hệ thống</div>
              <div className="admin-info-value">{systemName}</div>
            </div>
          )}
          
          {/* Email */}
          <div className="admin-info-row">
            <div className="admin-info-label">Email</div>
            {isEditing ? (
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="Nhập email"
                className="w-full"
              />
            ) : (
              <div className="admin-info-value">{email}</div>
            )}
          </div>
          
          {/* Phone */}
          <div className="admin-info-row">
            <div className="admin-info-label">Phone</div>
            {isEditing ? (
              <Input
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Nhập số điện thoại"
                className="w-full"
              />
            ) : (
              <div className="admin-info-value">{phone}</div>
            )}
          </div>
          
          {/* First Name */}
          <div className="admin-info-row">
            <div className="admin-info-label">First Name</div>
            {isEditing ? (
              <Input
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Nhập tên"
                className="w-full"
              />
            ) : (
              <div className="admin-info-value">{firstName}</div>
            )}
          </div>
          
          {/* Last Name */}
          <div className="admin-info-row">
            <div className="admin-info-label">Last Name</div>
            {isEditing ? (
              <Input
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Nhập họ"
                className="w-full"
              />
            ) : (
              <div className="admin-info-value">{lastName}</div>
            )}
          </div>
          
          {/* Address */}
          {address && (
            <div className="admin-info-row">
              <div className="admin-info-label">Address</div>
              <div className="admin-info-value">{address}</div>
            </div>
          )}
        </div>

        {/* Action buttons when editing */}
        {isEditing && (
          <div className="flex items-center gap-3 mt-6 pt-6 border-t">
            <Button
              variant="solid"
              size="md"
              onClick={handleSave}
              disabled={updateAdminProfileMutation.isPending}
              loading={updateAdminProfileMutation.isPending}
              className="flex items-center gap-2"
              style={{
                backgroundColor: '#FF8C00',
                borderColor: '#FF8C00',
                color: 'white',
              }}
            >
              Lưu
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={handleCancel}
              className="flex items-center gap-2"
              style={{
                backgroundColor: '#f3f4f6',
                borderColor: '#d1d5db',
                color: '#6b7280',
              }}
            >
              Hủy
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default AdminCard;