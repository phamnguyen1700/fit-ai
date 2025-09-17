import React from 'react';
import { Avatar as AntAvatar, type AvatarProps as AntAvatarProps } from 'antd';

export interface AvatarProps extends AntAvatarProps {
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ className, ...props }) => {
  return <AntAvatar {...props} className={(className ? className + ' ' : '') + 'themed-avatar'} />;
};

export default Avatar;


