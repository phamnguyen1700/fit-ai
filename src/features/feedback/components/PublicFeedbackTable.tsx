"use client";
import React, { useState, useMemo } from 'react';
import { Table2, TableColumn } from '@/shared/ui/core/Table2';
import { Button } from '@/shared/ui/core/Button';
import { Pagination } from '@/shared/ui/core/Pagination';
import { StarFilled } from "@ant-design/icons";

// Interface cho dữ liệu feedback
interface PublicFeedbackData {
  key: string;
  user: string;
  date: string;
  rating: number;
  content: string;
  actions: string;
}

// Props cho component
interface PublicFeedbackTableProps {
  className?: string;
  onEdit?: (record: PublicFeedbackData) => void;
  onDelete?: (record: PublicFeedbackData) => void;
}

// Mock data - sẽ được thay thế bằng API calls
const mockData: PublicFeedbackData[] = [
  {
    key: '1',
    user: 'Kathryn Murphy',
    date: 'February 29, 2012',
    rating: 5.0,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '2',
    user: 'Cody Fisher',
    date: 'July 14, 2015',
    rating: 4.5,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '3',
    user: 'Floyd Miles',
    date: 'May 12, 2019',
    rating: 4.5,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '4',
    user: 'Ronald Richards',
    date: 'April 28, 2016',
    rating: 4.5,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '5',
    user: 'Ronald Richards',
    date: 'May 9, 2014',
    rating: 5.0,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '6',
    user: 'Albert Flores',
    date: 'February 29, 2012',
    rating: 5.0,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '7',
    user: 'Cameron Williamson',
    date: 'November 28, 2015',
    rating: 4.5,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '8',
    user: 'Kristin Watson',
    date: 'May 6, 2012',
    rating: 3.5,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '9',
    user: 'Jenny Wilson',
    date: 'December 19, 2013',
    rating: 3.0,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '10',
    user: 'Robert Fox',
    date: 'March 6, 2018',
    rating: 4.0,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  // Thêm dữ liệu để test pagination
  {
    key: '11',
    user: 'Alice Johnson',
    date: 'January 15, 2020',
    rating: 4.8,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
  {
    key: '12',
    user: 'Bob Smith',
    date: 'June 22, 2021',
    rating: 3.2,
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
    actions: ''
  },
];

const PublicFeedbackTable: React.FC<PublicFeedbackTableProps> = ({
  className = '',
  onEdit,
  onDelete,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate pagination data
  const totalItems = mockData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return mockData.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle actions
  const handleHide = (record: PublicFeedbackData) => {
    console.log('Hide feedback:', record);
    // Implement hide logic
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

  return (
    <div className={className}>
      <div className="public-feedback-table">
        <Table2<PublicFeedbackData>
          columns={columns}
          dataSource={currentData}
          pagination={false}
          bordered={false}
          size="middle"
          className="public-feedback-table"
          rowKey="key"
        />
      </div>
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
    </div>
  );
};

export default PublicFeedbackTable;