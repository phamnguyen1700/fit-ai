import React from 'react';
import { Badge as AntBadge, type BadgeProps as AntBadgeProps } from 'antd';

export interface BadgeProps extends AntBadgeProps {
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ className, ...props }) => {
  return (
    <AntBadge
      {...props}
      className={(className ? className + ' ' : '') + 'themed-badge'}
    />
  );
};

export default Badge;
