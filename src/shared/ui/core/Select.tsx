import React from 'react';
import { Select as AntSelect, type SelectProps as AntSelectProps } from 'antd';

interface SelectProps<ValueType> extends AntSelectProps<ValueType> {
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Select<ValueType = any>({ className, ...props }: SelectProps<ValueType>){
  return <AntSelect {...props} className={(className ? className + ' ' : '') + 'themed-select'} />;
};

export default Select;


