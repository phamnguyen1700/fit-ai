"use client";
import React, { useState, useMemo } from "react";
import { Table2, type TableColumn } from "@/shared/ui/core/Table2";
import { Button } from "@/shared/ui/core/Button";
import { Rate } from "@/shared/ui/core/Rate";
import { Pagination } from "@/shared/ui/core/Pagination";
import { StarFilled } from "@ant-design/icons";

// Define the feedback data type
interface FeedbackData {
  key: string;
  user: string;
  date: string;
  rating: number;
  content: string;
  actions: string;
}

// Mock data based on the image
const mockFeedbackData: FeedbackData[] = [
  {
    key: "1",
    user: "Kathryn Murphy",
    date: "February 29, 2012",
    rating: 5.0,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "2",
    user: "Cody Fisher",
    date: "July 14, 2015",
    rating: 4.5,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "3",
    user: "Floyd Miles",
    date: "May 12, 2019",
    rating: 4.5,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "4",
    user: "Ronald Richards",
    date: "April 28, 2016",
    rating: 4.5,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "5",
    user: "Ronald Richards",
    date: "May 9, 2014",
    rating: 5.0,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "6",
    user: "Albert Flores",
    date: "February 29, 2012",
    rating: 5.0,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "7",
    user: "Cameron Williamson",
    date: "November 28, 2015",
    rating: 4.5,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "8",
    user: "Kristin Watson",
    date: "May 6, 2012",
    rating: 3.5,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "9",
    user: "Jenny Wilson",
    date: "December 19, 2013",
    rating: 3.0,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "10",
    user: "Robert Fox",
    date: "March 6, 2018",
    rating: 4.0,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  // Add more data to test pagination
  {
    key: "11",
    user: "John Doe",
    date: "January 15, 2020",
    rating: 4.5,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "12",
    user: "Jane Smith",
    date: "March 20, 2021",
    rating: 5.0,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "13",
    user: "Mike Johnson",
    date: "June 10, 2022",
    rating: 3.5,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "14",
    user: "Sarah Wilson",
    date: "August 5, 2023",
    rating: 4.0,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
  {
    key: "15",
    user: "Tom Brown",
    date: "October 12, 2024",
    rating: 5.0,
    content: "Lorem ipsum dolor sit amet, c...",
    actions: "",
  },
];

const ReviewFeedbackTable: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate pagination data
  const totalItems = mockFeedbackData.length;
  const totalPages = Math.ceil(totalItems / pageSize);

  // Get current page data
  const currentData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return mockFeedbackData.slice(startIndex, endIndex);
  }, [currentPage, pageSize]);

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Define table columns
  const columns: TableColumn<FeedbackData>[] = [
    {
      title: "Người dùng",
      dataIndex: "user",
      key: "user",
      width: 200,
      render: (text: string) => <div className="user-name">{text}</div>,
    },
    {
      title: "Ngày gửi",
      dataIndex: "date",
      key: "date",
      width: 150,
      render: (text: string) => <div className="date-text">{text}</div>,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      width: 120,
      align: "center",
      render: (rating: number) => (
        <div className="star-rating">
          <StarFilled className="star-icon" />
          <span className="rating-value">{rating.toFixed(1)}</span>
        </div>
      ),
    },
    {
      title: "Nội dung",
      dataIndex: "content",
      key: "content",
      ellipsis: true,
      render: (text: string) => <div className="content-text">{text}</div>,
    },
    {
      title: "Hành động",
      key: "actions",
      width: 200,
      align: "center",
      render: (_, record) => (
        <div className="action-buttons">
          <Button
            variant="secondary"
            size="sm"
            className="action-button approve-btn"
          >
            Duyệt
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="action-button reject-btn"
          >
            Từ chối
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="review-feedback-table">
        <Table2<FeedbackData>
          columns={columns}
          dataSource={currentData}
          pagination={false}
          bordered={false}
          size="middle"
          className="review-feedback-table"
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

export default ReviewFeedbackTable;
