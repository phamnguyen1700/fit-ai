import React from 'react';
import { Flex as AntFlex, type FlexProps as AntFlexProps } from 'antd';

export interface FlexProps extends AntFlexProps {
  className?: string;
}

export const Flex: React.FC<FlexProps> = (props) => {
  return <AntFlex {...props} />;
};

export default Flex;


