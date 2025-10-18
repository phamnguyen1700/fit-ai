"use client";
import React from 'react';
import FeedbackCard from './FeedbackCard';

interface FeedbackItem {
  id: string;
  userAvatar?: string;
  userName: string;
  date: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface FeedbackCardsProps {
  feedbacks?: FeedbackItem[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onDelete?: (id: string) => void;
  className?: string;
}

const FeedbackCards: React.FC<FeedbackCardsProps> = ({
  feedbacks = [],
  onApprove,
  onReject,
  onDelete,
  className = ""
}) => {
  // Mock data nếu không có data được truyền vào
  const mockFeedbacks: FeedbackItem[] = [
    {
      id: "1",
      userAvatar: "",
      userName: "Cameron Williamson",
      date: "09/09/2025",
      rating: 5.0,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "pending"
    },
    {
      id: "2", 
      userAvatar: "",
      userName: "Cameron Williamson",
      date: "09/09/2025",
      rating: 5.0,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "approved"
    },
    {
      id: "3",
      userAvatar: "",
      userName: "Cameron Williamson", 
      date: "09/09/2025",
      rating: 5.0,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "rejected"
    },
    {
      id: "4",
      userAvatar: "",
      userName: "Cameron Williamson",
      date: "09/09/2025", 
      rating: 5.0,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "approved"
    },
    {
      id: "5",
      userAvatar: "",
      userName: "Cameron Williamson",
      date: "09/09/2025",
      rating: 5.0,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "pending"
    },
    {
      id: "6",
      userAvatar: "",
      userName: "Cameron Williamson",
      date: "09/09/2025",
      rating: 5.0,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "approved"
    },
    {
      id: "7",
      userAvatar: "",
      userName: "Cameron Williamson",
      date: "09/09/2025",
      rating: 5.0,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "rejected"
    },
    {
      id: "8",
      userAvatar: "",
      userName: "Cameron Williamson",
      date: "09/09/2025",
      rating: 5.0,
      content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      status: "approved"
    }
  ];

  const displayFeedbacks = feedbacks.length > 0 ? feedbacks : mockFeedbacks;

  const handleApprove = (id: string) => {
    console.log("Approve feedback:", id);
    onApprove?.(id);
  };

  const handleReject = (id: string) => {
    console.log("Reject feedback:", id);
    onReject?.(id);
  };

  const handleDelete = (id: string) => {
    console.log("Delete feedback:", id);
    onDelete?.(id);
  };

  return (
    <div className={`feedback-cards-container ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayFeedbacks.map((feedback) => (
          <FeedbackCard
            key={feedback.id}
            id={feedback.id}
            userAvatar={feedback.userAvatar}
            userName={feedback.userName}
            date={feedback.date}
            rating={feedback.rating}
            content={feedback.content}
            status={feedback.status}
            onApprove={handleApprove}
            onReject={handleReject}
            onDelete={handleDelete}
            className="h-fit"
          />
        ))}
      </div>

      {displayFeedbacks.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Không có phản hồi nào</p>
        </div>
      )}
    </div>
  );
};

export default FeedbackCards;