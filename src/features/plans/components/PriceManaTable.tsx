"use client";
import React, { useState } from "react";
import { Table2, type TableColumn } from "@/shared/ui/core/Table2";
import { Button } from "@/shared/ui/core/Button";
import { Pagination } from "@/shared/ui/core/Pagination";
import { DiscountTemplate } from "@/types/discount";

// Types - keeping for backward compatibility but using DiscountTemplate
export type PriceData = DiscountTemplate;

interface PriceManaTableProps {
  priceData?: DiscountTemplate[];
  loading?: boolean;
  onEdit?: (discount: DiscountTemplate) => void;
  onDelete?: (discount: DiscountTemplate) => void;
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
  const [pageSize] = useState(10);

  const dataSource = priceData;

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

  // Format discount value
  const formatDiscountValue = (type: string, value: number): string => {
    if (type === "Percentage") {
      return `${value}%`;
    }
    return new Intl.NumberFormat('vi-VN').format(value) + " VND";
  };

  // Format trigger name
  const formatTrigger = (trigger: string): string => {
    const triggerMap: Record<string, string> = {
      "Birthday": "Sinh nhật",
      "CompletionPercent": "Hoàn thành %",
      "FirstPurchase": "Mua lần đầu",
      "StreakCheckpoint": "Chuỗi checkpoint"
    };
    return triggerMap[trigger] || trigger;
  };

  // Table columns configuration
  const columns: TableColumn<DiscountTemplate>[] = [
    {
      title: 'Tên khuyến mãi',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (text: string, record: DiscountTemplate) => (
        <div className="font-medium text-left">
          <div>{record.name}</div>
          {record.description && (
            <div className="text-sm text-gray-500 mt-1">{record.description}</div>
          )}
        </div>
      ),
    },
    {
      title: 'Kích hoạt',
      dataIndex: 'trigger',
      key: 'trigger',
      align: 'center',
      render: (trigger: string) => (
        <div className="text-center">
          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
            {formatTrigger(trigger)}
          </span>
        </div>
      ),
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      align: 'center',
      render: (type: string) => (
        <div className="text-center">
          {type === "Percentage" ? "Phần trăm" : "Số tiền cố định"}
        </div>
      ),
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      align: 'center',
      render: (value: number, record: DiscountTemplate) => (
        <div className="text-center font-medium text-green-600">
          {formatDiscountValue(record.type, value)}
        </div>
      ),
      sorter: (a: DiscountTemplate, b: DiscountTemplate) => a.value - b.value,
    },
    {
      title: 'Số lần sử dụng',
      dataIndex: 'timesTriggered',
      key: 'timesTriggered',
      align: 'center',
      render: (times: number) => (
        <div className="text-center">
          {times}
        </div>
      ),
      sorter: (a: DiscountTemplate, b: DiscountTemplate) => a.timesTriggered - b.timesTriggered,
    },
    {
      title: 'Tổng giảm giá',
      dataIndex: 'totalDiscountGiven',
      key: 'totalDiscountGiven',
      align: 'center',
      render: (total: number) => (
        <div className="text-center font-medium">
          {new Intl.NumberFormat('vi-VN').format(total)} VND
        </div>
      ),
      sorter: (a: DiscountTemplate, b: DiscountTemplate) => a.totalDiscountGiven - b.totalDiscountGiven,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      render: (isActive: boolean) => (
        <div className="text-center">
          <span className={`px-2 py-1 rounded text-sm ${
            isActive 
              ? 'bg-green-100 text-green-700' 
              : 'bg-gray-100 text-gray-700'
          }`}>
            {isActive ? 'Hoạt động' : 'Tắt'}
          </span>
        </div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record: DiscountTemplate) => (
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
      <Table2<DiscountTemplate>
        columns={columns}
        dataSource={currentData}
        loading={loading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 1200 }}
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