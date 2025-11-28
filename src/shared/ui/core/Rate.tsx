import React from 'react';
import { Rate as AntRate, type RateProps as AntRateProps } from 'antd';

export interface RateProps extends AntRateProps {
  className?: string;
}

export const Rate: React.FC<RateProps> = ({ className, ...props }) => {
  return <AntRate {...props} className={(className ? className + ' ' : '') + 'themed-rate'} />;
};

export default Rate;


