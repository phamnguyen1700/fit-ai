"use client";
import React from 'react';
import { Table as AntTable, TableProps as AntTableProps } from 'antd';
import { ColumnsType } from 'antd/es/table';

import type { Key } from 'react';

export interface TableColumn<T = any> {
  title?: React.ReactNode;
  dataIndex?: string;
  key?: string;
  render?: (value: any, record: T, index: number) => React.ReactNode;
  width?: string | number;
  align?: 'left' | 'right' | 'center';
  sorter?: boolean | ((a: T, b: T) => number);
  filters?: { text: string; value: Key | boolean }[];
  onFilter?: (value: Key | boolean, record: T) => boolean;
  fixed?: 'left' | 'right';
  ellipsis?: boolean;
  responsive?: ('xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl')[];
}

export interface TableProps<T = any> extends Omit<AntTableProps<T>, 'columns'> {
  columns: TableColumn<T>[];
  dataSource: T[];
  loading?: boolean;
  bordered?: boolean;
  size?: 'large' | 'middle' | 'small';
  showHeader?: boolean;
  tableLayout?: 'auto' | 'fixed';
  scroll?: {
    x?: string | number | true;
    y?: string | number;
  };
  sticky?: boolean | {
    offsetHeader?: number;
    offsetScroll?: number;
    getContainer?: () => HTMLElement;
  };
  pagination?: false | {
    current?: number;
    total?: number;
    pageSize?: number;
    showSizeChanger?: boolean;
    showQuickJumper?: boolean;
    showTotal?: (total: number, range: [number, number]) => React.ReactNode;
    pageSizeOptions?: string[];
    position?: ('topLeft' | 'topCenter' | 'topRight' | 'bottomLeft' | 'bottomCenter' | 'bottomRight')[];
  };
  rowSelection?: {
    type?: 'checkbox' | 'radio';
    selectedRowKeys?: React.Key[];
    onChange?: (selectedRowKeys: React.Key[], selectedRows: T[]) => void;
    onSelect?: (record: T, selected: boolean, selectedRows: T[], nativeEvent: Event) => void;
    onSelectAll?: (selected: boolean, selectedRows: T[], changeRows: T[]) => void;
    getCheckboxProps?: (record: T) => { disabled?: boolean; name?: string };
  };
  expandable?: {
    expandedRowKeys?: readonly React.Key[];
    defaultExpandedRowKeys?: readonly React.Key[];
    defaultExpandAllRows?: boolean;
    expandedRowRender?: (record: T, index: number, indent: number, expanded: boolean) => React.ReactNode;
    expandIcon?: (props: any) => React.ReactNode;
    expandRowByClick?: boolean;
    onExpand?: (expanded: boolean, record: T) => void;
    onExpandedRowsChange?: (expandedKeys: readonly React.Key[]) => void;
  };
  onRow?: (record: T, index?: number) => {
    onClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onDoubleClick?: (event: React.MouseEvent<HTMLElement>) => void;
    onContextMenu?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
    onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
  };
  className?: string;
  style?: React.CSSProperties;
}

export const Table2 = <T extends Record<string, any> = any>({
  columns,
  dataSource,
  loading = false,
  bordered = false,
  size = 'middle',
  showHeader = true,
  tableLayout = 'auto',
  scroll,
  sticky,
  pagination = {
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mục`,
    pageSizeOptions: ['10', '20', '50', '100'],
  },
  rowSelection,
  expandable,
  onRow,
  className,
  style,
  ...restProps
}: TableProps<T>) => {
  // Convert our column format to Ant Design's format
  const antColumns: ColumnsType<T> = columns.map((col) => ({
    title: col.title,
    dataIndex: col.dataIndex,
    key: col.key || col.dataIndex,
    render: col.render,
    width: col.width,
    align: col.align,
    sorter: col.sorter,
    filters: col.filters,
    onFilter: col.onFilter,
    fixed: col.fixed,
    ellipsis: col.ellipsis,
    responsive: col.responsive,
  }));

  return (
    <div className={`table-wrapper ${className || ''}`} style={style}>
      <AntTable<T>
        columns={antColumns}
        dataSource={dataSource}
        loading={loading}
        bordered={bordered}
        size={size}
        showHeader={showHeader}
        tableLayout={tableLayout}
        scroll={scroll}
        sticky={sticky}
        pagination={pagination}
        rowSelection={rowSelection}
        expandable={expandable}
        onRow={onRow}
        className="custom-table"
        {...restProps}
      />
      </div>
);
};

//      
      // Export default for convenience
      export default Table2;
      
      // Export specific table utilities
    //   export type { TableColumn, TableProps };
      
      // Re-export useful Ant Design table types
      export type { ColumnsType, ColumnType } from 'antd/es/table';