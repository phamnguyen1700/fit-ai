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
  status: 'pending' | 'approved' | 'rejected' | 'published';
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onHide?: (id: string) => void;
  onRestore?: (id: string) => void;
  className?: string;
}

const STATUS_CONFIG = {
  pending: { color: 'text-orange-600', text: 'Chưa duyệt', dot: 'bg-red-500' },
  approved: { color: 'text-green-600', text: 'Đã duyệt', dot: 'bg-green-500' },
  rejected: { color: 'text-red-600', text: 'Từ chối', dot: 'bg-gray-400' },
  published: { color: 'text-blue-600', text: 'Công khai', dot: 'bg-blue-500' }
};

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
  onPublish,
  onHide,
  onRestore,
  className = ""
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = STATUS_CONFIG[status];
  const truncatedContent = content.length > 100 ? content.substring(0, 100) + '...' : content;

  const handleDeleteHover = (e: React.MouseEvent<HTMLElement>, isHover: boolean) => {
    const target = e.currentTarget;
    if (isHover) {
      target.style.backgroundColor = 'var(--error)';
      target.style.borderColor = 'var(--error)';
      target.style.color = 'white';
    } else {
      target.style.backgroundColor = 'white';
      target.style.borderColor = '#d1d5db';
      target.style.color = 'var(--text)';
    }
  };

  const DeleteButton = () => (
    <Button
      variant="solid"
      size="lg"
      onClick={() => onDelete?.(id)}
      onMouseEnter={(e) => handleDeleteHover(e, true)}
      onMouseLeave={(e) => handleDeleteHover(e, false)}
    >
      Xoá
    </Button>
  );

  const renderActions = () => {
    switch (status) {
      case 'pending':
        return (
          <>
            <DeleteButton />
            <Button variant="solid" size="lg" onClick={() => onApprove?.(id)}>Duyệt</Button>
          </>
        );
      case 'approved':
        return (
          <>
            <DeleteButton />
            <Button variant="solid" size="lg" onClick={() => onPublish?.(id)}>Công khai</Button>
          </>
        );
      case 'rejected':
        return <Button variant="solid" size="lg" onClick={() => onRestore?.(id)}>Khôi phục</Button>;
      case 'published':
        return (
          <>
            <DeleteButton />
            <Button variant="solid" size="lg" onClick={() => onHide?.(id)}>Ẩn</Button>
          </>
        );
    }
  };

  return (
    <Card2 
      className={`feedback-card ${className}`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
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
          <div>
            <h4 className="font-semibold text-gray-900 text-base">{userName}</h4>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
          <div className="flex items-center space-x-2 mb-1">
            <div className={`w-2 h-2 rounded-full ${statusConfig.dot}`}></div>
            <span className={`text-sm font-medium ${statusConfig.color}`}>
              {statusConfig.text}
            </span>
          </div>
          <p className="text-sm text-gray-400">{date}</p>
        </div>
      </div>
      
      <hr className="border-gray-200 mb-4" />

      {/* Rating and Content */}
      <div className="flex gap-6 mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="mdi:star" size={20} color="#FFB800" />
          <span className="text-lg font-semibold text-gray-900">{rating.toFixed(1)}</span>
        </div>

        <div className="w-px bg-gray-200 self-stretch"></div>

        <div className="flex-1">
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
      </div>

      {/* Action Buttons */}
      <div className="feedback-card-actions flex items-center gap-3 pt-4">
        {renderActions()}
        <Button
          variant="solid"
          size="lg"
          style={{ width: '28px', minWidth: '28px', padding: '0' }}
        >
          <Icon name="mdi:dots-vertical" size={20} color="currentColor" />
        </Button>
      </div>
    </Card2>
  );
};

export default FeedbackCard;