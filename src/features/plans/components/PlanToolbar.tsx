'use client';

import React from 'react';
import { Button } from '@/shared/ui/Button';
import { usePlanUiStore } from '../store/planUi.store';

export const PlanToolbar: React.FC = () => {
  const {
    searchTerm,
    sortBy,
    sortOrder,
    filterStatus,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setFilterStatus,
    resetFilters,
    openCreateModal,
  } = usePlanUiStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm gói tập..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'inactive')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hoạt động</option>
            <option value="inactive">Ngừng hoạt động</option>
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [field, order] = e.target.value.split('-');
              setSortBy(field as 'name' | 'price' | 'createdAt');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="price-asc">Giá thấp đến cao</option>
            <option value="price-desc">Giá cao đến thấp</option>
            <option value="createdAt-desc">Mới nhất</option>
            <option value="createdAt-asc">Cũ nhất</option>
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={resetFilters}
            className="whitespace-nowrap"
          >
            Đặt lại bộ lọc
          </Button>
          <Button
            onClick={openCreateModal}
            className="whitespace-nowrap"
          >
            Thêm gói tập
          </Button>
        </div>
      </div>
    </div>
  );
};
