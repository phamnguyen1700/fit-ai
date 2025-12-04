"use client";
import React, { useState, useMemo } from 'react';
import { Table2, TableColumn } from '@/shared/ui/core/Table2';
import { Button } from '@/shared/ui/core/Button';
import { Pagination } from '@/shared/ui/core/Pagination';
import { StarFilled } from "@ant-design/icons";
import { useFeedbackList, useTogglePublicFeedback } from '@/tanstack/hooks/feedback';
import type { FeedbackItem } from '@/types/feedback';
import { App } from 'antd';

// Interface cho dữ liệu feedback
interface PublicFeedbackData {
  key: string;
  id: string;
  user: string;
  date: string;
  rating: number;
  content: string;
  actions: string;
}

const formatDate = (value?: string): string => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

const mapApiItemToTableData = (item: FeedbackItem, index: number): PublicFeedbackData => {
  const name =
    item.userName ??
    (item as { userFullName?: string }).userFullName ??
    (item as { userEmail?: string }).userEmail ??
    'Người dùng ẩn danh';

  const content =
    (item.content as string) ??
    (item as { feedback?: string }).feedback ??
    'Không có nội dung.';

  return {
    key: item.id ?? `feedback-${index}`,
    id: item.id ?? `feedback-${index}`,
    user: name,
    date: formatDate((item as { lastCreate?: string }).lastCreate ?? item.createdAt),
    rating:
      typeof item.rating === 'number' && !Number.isNaN(item.rating) ? item.rating : 0,
    content,
    actions: '',
  };
};

// Props cho component
interface PublicFeedbackTableProps {
  className?: string;
  onEdit?: (record: PublicFeedbackData) => void;
  onDelete?: (record: PublicFeedbackData) => void;
}

const PublicFeedbackTable: React.FC<PublicFeedbackTableProps> = ({
  className = '',
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  // Fetch feedback với state = 4 (published/public)
  const { data, isLoading, isError } = useFeedbackList({
    pageNumber: currentPage,
    pageSize,
    state: 3, // Chỉ lấy feedback có state = 4 (published)
  });

  // Map API data sang table data format
  const tableData = useMemo(() => {
    if (!data?.data?.items) return [];
    return data.data.items.map(mapApiItemToTableData);
  }, [data?.data?.items]);

  // Get pagination info from API
  const totalPages = data?.data?.totalPages ?? 0;

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const { modal } = App.useApp();
  const togglePublicFeedback = useTogglePublicFeedback();

  // Handle actions
  const handleHide = (record: PublicFeedbackData) => {
    modal.confirm({
      title: 'Xác nhận ẩn',
      content: `Bạn có chắc chắn muốn ẩn feedback từ "${record.user}"?`,
      okText: 'Ẩn',
      cancelText: 'Hủy',
      okButtonProps: {
        style: {
          backgroundColor: 'var(--primary)',
          borderColor: 'var(--primary)',
          color: 'white',
        },
      },
      onOk: () => {
        return new Promise<void>((resolve, reject) => {
          togglePublicFeedback.mutate(record.id, {
            onSuccess: () => {
              resolve();
            },
            onError: () => {
              reject();
            },
          });
        });
      },
      centered: true,
    });
  };

  const handleDeleteAction = (record: PublicFeedbackData) => {
    console.log('Delete feedback:', record);
    onDelete?.(record);
  };

  // Table columns configuration
  const columns: TableColumn<PublicFeedbackData>[] = [
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      width: 200,
      render: (text: string) => <div className="user-name">{text}</div>,
    },
    {
      title: 'Ngày gửi',
      dataIndex: 'date',
      key: 'date',
      width: 150,
      render: (text: string) => <div className="date-text">{text}</div>,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      width: 120,
      align: 'center',
      render: (rating: number) => (
        <div className="star-rating">
          <StarFilled className="star-icon" />
          <span className="rating-value">{rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (text: string) => <div className="content-text">{text}</div>,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 200,
      align: 'center',
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            variant="secondary"
            size="sm"
            className="action-button hide-btn"
            onClick={() => handleHide(record)}
            disabled={togglePublicFeedback.isPending}
            loading={togglePublicFeedback.isPending}
          >
            Ẩn
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="action-button delete-btn"
            onClick={() => handleDeleteAction(record)}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  // Handle loading state
  if (isLoading) {
    return (
      <div className={className}>
        <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
          Đang tải danh sách feedback công khai...
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className={className}>
        <div className="py-12 text-center text-sm text-[var(--error)]">
          Không thể tải danh sách feedback. Vui lòng thử lại sau.
        </div>
      </div>
    );
  }

  // Handle empty state
  if (tableData.length === 0) {
    return (
      <div className={className}>
        <div className="py-12 text-center text-sm text-[var(--text-secondary)]">
          Không có feedback công khai nào.
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="public-feedback-table">
        <Table2<PublicFeedbackData>
          columns={columns}
          dataSource={tableData}
          loading={isLoading}
          pagination={false}
          bordered={false}
          size="middle"
          className="public-feedback-table"
          rowKey="key"
        />
      </div>
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showPageNumbers={true}
            maxVisiblePages={5}
            className="custom-pagination"
          />
        </div>
      )}
    </div>
  );
};

export default PublicFeedbackTable;