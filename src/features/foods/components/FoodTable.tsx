"use client";

import React from 'react';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { FoodItem } from '..';
import { Pagination } from '@/shared/ui/core/Pagination';

interface FoodTableProps {
  foods: FoodItem[];
  onDelete: (id: string) => void;
  loading?: boolean;
  page?: number;
  pageSize?: number;
  total?: number;
  onChangePage?: (page: number, pageSize: number) => void;
}

export const FoodTable: React.FC<FoodTableProps> = ({
  foods,
  onDelete,
  loading,
  page,
  pageSize,
  total,
  onChangePage,
}) => {
  const columns: ColumnsType<FoodItem> = [
    {
      title: 'Tên thực phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium" style={{ color: 'var(--text)' }}>
            {text}
          </span>
          {record.categoryName && (
            <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>
              Nhóm: {record.categoryName}
            </span>
          )}
        </div>
      ),
    },
    {
      title: 'Nhóm chất',
      dataIndex: 'categoryName',
      key: 'categoryName',
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weight',
      key: 'weight',
      render: (value) => (value != null ? <span>{value} g</span> : null),
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
      render: (value) => <span>{value} kcal</span>,
    },
    {
      title: 'Protein',
      dataIndex: 'protein',
      key: 'protein',
      render: (value) => <span>{value} g</span>,
    },
    {
      title: 'Carb',
      dataIndex: 'carbs',
      key: 'carbs',
      render: (value) => <span>{value} g</span>,
    },
    {
      title: 'Fat',
      dataIndex: 'fat',
      key: 'fat',
      render: (value) => <span>{value} g</span>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center gap-3">
          <button
            className="text-primary text-sm hover:underline"
            type="button"
            onClick={() => onDelete(record.id)}
          >
            Xoá
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="mt-4 space-y-4">
      <Table
        rowKey="id"
        dataSource={foods}
        columns={columns}
        loading={loading}
        pagination={false}
      />

      {total && total > 15 && onChangePage && page && pageSize && (
        <div className="flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={Math.ceil(total / pageSize)}
            onPageChange={(nextPage) => onChangePage(nextPage, pageSize)}
            className="mt-2"
          />
        </div>
      )}
    </div>
  );
};
