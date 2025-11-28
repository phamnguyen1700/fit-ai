import React from 'react';
import { Card } from '@/shared/ui';
import { Avatar } from '@/shared/ui';
import { Rate } from '@/shared/ui';

export interface FeedbackCardProps {
  name: string;
  role: string;
  avatarUrl: string;
  rating: number; // 0..5
  content: string;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ name, role, avatarUrl, rating, content }) => {
  return (
    <Card className="rounded-xl feedback-card">
      <div className="flex items-start gap-3">
        <Avatar src={avatarUrl} size={40} />
        <div className="flex-1">
          <div className="text font-semibold leading-tight">{name}</div>
          <div className="text-secondary text-xs">{role}</div>
          <div className="mt-1">
            <Rate disabled defaultValue={rating} />
          </div>
          <p className="mt-1 text-sm text">{content}</p>
        </div>
      </div>
    </Card>
  );
};

export default FeedbackCard;


