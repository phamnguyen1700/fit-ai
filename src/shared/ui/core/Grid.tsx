import React from 'react';
import {
  Row as AntRow,
  Col as AntCol,
  Grid as AntGrid,
  type RowProps as AntRowProps,
  type ColProps as AntColProps,
} from 'antd';

export type RowProps = AntRowProps;
export type ColProps = AntColProps;

export const Row: React.FC<RowProps> = (props) => <AntRow {...props} />;
export const Col: React.FC<ColProps> = (props) => <AntCol {...props} />;

export const useBreakpoint = AntGrid.useBreakpoint;

export default { Row, Col, useBreakpoint };


