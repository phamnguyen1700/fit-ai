"use client";

import React from 'react';
import { Table as AntTable, Pagination } from 'antd';
import type { TableProps as AntTableProps } from 'antd';

// Types
export interface Column<T> {
  colName: string;
  render: (record: T) => React.ReactNode;
  key?: string;
  width?: number | string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  records: T[];
  onRowClick?: (record: T) => void;
  pagination?: {
    current: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize?: number) => void;
    showSizeChanger?: boolean;
    showTotal?: (total: number, range: [number, number]) => string;
  };
  loading?: boolean;
  rowKey?: string | ((record: T) => string);
  className?: string;
  size?: 'small' | 'middle' | 'large';
  // Mobile card props
  mobileCardRender?: (record: T) => React.ReactNode;
  showMobileCards?: boolean;
}

export const Table = <T extends Record<string, any>>({
  columns,
  records,
  onRowClick,
  pagination,
  loading = false,
  rowKey = 'id',
  className = '',
  size = 'middle',
  mobileCardRender,
  showMobileCards = true,
}: TableProps<T>) => {
  // Ensure records is always an array
  const safeRecords = records || [];
  // Transform columns to Ant Design format
  const antColumns = columns.map((col, index) => ({
    title: col.colName,
    dataIndex: col.key || `col_${index}`,
    key: col.key || `col_${index}`,
    width: col.width,
    align: col.align || 'center',
    render: (value: any, record: T, index: number) => {
      // Ensure record exists before calling render function
      if (!record) return null;
      return col.render(record);
    },
  }));

  // Mobile pagination component
  const MobilePagination = () => {
    if (!pagination || pagination.total <= 0) return null;
    
    const totalPages = Math.ceil(pagination.total / pagination.pageSize);
    
    return (
      <div className="mobile-pagination mb-2 flex justify-center">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => pagination.onChange(Math.max(1, pagination.current - 1))}
            disabled={pagination.current === 1}
            className="px-2 py-1 border border-var(--text-secondary) rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ←
          </button>
          
          <span className="px-4 py-1 text-sm text-gray-600">
            {pagination.current} / {totalPages}
          </span>
          
          <button
            onClick={() => pagination.onChange(Math.min(totalPages, pagination.current + 1))}
            disabled={pagination.current === totalPages}
            className="px-2 py-1 border border-var(--text-secondary) rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={`custom-table-wrapper ${className}`}>
      {/* Desktop Table */}
      <div className="hidden md:block">
        <AntTable
          columns={antColumns}
          dataSource={safeRecords}
          loading={loading}
          rowKey={rowKey}
          size={size}
          pagination={false} // We'll handle pagination separately
          className="custom-table"
          rowClassName="custom-table-row"
          onRow={(record) => ({
            onClick: onRowClick ? () => onRowClick(record) : undefined,
            style: onRowClick ? { cursor: 'pointer' } : undefined,
          })}
        />
        
        {/* Desktop Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="custom-pagination-wrapper">
            <Pagination
              current={pagination.current}
              pageSize={pagination.pageSize}
              total={pagination.total}
              onChange={pagination.onChange}
              showSizeChanger={pagination.showSizeChanger}
              showTotal={pagination.showTotal}
              className="custom-pagination"
            />
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      {showMobileCards && mobileCardRender && (
        <div className="md:hidden">
          <div className="space-y-3 px-5">
            {safeRecords.map((record, index) => (
              <div key={typeof rowKey === 'function' ? rowKey(record) : record[rowKey]}>
                {mobileCardRender(record)}
              </div>
            ))}
          </div>
          
          {/* Mobile Pagination */}
          <MobilePagination />
        </div>
      )}
    </div>
  );
};

export default Table;
