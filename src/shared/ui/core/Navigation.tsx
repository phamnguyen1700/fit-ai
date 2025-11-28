"use client";
import React from 'react';
import { Breadcrumb, type BreadcrumbProps } from 'antd';
import { Icon } from '../icon';

export interface BreadcrumbItem {
  title: string;
  href?: string;
  icon?: string;
  onClick?: () => void;
}

export interface BreadcrumbNavigationProps extends Omit<BreadcrumbProps, 'items'> {
  items: BreadcrumbItem[];
  separator?: string | React.ReactNode;
  className?: string;
}

export const BreadcrumbNavigation: React.FC<BreadcrumbNavigationProps> = ({
  items,
  separator = "/",
  className,
  ...props
}) => {
  const breadcrumbItems = items.map((item, index) => ({
    title: (
      <span 
        className={`navigation-item ${item.href || item.onClick ? 'navigation-item-clickable' : ''}`}
        onClick={item.onClick}
      >
        {item.icon && (
          <Icon 
            name={item.icon} 
            size={14} 
            className="navigation-item-icon" 
          />
        )}
        {item.href ? (
          <a href={item.href} className="navigation-link">
            {item.title}
          </a>
        ) : (
          item.title
        )}
      </span>
    ),
    key: index,
  }));

  return (
    <Breadcrumb
      {...props}
      items={breadcrumbItems}
      separator={separator}
      className={`themed-navigation ${className || ''}`}
    />
  );
};

// Keep the old Navigation export for backward compatibility
export const Navigation = BreadcrumbNavigation;

export default BreadcrumbNavigation;
