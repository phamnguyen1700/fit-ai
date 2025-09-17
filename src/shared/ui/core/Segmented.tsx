import React from 'react';
import { Segmented as AntSegmented, type SegmentedProps as AntSegmentedProps } from 'antd';

export interface SegmentedProps extends AntSegmentedProps {
  className?: string;
}

export const Segmented: React.FC<SegmentedProps> = ({ className, ...props }) => {
  return (
    <AntSegmented
      {...props}
      className={(className ? className + ' ' : '') + 'themed-segmented'}
    />
  );
};

export default Segmented;


