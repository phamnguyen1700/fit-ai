import React from 'react';
import { Breadcrumb as AntBreadcrumb, type BreadcrumbProps as AntBreadcrumbProps } from 'antd';

export interface BreadcrumbProps extends AntBreadcrumbProps {
  className?: string;
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ className, ...props }) => {
  return (
    <AntBreadcrumb
      {...props}
      className={(className ? className + ' ' : '') + 'themed-breadcrumb'}
    />
  );
};

export default Breadcrumb;
