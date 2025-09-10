'use client';

import React from 'react';
import { Button } from '@/shared/ui/Button';
import { useUserUiStore } from '../store/userUi.store';

export const UserToolbar: React.FC = () => {
  const {
    searchTerm,
    sortBy,
    sortOrder,
    filterRole,
    filterStatus,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setFilterRole,
    setFilterStatus,
    resetFilters,
    openCreateModal,
  } = useUserUiStore();

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm người dùng..."
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
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as 'all' | 'admin' | 'user' | 'trainer')}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">Tất cả vai trò</option>
            <option value="admin">Quản trị viên</option>
            <option value="user">Người dùng</option>
            <option value="trainer">Huấn luyện viên</option>
          </select>

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
              setSortBy(field as 'name' | 'email' | 'role' | 'createdAt');
              setSortOrder(order as 'asc' | 'desc');
            }}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name-asc">Tên A-Z</option>
            <option value="name-desc">Tên Z-A</option>
            <option value="email-asc">Email A-Z</option>
            <option value="email-desc">Email Z-A</option>
            <option value="role-asc">Vai trò A-Z</option>
            <option value="role-desc">Vai trò Z-A</option>
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
            Thêm người dùng
          </Button>
        </div>
      </div>
    </div>
  );
};
