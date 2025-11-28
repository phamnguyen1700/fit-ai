import React from 'react';
import { Menu as AntMenu } from 'antd';
import type { MenuProps } from 'antd';

export interface MenuItemType {
  key: string;
  label: React.ReactNode;
  icon?: React.ReactNode;
  children?: MenuItemType[];
}

export interface MenuWrapperProps extends Omit<MenuProps, 'items' | 'onClick'> {
  items: MenuItemType[];
  selectedKeys?: string[];
  onItemClick?: (key: string) => void;
  variant?: 'light' | 'dark';
}

function mapItems(items: MenuItemType[]): Required<MenuProps>['items'] {
  return items.map((item) => ({
    key: item.key,
    label: item.label,
    icon: item.icon,
    children: item.children ? (mapItems(item.children)) : undefined,
  }));
}

export const Menu: React.FC<MenuWrapperProps> = ({
  items,
  selectedKeys,
  onItemClick,
  variant = 'light',
  style,
  className,
  ...rest
}) => {
  return (
    <AntMenu
      mode="inline"
      theme={variant}
      selectedKeys={selectedKeys}
      onClick={(info) => onItemClick?.(info.key)}
      items={mapItems(items)}
      className={`custom-menu${className ? ` ${className}` : ''}`}
      style={{
        background: 'transparent',
        border: 'none',
        ...style,
      }}
      {...rest}
    />
  );
};
