"use client";
import React from 'react';
import Card from '../../../shared/ui/core/Card';

export interface AdminCardProps {
  className?: string;
  systemName?: string;
  email?: string;
  contact?: string;
  address?: string;
}

const AdminCard: React.FC<AdminCardProps> = ({
  className = "",
  systemName = "whitehacker",
  email = "bill.sanders@example.com", 
  contact = "0987654321",
  address = "12 Nguyen Sieu, Ben Nghe, District 1"
}) => {
  return (
    <Card className={`admin-info-card ${className}`}>
      <div className="admin-card-content">
        <h3 className="admin-card-title">Thông tin hệ thống</h3>
        
        <div className="admin-info-grid">
          {/* Tên hệ thống */}
          <div className="admin-info-row">
            <div className="admin-info-label">Tên hệ thống</div>
            <div className="admin-info-value">{systemName}</div>
          </div>
          
          {/* Email */}
          <div className="admin-info-row">
            <div className="admin-info-label">Email</div>
            <div className="admin-info-value">{email}</div>
          </div>
          
          {/* Contact */}
          <div className="admin-info-row">
            <div className="admin-info-label">Contact</div>
            <div className="admin-info-value">{contact}</div>
          </div>
          
          {/* Address */}
          <div className="admin-info-row">
            <div className="admin-info-label">Address</div>
            <div className="admin-info-value">{address}</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AdminCard;