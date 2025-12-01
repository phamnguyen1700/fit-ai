'use client';

import React, { useState, useMemo } from 'react';
import { Table2, type TableColumn } from '@/shared/ui/core/Table2';
import { Button } from '@/shared/ui/core/Button';
import { Pagination } from '@/shared/ui/core/Pagination';
import { Icon } from '@/shared/ui/icon';
import { useGetPolicies } from '@/tanstack/hooks/policy';
import type { Policy } from '@/types/policy';

export interface PolicyTableProps {
  onEdit?: (policy: Policy) => void;
  onDelete?: (policy: Policy) => void;
}

const formatDate = (value?: string | null) => {
  if (!value) return 'Chưa cập nhật';
  try {
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return value;
    }
    return parsed.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return value;
  }
};

const truncateContent = (content: string, maxLength: number = 100) => {
  if (!content) return '';
  if (content.length <= maxLength) return content;
  return content.substring(0, maxLength) + '...';
};

export const PolicyTable: React.FC<PolicyTableProps> = ({
  onEdit,
  onDelete,
}) => {
  const [expandedContentIds, setExpandedContentIds] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(10);

  // Fetch policies from API
  const { data, isLoading, isError } = useGetPolicies();

  // Extract policies from API response
  const policies = useMemo(() => {
    if (!data?.data || !Array.isArray(data.data)) {
      return [];
    }
    return data.data as Policy[];
  }, [data?.data]);

  // Calculate pagination
  const totalItems = policies.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return policies.slice(startIndex, endIndex);
  }, [policies, currentPage, pageSize]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Reset expanded content when changing page
    setExpandedContentIds(new Set());
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setExpandedContentIds(new Set());
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      setExpandedContentIds(new Set());
    }
  };

  const handleToggleContent = (policyId: string) => {
    setExpandedContentIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(policyId)) {
        newSet.delete(policyId);
      } else {
        newSet.add(policyId);
      }
      return newSet;
    });
  };

  const columns: TableColumn<Policy>[] = [
    {
      title: 'Loại Policy',
      dataIndex: 'policyType',
      key: 'policyType',
      width: 150,
      align: 'left',
      render: (text: string) => (
        <div className="font-medium text-[var(--text)]">{text || 'N/A'}</div>
      ),
    },
    {
      title: 'Tiêu đề',
      dataIndex: 'title',
      key: 'title',
      width: 200,
      align: 'left',
      render: (text: string) => (
        <div className="font-semibold text-[var(--text)]">{text || 'N/A'}</div>
      ),
    },
    {
      title: 'Phiên bản',
      dataIndex: 'version',
      key: 'version',
      width: 120,
      align: 'center',
      render: (text: string) => (
        <div className="text-center">{text || 'N/A'}</div>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      width: 300,
      align: 'left',
      render: (content: string, record: Policy) => {
        const isExpanded = expandedContentIds.has(record.id);
        const truncated = truncateContent(content);
        const isLong = content && content.length > 100;
        const displayContent = isExpanded ? content : truncated;

        return (
          <div className="flex items-start gap-2">
            <div className="flex-1">
              <span className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                {displayContent}
              </span>
              {isLong && (
                <button
                  type="button"
                  onClick={() => handleToggleContent(record.id)}
                  className="ml-2 text-primary hover:text-primary/80 hover:underline text-sm font-medium transition-colors"
                >
                  {isExpanded ? 'thu gọn' : 'xem thêm'}
                </button>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 120,
      align: 'center',
      render: (isActive: boolean) => (
        <span
          className={`inline-flex min-w-[96px] items-center justify-center rounded-full px-3 py-1 text-xs font-medium ${
            isActive ? 'bg-[#52c41a] text-white' : 'bg-gray-200 text-gray-700'
          }`}
        >
          {isActive ? 'Hoạt động' : 'Không hoạt động'}
        </span>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'lastCreate',
      key: 'lastCreate',
      width: 180,
      align: 'center',
      render: (date: string) => (
        <div className="text-center text-sm text-[var(--text-secondary)]">{formatDate(date)}</div>
      ),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'lastUpdate',
      key: 'lastUpdate',
      width: 180,
      align: 'center',
      render: (date: string) => (
        <div className="text-center text-sm text-[var(--text-secondary)]">{formatDate(date)}</div>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 180,
      align: 'center',
      fixed: 'right',
      render: (_: unknown, record: Policy) => (
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit?.(record)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all duration-200 shadow-sm hover:shadow-md"
            style={{
              minWidth: '70px',
              backgroundColor: 'var(--primary-light)',
              borderColor: 'var(--primary)',
              color: 'var(--text-inverse)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--primary-light)';
            }}
          >
            <Icon name="mdi:pencil-outline" size={16} />
            <span>Sửa</span>
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete?.(record)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
            style={{
              minWidth: '70px',
            }}
          >
            <Icon name="mdi:delete-outline" size={16} />
            <span>Xóa</span>
          </Button>
        </div>
      ),
    },
  ];

  // Handle error state
  if (isError) {
    return (
      <div className="policy-table-wrapper">
        <div className="py-12 text-center text-sm text-[var(--error)]">
          Không thể tải danh sách policy. Vui lòng thử lại sau.
        </div>
      </div>
    );
  }

  // Handle empty state
  if (!isLoading && policies.length === 0) {
    return (
      <div className="policy-table-wrapper">
        <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
          Không có policy nào.
        </div>
      </div>
    );
  }

  return (
    <div className="policy-table-wrapper">
      <Table2<Policy>
        columns={columns}
        dataSource={currentData}
        loading={isLoading}
        pagination={false}
        bordered={false}
        size="middle"
        scroll={{ x: 1200 }}
        className="policy-table"
        rowKey="id"
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
            className="policy-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default PolicyTable;

