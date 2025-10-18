"use client";
import React, { useState } from 'react';
import { Card2 } from '../../../shared/ui/core/Card2';
import { Button } from '../../../shared/ui/core/Button';
import { Icon } from '../../../shared/ui/icon';

interface FeedbackCardProps {
  id: string;
  userAvatar?: string;
  userName: string;
  date: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const FeedbackCard: React.FC<FeedbackCardProps> = ({
  id,
  userAvatar,
  userName,
  date,
  rating,
  content,
  status,
  onApprove,
  onReject,
  onDelete,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="mdi:star"
        size={16}
        color={index < rating ? "#FFB800" : "#E5E7EB"}
      />
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
      default:
        return 'text-orange-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Đã duyệt';
      case 'rejected':
        return 'Đã từ chối';
      case 'pending':
      default:
        return 'Chưa duyệt';
    }
  };

  const truncatedContent = content.length > 100 ? content.substring(0, 100) + '...' : content;

  return (
    <Card2 
      className={`feedback-card ${className}`}
      style={{ 
        border: '1px solid #f0f0f0',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Avatar */}
          <div className="w-12 h-12 rounded-md overflow-hidden flex items-center justify-center" 
               style={{ backgroundColor: '#1e40af' }}>
            {userAvatar ? (
              <img src={userAvatar} alt={userName} className="w-full h-full object-cover" />
            ) : (
              <div className="w-10 h-8 bg-gradient-to-r from-blue-600 to-blue-500 rounded flex items-center justify-center">
                <span className="text-white text-xs font-bold">Dole</span>
              </div>
            )}
          </div>
          
          {/* User Info */}
          <div>
            <h4 className="font-semibold text-gray-900 text-base">{userName}</h4>
          </div>
          <hr className="my-2 border-gray-800" />
        </div>
        


        {/* Status */}
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${status === 'pending' ? 'bg-red-500' : status === 'approved' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            <span className={`text-sm font-medium ${getStatusColor(status)}`}>
              {getStatusText(status)}
            </span>
          </div>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="mdi:star" size={20} color="#FFB800" />
        <span className="text-lg font-semibold text-gray-900">{rating.toFixed(1)}</span>
      </div>

      {/* Content */}
      <div className="mb-6">
        <p className="text-gray-700 leading-relaxed text-base">
          {isExpanded ? content : truncatedContent}
        </p>
        {content.length > 100 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-500 text-sm mt-2 hover:text-gray-700 flex items-center space-x-1"
          >
            <Icon
              name={isExpanded ? "mdi:chevron-up" : "mdi:chevron-down"}
              size={16}
              color="currentColor"
            />
          </button>
        )}
      </div>

      {/* Action Buttons */}
<div 
  className="flex items-center gap-3 pt-4"
  style={{ 
    backgroundColor: '#f8f9fa',
    padding: '16px 20px',
    borderRadius: '12px',
  }}
>
  <Button
    variant="ghost"
    size="lg"
    onClick={() => onReject?.(id)}
    className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-xl shadow-sm border border-gray-100"
  >
    Xoá
  </Button>
  
  <Button
    variant="ghost"
    size="lg"
    onClick={() => onApprove?.(id)}
    className="px-8 py-3 bg-white hover:bg-gray-50 text-gray-900 font-medium rounded-xl shadow-sm border border-gray-200"
  >
    Duyệt
  </Button>

  <Button
    variant="ghost"
    size="lg"
    className="px-4 py-3 bg-white hover:bg-gray-50 rounded-xl shadow-sm border border-gray-200"
  >
    <Icon name="mdi:dots-horizontal" size={20} color="currentColor" />
  </Button>
</div>
    </Card2>
  );
};

export default FeedbackCard;