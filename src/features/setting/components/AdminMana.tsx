"use client";
import React, { useState } from 'react';
import { Table2, TableColumn } from '../../../shared/ui/core/Table2';
import { Pagination } from '../../../shared/ui/core/Pagination';
import { Button } from '../../../shared/ui/core/Button';
import { Icon } from '@iconify/react';

interface AdminData {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  actions?: string;
}

interface AdminManaProps {
  className?: string;
}

const AdminMana: React.FC<AdminManaProps> = ({ className = "" }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Function to get status class for styling
  const getStatusClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đang bán':
      case 'active':
        return 'status-active';
      case 'tạm dừng':
        return 'status-paused';
      case 'ngưng bán':
        return 'status-stopped';
      case 'inactive':
        return 'status-inactive';
      default:
        return 'status-default';
    }
  };
  
  // Sample data từ hình ảnh
  const adminData: AdminData[] = [
    {
      id: 492,
      name: "Nguyen Van A",
      email: "a@email.com",
      role: "Admin", 
      status: "Active",
    },
    {
      id: 154,
      name: "Hoang Thi B",
      email: "b@email.com",
      role: "Admin",
      status: "Inactive",
    },
    {
      id: 154,
      name: "Le Van C",
      email: "c@email.com",
      role: "Admin",
      status: "Inactive",
    },
  ];

  const columns: TableColumn<AdminData>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      align: 'center',
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
      width: 200,
    },
    {
      title: 'Email',
      dataIndex: 'email', 
      key: 'email',
      width: 200,
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      align: 'center',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status', 
      width: 120,
      align: 'center',
      render: (status) => (
        <span className={`status-badge ${getStatusClass(status)}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      align: 'center',
      render: (_, record) => (
        <div className="admin-table-actions">
          <Button
            variant="ghost"
            size="sm"
            className="admin-action-btn edit-btn"
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="admin-action-btn delete-btn"
            onClick={() => handleDelete(record)}
          >
            Xoá
          </Button>
        </div>
      ),
    },
  ];

  const handleEdit = (record: AdminData) => {
    console.log('Edit admin:', record);
    // Add edit functionality here
  };

  const handleDelete = (record: AdminData) => {
    console.log('Delete admin:', record);
    // Add delete functionality here
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate pagination
  const totalItems = adminData.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const shouldShowPagination = totalItems > pageSize;
  
  // Get current page data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentPageData = adminData.slice(startIndex, endIndex);

  return (
    <div className={`admin-management-container ${className}`}>
      <div className="admin-table-wrapper">
        <Table2
          columns={columns}
          dataSource={currentPageData}
          rowKey="id"
          pagination={false}
          className="admin-management-table"
          bordered={false}
          size="middle"
        />
        
        {/* Custom Pagination - only show if more than pageSize items */}
        {shouldShowPagination && (
          <div className="admin-table-pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              className="admin-pagination"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminMana;