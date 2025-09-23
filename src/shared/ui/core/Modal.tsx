import React from 'react';
import { Modal as AntModal, ModalProps as AntModalProps } from 'antd';

interface ModalProps extends Omit<AntModalProps, 'open' | 'onCancel' | 'title'> {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  variant?: 'default' | 'centered' | 'fullscreen';
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showFooter?: boolean;
  footerContent?: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  variant = 'default',
  size = 'md',
  className,
  style,
  rootClassName,
  showFooter = false,
  footerContent,
  ...props
}) => {
  // Map custom sizes to Ant Design widths
  const getAntWidth = (size: string) => {
    switch (size) {
      case 'sm': return 400;
      case 'md': return 600;
      case 'lg': return 800;
      case 'xl': return 1000;
      case '2xl': return 1300;
      default: return 600;
    }
  };

  // Custom styles based on variant
  const getCustomStyle = () => {
    const baseStyle = {
      fontWeight: '500',
    };

    if (variant === 'fullscreen') {
      return {
        ...baseStyle,
        maxWidth: '100%',
        width: '100vw',
        height: '100vh',
      };
    }

    return baseStyle;
  };

  return (
    <AntModal
      open={isOpen}
      onCancel={onClose}
      title={title}
      width={variant === 'fullscreen' ? '100vw' : getAntWidth(size)}
      centered={variant === 'centered'}
      className={className}
      rootClassName={[rootClassName, 'themed-modal'].filter(Boolean).join(' ')}
      footer={showFooter ? footerContent : null}
      style={{
        ...getCustomStyle(),
        ...style,
      }}
      styles={{
        content: {
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
          border: '1px solid var(--border)',
        },
        body: {
          padding: '24px',
          color: 'var(--text)',
          backgroundColor: 'var(--bg)',
        },
        header: {
          borderBottom: '1px solid var(--border)',
          padding: '16px 24px',
          backgroundColor: 'var(--bg)',
          color: 'var(--text)',
        },
        footer: showFooter
          ? {
              borderTop: '1px solid var(--border)',
              padding: '10px 16px',
              backgroundColor: 'var(--bg)',
            }
          : undefined,
      }}
      {...props}
    >
      {children}
    </AntModal>
  );
};