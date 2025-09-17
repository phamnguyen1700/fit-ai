import React from 'react';
import { Progress as AntProgress, type ProgressProps as AntProgressProps } from 'antd';

export interface ProgressProps extends Omit<AntProgressProps, 'strokeColor'> {
  /** Use brand color by default; override via props if needed */
  strokeColor?: AntProgressProps['strokeColor'];
}

export const Progress: React.FC<ProgressProps> = ({ strokeColor, ...props }) => {
  const brandColor = 'var(--primary)';
  const trailColor = 'var(--border)';

  return (
    <AntProgress
      strokeColor={strokeColor ?? brandColor}
      trailColor={trailColor}
      {...props}
    />
  );
};

export default Progress;


