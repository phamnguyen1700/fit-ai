import React from 'react';
import { Card as AntCard, type CardProps as AntCardProps } from 'antd';

export interface CardProps extends AntCardProps {
  className?: string;
}

export const Card: React.FC<CardProps> = ({ className, ...props }) => {
  return (
    <AntCard
      {...props}
      className={(className ? className + ' ' : '') + 'bg-[var(--bg)] border border-[var(--border)]'}
      styles={{ 
        body: { padding: 16 },
        header: { 
          borderBottom: 'none',
          padding: '0 16px 0 16px',
          marginBottom: -24
        }
      }}
    />
  );
};

export default Card;


