"use client";
import React, { useState } from "react";
import { Table2, type TableColumn } from "@/shared/ui/core/Table2";
import { Button } from "@/shared/ui/core/Button";
import { Pagination } from "@/shared/ui/core/Pagination";

// Types
export interface TransactionData {
  id: string;
  userName: string;
  packageName: string;
  amount: number;
  paymentMethod: string;
  transactionDate: string;
  status: 'success' | 'failed' | 'pending';
  key: string;
}

interface TransactionTableProps {
  transactions?: TransactionData[];
  loading?: boolean;
  onViewDetails?: (transaction: TransactionData) => void;
  className?: string;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions = [],
  loading = false,
  onViewDetails,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Default sample data for demonstration
  const defaultTransactions: TransactionData[] = [
    {
      id: "1",
      key: "1",
      userName: "Jane Cooper",
      packageName: "Pro (6 tháng)",
      amount: 499000,
      paymentMethod: "Thẻ visa",
      transactionDate: "01/09/2025",
      status: "success",
    },
    {
      id: "2",
      key: "2",
      userName: "Kathryn Murphy",
      packageName: "Basic (1 tháng)",
      amount: 499000,
      paymentMethod: "Momo",
      transactionDate: "01/09/2025",
      status: "success",
    },
    {
      id: "3",
      key: "3",
      userName: "Albert Flores",
      packageName: "Premium (12 tháng)",
      amount: 499000,
      paymentMethod: "Zalopay",
      transactionDate: "15/09/2025",
      status: "failed",
    },
    {
      id: "4",
      key: "4",
      userName: "Devon Lane",
      packageName: "Starter (2 tuần)",
      amount: 49000,
      paymentMethod: "Thẻ visa",
      transactionDate: "02/10/2025",
      status: "success",
    },
    {
      id: "5",
      key: "5",
      userName: "Marvin McKinney",
      packageName: "Advanced (3 tháng)",
      amount: 299000,
      paymentMethod: "Momo",
      transactionDate: "05/10/2025",
      status: "pending",
    },
    {
      id: "6",
      key: "6",
      userName: "Cameron Williamson",
      packageName: "Enterprise (24 tháng)",
      amount: 1599000,
      paymentMethod: "Zalopay",
      transactionDate: "10/10/2025",
      status: "success",
    },
    {
      id: "7",
      key: "7",
      userName: "Brooklyn Simmons",
      packageName: "Trial (7 ngày)",
      amount: 0,
      paymentMethod: "Miễn phí",
      transactionDate: "01/11/2025",
      status: "success",
    },
    {
      id: "8",
      key: "8",
      userName: "Savannah Nguyen",
      packageName: "Professional (18 tháng)",
      amount: 1199000,
      paymentMethod: "Thẻ visa",
      transactionDate: "15/11/2025",
      status: "failed",
    },
  ];

  const dataSource = transactions.length > 0 ? transactions : defaultTransactions;

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

  // Format price with VND currency
  const formatPrice = (amount: number): string => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  // Get status badge
// Get status badge
const getStatusBadge = (status: string) => {
  const statusConfig = {
    success: { 
      bgColor: 'bg-green-100 dark:bg-green-900/30', 
      textColor: 'text-green-800 dark:text-green-200',
      dotColor: 'bg-green-500',
      text: 'Thành công' 
    },
    failed: { 
      bgColor: 'bg-red-100 dark:bg-red-900/30', 
      textColor: 'text-red-800 dark:text-red-200',
      dotColor: 'bg-red-500',
      text: 'Thất bại' 
    },
    pending: { 
      bgColor: 'bg-orange-100 dark:bg-orange-900/30', 
      textColor: 'text-orange-800 dark:text-orange-200',
      dotColor: 'bg-orange-500',
      text: 'Đang xử lý' 
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
};

  // Table columns configuration
  const columns: TableColumn<TransactionData>[] = [
    {
      title: 'Người dùng',
      dataIndex: 'userName',
      key: 'userName',
      align: 'left',
      render: (text: string, record: TransactionData) => (
        <div className="font-medium text-left">{record.userName}</div>
      ),
    },
    {
      title: 'Gói đăng ký',
      dataIndex: 'packageName',
      key: 'packageName',
      align: 'left',
      render: (text: string, record: TransactionData) => (
        <div className="text-left">{record.packageName}</div>
      ),
    },
    {
      title: 'Số tiền (VND)',
      dataIndex: 'amount',
      key: 'amount',
      align: 'center',
      render: (amount: number) => (
        <div className="text-center font-medium">
          {formatPrice(amount)}
        </div>
      ),
      sorter: (a: TransactionData, b: TransactionData) => a.amount - b.amount,
    },
    {
      title: 'Phương thức',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
      align: 'center',
      render: (method: string, record: TransactionData) => (
        <div className="text-center">{record.paymentMethod}</div>
      ),
    },
    {
      title: 'Ngày giao dịch',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      align: 'center',
      render: (date: string, record: TransactionData) => (
        <div className="text-center">{record.transactionDate}</div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string) => (
        <div className="flex justify-center">
          {getStatusBadge(status)}
        </div>
      ),
      filters: [
        { text: 'Thành công', value: 'success' },
        { text: 'Thất bại', value: 'failed' },
        { text: 'Đang xử lý', value: 'pending' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record: TransactionData) => (
        <div className="flex justify-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(record)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
          >
            Chi tiết
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={`transaction-table-container ${className}`}>
      <Table2<TransactionData>
        columns={columns}
        dataSource={currentData}
        loading={loading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 800 }}
        className="transaction-table"
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

export default TransactionTable;