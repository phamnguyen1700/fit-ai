'use client';

import React from 'react';
import { Input } from 'antd';
import type { SearchProps } from 'antd/es/input';
import { Icon } from '@/shared/ui/icon';

interface AdminSearchInputProps extends Omit<SearchProps, 'enterButton'> {
  className?: string;
}

export const SearchInput: React.FC<AdminSearchInputProps> = ({
  placeholder = 'Tìm kiếm người dùng, kế hoạch...',
  className,
  ...props
}) => {
  return (
    <Input
      className={`admin-search-input ${className ?? ''}`}
      size="large"
      allowClear
      placeholder={placeholder}
      prefix={<Icon name="mdi:magnify" />}
      {...props}
    />
  );
};


