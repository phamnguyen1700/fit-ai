import React from 'react';
import { Button as AntButton, ButtonProps as AntButtonProps } from 'antd';

interface ButtonProps extends Omit<AntButtonProps, 'size' | 'type' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'dashed' | 'link' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  style,
  ...props
}) => {
  // Map custom variants to Ant Design types
  const getAntType = (variant: string) => {
    switch (variant) {
      case 'primary': return 'primary';
      case 'secondary': return 'default';
      case 'danger': return 'primary';
      case 'ghost': return 'text';
      case 'dashed': return 'dashed';
      case 'link': return 'link';
      case 'text': return 'text';
      default: return 'primary';
    }
  };

  // Map custom sizes to Ant Design sizes
  const getAntSize = (size: string) => {
    switch (size) {
      case 'sm': return 'small';
      case 'md': return 'middle';
      case 'lg': return 'large';
      default: return 'middle';
    }
  };

  // Custom styles based on variant
  const getCustomStyle = () => {
    const baseStyle = {
      fontWeight: '500',
      transition: 'all 0.2s ease',
    };

    switch (variant) {
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: 'var(--error)',
          borderColor: 'var(--error)',
          color: 'var(--text-inverse)',
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: 'var(--bg-tertiary)',
          borderColor: 'var(--border-secondary)',
          color: 'var(--text)',
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: 'var(--border)',
          color: 'var(--text)',
        };
      default:
        return baseStyle;
    }
  };

  return (
    <AntButton
      type={getAntType(variant) as any}
      size={getAntSize(size) as any}
      className={className}
      style={{
        ...getCustomStyle(),
        ...style,
      }}
      {...props}
    >
      {children}
    </AntButton>
  );
};