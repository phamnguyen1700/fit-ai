import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps, PasswordProps, SearchProps, TextAreaProps, InputRef } from 'antd/es/input';

export type InputProps = AntInputProps;

const InputBase = React.forwardRef<InputRef, AntInputProps>((props, ref) => {
  const { className, rootClassName, ...rest } = props;
  const themedClass = ['themed-input', className].filter(Boolean).join(' ');
  const themedRoot = ['themed-input', rootClassName].filter(Boolean).join(' ');
  return <AntInput ref={ref} className={themedClass} rootClassName={themedRoot} {...rest} />;
});
InputBase.displayName = 'InputBase';

export const Input = Object.assign(InputBase, {
  Password: (() => {
    const PasswordComponent = React.forwardRef<InputRef, PasswordProps>((props, ref) => {
      const { className, rootClassName, ...rest } = props;
      const themedClass = ['themed-input', className].filter(Boolean).join(' ');
      const themedRoot = ['themed-input', rootClassName].filter(Boolean).join(' ');
      return <AntInput.Password ref={ref} className={themedClass} rootClassName={themedRoot} {...rest} />;
    });
    PasswordComponent.displayName = 'InputPassword';
    return PasswordComponent;
  })(),
  Search: (() => {
    const SearchComponent = React.forwardRef<InputRef, SearchProps>((props, ref) => {
      const { className, rootClassName, ...rest } = props;
      const themedClass = ['themed-input', className].filter(Boolean).join(' ');
      const themedRoot = ['themed-input', rootClassName].filter(Boolean).join(' ');
      return <AntInput.Search ref={ref} allowClear className={themedClass} rootClassName={themedRoot} {...rest} />;
    });
    SearchComponent.displayName = 'InputSearch';
    return SearchComponent;
  })(),
  TextArea: (() => {
    const TextAreaComponent = React.forwardRef<InputRef, TextAreaProps>((props, ref) => {
      const { className, rootClassName, autoSize = true, ...rest } = props;
      const themedClass = ['themed-input', className].filter(Boolean).join(' ');
      const themedRoot = ['themed-input', rootClassName].filter(Boolean).join(' ');
      return <AntInput.TextArea ref={ref} autoSize={autoSize} className={themedClass} rootClassName={themedRoot} {...rest} />;
    });
    TextAreaComponent.displayName = 'InputTextArea';
    return TextAreaComponent;
  })()
});

export const PasswordInput = Input.Password;
export const SearchInput = Input.Search;
export const TextArea = Input.TextArea;
