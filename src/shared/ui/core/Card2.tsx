import React from 'react';
import { Card as AntCard, type CardProps as AntCardProps } from 'antd';

export interface Card2Props extends AntCardProps {
  className?: string;
}

export const Card2: React.FC<Card2Props> = ({ className, ...props }) => {
  return (
    <AntCard
      {...props}
      className={(className ? className + ' ' : '') + 'bg-white border border-[var(--border)]'}
      styles={{ 
        body: { 
          padding: 16,
          backgroundColor: '#ffffff'
        },
        header: { 
          borderBottom: 'none',
          padding: '0 16px 0 16px',
          marginBottom: -24,
          backgroundColor: '#ffffff'
        }
      }}
    />
  );
};

export default Card2;