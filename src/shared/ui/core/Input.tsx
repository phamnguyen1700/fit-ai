import React from 'react';
import { Input as AntInput } from 'antd';
import type { InputProps as AntInputProps, PasswordProps, SearchProps, TextAreaProps } from 'antd/es/input';

export type InputProps = AntInputProps;

export const Input: React.FC<InputProps> = (props) => {
  return <AntInput {...props} />;
};

export const PasswordInput: React.FC<PasswordProps> = (props) => {
  return <AntInput.Password {...props} />;
};

export const SearchInput: React.FC<SearchProps> = (props) => {
  return <AntInput.Search allowClear {...props} />;
};

export const TextArea: React.FC<TextAreaProps> = (props) => {
  return <AntInput.TextArea autoSize {...props} />;
};


