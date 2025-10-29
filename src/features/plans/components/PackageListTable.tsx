"use client";
import React, { useState } from "react";
import { Table2, type TableColumn } from "@/shared/ui/core/Table2";
import { Badge } from "@/shared/ui/core/Badge";
import { Button } from "@/shared/ui/core/Button";
import { Pagination } from "@/shared/ui/core/Pagination";
import Dropdown from "@/features/content/components/Dropdown";

// Types
export interface PackageData {
  id: string;
  name: string;
  duration: string;
  price: number;
  status: 'active' | 'inactive' | 'suspended';
  key: string;
}

interface PackageListTableProps {
  packages?: PackageData[];
  loading?: boolean;
  onEdit?: (packageData: PackageData) => void;
  onDelete?: (packageData: PackageData) => void;
  onStatusChange?: (packageData: PackageData, newStatus: string) => void;
  className?: string;
}

const PackageListTable: React.FC<PackageListTableProps> = ({
  packages = [],
  loading = false,
  onEdit,
  onDelete,
  onStatusChange,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Default sample data for demonstration
  const defaultPackages: PackageData[] = [
    {
      id: "1",
      key: "1",
      name: "Gói Basic",
      duration: "1 tháng",
      price: 99000,
      status: "active",
    },
    {
      id: "2", 
      key: "2",
      name: "Gói Pro",
      duration: "6 tháng",
      price: 499000,
      status: "active",
    },
    {
      id: "3",
      key: "3", 
      name: "Gói Premium",
      duration: "12 tháng",
      price: 899000,
      status: "suspended",
    },
    {
      id: "4",
      key: "4",
      name: "Gói Starter",
      duration: "2 tuần",
      price: 49000,
      status: "active",
    },
    {
      id: "5",
      key: "5",
      name: "Gói Advanced",
      duration: "3 tháng",
      price: 299000,
      status: "active",
    },
    {
      id: "6",
      key: "6",
      name: "Gói Enterprise",
      duration: "24 tháng",
      price: 1599000,
      status: "inactive",
    },
    {
      id: "7",
      key: "7",
      name: "Gói Trial",
      duration: "7 ngày",
      price: 0,
      status: "active",
    },
    {
      id: "8",
      key: "8",
      name: "Gói Professional",
      duration: "18 tháng",
      price: 1199000,
      status: "active",
    },
    {
      id: "9",
      key: "9",
      name: "Gói Student",
      duration: "4 tháng",
      price: 199000,
      status: "active",
    },
    {
      id: "10",
      key: "10",
      name: "Gói VIP",
      duration: "36 tháng",
      price: 2199000,
      status: "suspended",
    },
    {
      id: "11",
      key: "11",
      name: "Gói Family",
      duration: "12 tháng",
      price: 999000,
      status: "active",
    },
    {
      id: "12",
      key: "12",
      name: "Gói Corporate",
      duration: "24 tháng",
      price: 1799000,
      status: "inactive",
    },
  ];

  const dataSource = packages.length > 0 ? packages : defaultPackages;

  // Pagination logic
  const totalPages = Math.ceil(dataSource.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = dataSource.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageSizeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newPageSize = parseInt(event.target.value);
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  // Format price with VND currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

// Get status badge color and text
const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { 
      bgColor: 'bg-green-100 dark:bg-green-900/30', 
      textColor: 'text-green-800 dark:text-green-200',
      dotColor: 'bg-green-500',
      text: 'Đang bán' 
    },
    inactive: { 
      bgColor: 'bg-gray-100 dark:bg-gray-800', 
      textColor: 'text-gray-800 dark:text-gray-200',
      dotColor: 'bg-gray-500',
      text: 'Ngưng bán' 
    },
    suspended: { 
      bgColor: 'bg-orange-100 dark:bg-orange-900/30', 
      textColor: 'text-orange-800 dark:text-orange-200',
      dotColor: 'bg-orange-500',
      text: 'Tạm dừng' 
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
};

  // Handle status change from dropdown
  const handleStatusChange = (packageData: PackageData, newStatus: string) => {
    onStatusChange?.(packageData, newStatus);
  };

  // Status dropdown options
  const getStatusDropdownOptions = (currentStatus: string) => [
    {
      key: 'active',
      label: 'Đang bán',
      isActive: currentStatus === 'active'
    },
    {
      key: 'inactive', 
      label: 'Ngưng bán',
      isActive: currentStatus === 'inactive'
    },
    {
      key: 'suspended',
      label: 'Tạm dừng',
      isActive: currentStatus === 'suspended'
    },
  ];

  // Table columns configuration
  const columns: TableColumn<PackageData>[] = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (text: string, record: PackageData) => (
        <div className="font-medium text-left">{record.name}</div>
      ),
    },
    {
      title: 'Thời hạn',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
      render: (text: string, record: PackageData) => (
        <div className="text-center">{record.duration}</div>
      ),
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: number, record: PackageData) => (
        <div className="text-center font-medium">
          {formatPrice(price)}
        </div>
      ),
      sorter: (a: PackageData, b: PackageData) => a.price - b.price,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string, record: PackageData) => (
        <div className="flex justify-center">
          <Dropdown
            trigger={getStatusBadge(status)}
            options={getStatusDropdownOptions(status)}
            onSelect={(option) => handleStatusChange(record, option.key)}
            className="cursor-pointer"
          />
        </div>
      ),
      filters: [
        { text: 'Đang bán', value: 'active' },
        { text: 'Ngưng bán', value: 'inactive' },
        { text: 'Tạm dừng', value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record: PackageData) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit?.(record)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
          >
            Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete?.(record)}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={`package-list-table-container ${className}`}>
      <Table2<PackageData>
        columns={columns}
        dataSource={currentData}
        loading={loading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 800 }}
        className="package-list-table"
      />
      
      {/* Custom Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
            showPageNumbers={true}
            maxVisiblePages={5}
            className="custom-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default PackageListTable;