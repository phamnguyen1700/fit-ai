import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps, PasswordProps, SearchProps, TextAreaProps } from 'antd/es/input';

export type InputProps = AntInputProps;

const InputBase = React.forwardRef<any, AntInputProps>((props, ref) => {
  const { className, rootClassName, ...rest } = props as any;
  const themedClass = ['themed-input', className].filter(Boolean).join(' ');
  const themedRoot = ['themed-input', rootClassName].filter(Boolean).join(' ');
  return <AntInput ref={ref} className={themedClass} rootClassName={themedRoot} {...rest} />;
});

export const Input = Object.assign(InputBase, {
  Password: React.forwardRef<any, PasswordProps>((props, ref) => {
    const { className, rootClassName, ...rest } = props as any;
    const themedClass = ['themed-input', className].filter(Boolean).join(' ');
    const themedRoot = ['themed-input', rootClassName].filter(Boolean).join(' ');
    return <AntInput.Password ref={ref} className={themedClass} rootClassName={themedRoot} {...rest} />;
  }),
  Search: React.forwardRef<any, SearchProps>((props, ref) => {
    const { className, rootClassName, ...rest } = props as any;
    const themedClass = ['themed-input', className].filter(Boolean).join(' ');
    const themedRoot = ['themed-input', rootClassName].filter(Boolean).join(' ');
    return <AntInput.Search ref={ref} allowClear className={themedClass} rootClassName={themedRoot} {...rest} />;
  }),
  TextArea: React.forwardRef<any, TextAreaProps>((props, ref) => {
    const { className, rootClassName, autoSize = true, ...rest } = props as any;
    const themedClass = ['themed-input', className].filter(Boolean).join(' ');
    const themedRoot = ['themed-input', rootClassName].filter(Boolean).join(' ');
    return <AntInput.TextArea ref={ref} autoSize={autoSize as any} className={themedClass} rootClassName={themedRoot} {...rest} />;
  }),
});

export const PasswordInput = Input.Password as any;
export const SearchInput = Input.Search as any;
export const TextArea = Input.TextArea as any;
