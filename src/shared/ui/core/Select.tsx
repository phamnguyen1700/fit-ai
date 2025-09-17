import React from 'react';
import { Select as AntSelect, type SelectProps as AntSelectProps } from 'antd';

export interface SelectProps<ValueType = any> extends AntSelectProps<ValueType> {
  className?: string;
}

export const Select = <ValueType extends unknown = any,>({ className, ...props }: SelectProps<ValueType>) => {
  return <AntSelect {...props} className={(className ? className + ' ' : '') + 'themed-select'} />;
};

export default Select;


