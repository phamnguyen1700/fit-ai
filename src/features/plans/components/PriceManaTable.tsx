"use client";
import React, { useState } from "react";
import { Table2, type TableColumn } from "@/shared/ui/core/Table2";
import { Button } from "@/shared/ui/core/Button";
import { Pagination } from "@/shared/ui/core/Pagination";

// Types
export interface PriceData {
  id: string;
  name: string;
  originalPrice: number;
  discountPercent: number;
  finalPrice: number;
  applyDate: string;
  key: string;
}

interface PriceManaTableProps {
  priceData?: PriceData[];
  loading?: boolean;
  onEdit?: (priceData: PriceData) => void;
  onDelete?: (priceData: PriceData) => void;
  className?: string;
}

const PriceManaTable: React.FC<PriceManaTableProps> = ({
  priceData = [],
  loading = false,
  onEdit,
  onDelete,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Default sample data for demonstration
  const defaultPriceData: PriceData[] = [
    {
      id: "1",
      key: "1",
      name: "Basic",
      originalPrice: 99000,
      discountPercent: 0,
      finalPrice: 99000,
      applyDate: "01/09/2025",
    },
    {
      id: "2",
      key: "2",
      name: "Pro",
      originalPrice: 499000,
      discountPercent: 10,
      finalPrice: 449100,
      applyDate: "01/09/2025",
    },
    {
      id: "3",
      key: "3",
      name: "Premium",
      originalPrice: 899000,
      discountPercent: 20,
      finalPrice: 719200,
      applyDate: "15/09/2025",
    },
    {
      id: "4",
      key: "4",
      name: "Starter",
      originalPrice: 49000,
      discountPercent: 0,
      finalPrice: 49000,
      applyDate: "01/10/2025",
    },
    {
      id: "5",
      key: "5",
      name: "Advanced",
      originalPrice: 299000,
      discountPercent: 15,
      finalPrice: 254150,
      applyDate: "05/10/2025",
    },
    {
      id: "6",
      key: "6",
      name: "Enterprise",
      originalPrice: 1599000,
      discountPercent: 25,
      finalPrice: 1199250,
      applyDate: "10/10/2025",
    },
    {
      id: "7",
      key: "7",
      name: "Trial",
      originalPrice: 0,
      discountPercent: 0,
      finalPrice: 0,
      applyDate: "01/11/2025",
    },
    {
      id: "8",
      key: "8",
      name: "Professional",
      originalPrice: 1199000,
      discountPercent: 30,
      finalPrice: 839300,
      applyDate: "15/11/2025",
    },
    {
      id: "9",
      key: "9",
      name: "Enterprise",
      originalPrice: 1599000,
      discountPercent: 25,
      finalPrice: 1199250,
      applyDate: "10/10/2025",
    },
    {
      id: "10",
      key: "10",
      name: "Trial",
      originalPrice: 0,
      discountPercent: 0,
      finalPrice: 0,
      applyDate: "01/11/2025",
    },
    {
      id: "11",
      key: "11",
      name: "Professional",
      originalPrice: 1199000,
      discountPercent: 30,
      finalPrice: 839300,
      applyDate: "15/11/2025",
    },
  ];

  const dataSource = priceData.length > 0 ? priceData : defaultPriceData;

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
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  // Format discount percentage
  const formatDiscountPercent = (percent: number): string => {
    return `${percent}%`;
  };

  // Table columns configuration
  const columns: TableColumn<PriceData>[] = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (text: string, record: PriceData) => (
        <div className="font-medium text-left">{record.name}</div>
      ),
    },
    {
      title: 'Giá gốc (VND)',
      dataIndex: 'originalPrice',
      key: 'originalPrice',
      align: 'center',
      render: (price: number, record: PriceData) => (
        <div className="text-center font-medium">
          {formatPrice(price)}
        </div>
      ),
      sorter: (a: PriceData, b: PriceData) => a.originalPrice - b.originalPrice,
    },
    {
      title: 'Khuyến mãi (%)',
      dataIndex: 'discountPercent',
      key: 'discountPercent',
      align: 'center',
      render: (percent: number, record: PriceData) => (
        <div className="text-center">
          {formatDiscountPercent(percent)}
        </div>
      ),
      sorter: (a: PriceData, b: PriceData) => a.discountPercent - b.discountPercent,
    },
    {
      title: 'Giá áp dụng',
      dataIndex: 'finalPrice',
      key: 'finalPrice',
      align: 'center',
      render: (price: number, record: PriceData) => (
        <div className="text-center font-medium text-green-600">
          {formatPrice(price)}
        </div>
      ),
      sorter: (a: PriceData, b: PriceData) => a.finalPrice - b.finalPrice,
    },
    {
      title: 'Ngày áp dụng',
      dataIndex: 'applyDate',
      key: 'applyDate',
      align: 'center',
      render: (date: string, record: PriceData) => (
        <div className="text-center flex items-center justify-center gap-2">
          <span>{date}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-400">
            <polyline points="6,9 12,15 18,9"></polyline>
          </svg>
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record: PriceData) => (
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
    <div className={`price-mana-table-container ${className}`}>
      <Table2<PriceData>
        columns={columns}
        dataSource={currentData}
        loading={loading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 800 }}
        className="price-mana-table"
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

export default PriceManaTable;