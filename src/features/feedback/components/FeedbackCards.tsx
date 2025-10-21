"use client";
import React, { useState, useMemo } from 'react';
import FeedbackCard from './FeedbackCard';
import { Pagination } from '../../../shared/ui/core/Pagination';

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
  itemsPerPage?: number;
  className?: string;
}

const FeedbackCards: React.FC<FeedbackCardsProps> = ({
  feedbacks = [],
  onApprove,
  onReject,
  onDelete,
  itemsPerPage = 10,
  className = ""
}) => {
  const [currentPage, setCurrentPage] = useState<number>(1);
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
      userName: "Sarah Johnson",
      date: "08/09/2025",
      rating: 4.5,
      content: "Excellent app! Very helpful for tracking my fitness goals and meal planning.",
      status: "approved"
    },
    {
      id: "3",
      userAvatar: "",
      userName: "Michael Chen", 
      date: "07/09/2025",
      rating: 3.0,
      content: "Good app but could use some improvements in the user interface.",
      status: "rejected"
    },
    {
      id: "4",
      userAvatar: "",
      userName: "Emily Davis",
      date: "06/09/2025", 
      rating: 4.8,
      content: "Love the workout tracking feature! Makes it easy to stay motivated.",
      status: "approved"
    },
    {
      id: "5",
      userAvatar: "",
      userName: "James Wilson",
      date: "05/09/2025",
      rating: 5.0,
      content: "Amazing fitness app! The nutrition tracking is incredibly detailed and helpful.",
      status: "pending"
    },
    {
      id: "6",
      userAvatar: "",
      userName: "Jessica Brown",
      date: "04/09/2025",
      rating: 4.2,
      content: "Great features overall. The meal planning section is particularly useful.",
      status: "approved"
    },
    {
      id: "7",
      userAvatar: "",
      userName: "David Miller",
      date: "03/09/2025",
      rating: 2.5,
      content: "App crashes sometimes and the sync with wearables needs improvement.",
      status: "rejected"
    },
    {
      id: "8",
      userAvatar: "",
      userName: "Lisa Anderson",
      date: "02/09/2025",
      rating: 4.7,
      content: "Fantastic app for fitness enthusiasts! The progress tracking is excellent.",
      status: "approved"
    },
    {
      id: "9",
      userAvatar: "",
      userName: "Robert Taylor",
      date: "01/09/2025",
      rating: 5.0,
      content: "Best fitness app I've used! The personalized workout plans are amazing.",
      status: "approved"
    },
    {
      id: "10",
      userAvatar: "",
      userName: "Amanda White",
      date: "31/08/2025",
      rating: 4.0,
      content: "Good app with useful features. The calorie tracking is very accurate.",
      status: "pending"
    },
    {
      id: "11",
      userAvatar: "",
      userName: "Kevin Martinez",
      date: "30/08/2025",
      rating: 3.8,
      content: "Decent app but the user interface could be more intuitive.",
      status: "approved"
    },
    {
      id: "12",
      userAvatar: "",
      userName: "Rachel Garcia",
      date: "29/08/2025",
      rating: 4.9,
      content: "Absolutely love this app! The community features are really motivating.",
      status: "approved"
    },
    {
      id: "13",
      userAvatar: "",
      userName: "Thomas Lopez",
      date: "28/08/2025",
      rating: 4.3,
      content: "Great workout suggestions and the nutrition database is comprehensive.",
      status: "pending"
    },
    {
      id: "14",
      userAvatar: "",
      userName: "Michelle Lee",
      date: "27/08/2025",
      rating: 5.0,
      content: "Perfect for tracking both workouts and meals. Highly recommended!",
      status: "approved"
    },
    {
      id: "15",
      userAvatar: "",
      userName: "Christopher Hill",
      date: "26/08/2025",
      rating: 3.5,
      content: "Good functionality but sometimes slow to load data.",
      status: "rejected"
    },
    {
      id: "16",
      userAvatar: "",
      userName: "Stephanie Clark",
      date: "25/08/2025",
      rating: 4.6,
      content: "Excellent fitness tracking app with detailed analytics and reports.",
      status: "approved"
    },
    {
      id: "17",
      userAvatar: "",
      userName: "Daniel Rodriguez",
      date: "24/08/2025",
      rating: 4.1,
      content: "Very helpful for meal planning and workout scheduling.",
      status: "approved"
    },
    {
      id: "18",
      userAvatar: "",
      userName: "Jennifer Walker",
      date: "23/08/2025",
      rating: 5.0,
      content: "Outstanding app! The AI recommendations are spot on.",
      status: "pending"
    },
    {
      id: "19",
      userAvatar: "",
      userName: "Matthew Hall",
      date: "22/08/2025",
      rating: 3.2,
      content: "Basic functionality works well but lacks advanced features.",
      status: "rejected"
    },
    {
      id: "20",
      userAvatar: "",
      userName: "Nicole Young",
      date: "21/08/2025",
      rating: 4.4,
      content: "Great app for beginners! Easy to use and very informative.",
      status: "approved"
    },
    {
      id: "21",
      userAvatar: "",
      userName: "Andrew King",
      date: "20/08/2025",
      rating: 4.8,
      content: "Love the social features and the ability to share progress with friends.",
      status: "approved"
    },
    {
      id: "22",
      userAvatar: "",
      userName: "Rebecca Wright",
      date: "19/08/2025",
      rating: 5.0,
      content: "This app has completely transformed my fitness journey!",
      status: "pending"
    }
  ];

  const displayFeedbacks = feedbacks.length > 0 ? feedbacks : mockFeedbacks;

  // Pagination logic
  const totalPages = Math.ceil(displayFeedbacks.length / itemsPerPage);
  
  const currentPageData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return displayFeedbacks.slice(startIndex, endIndex);
  }, [displayFeedbacks, currentPage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when changing pages (optional)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
        {currentPageData.map((feedback) => (
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

      {/* Pagination */}
      {displayFeedbacks.length > itemsPerPage && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            showPageNumbers={true}
            maxVisiblePages={5}
            className="pagination-feedback"
          />
        </div>
      )}
    </div>
  );
};

export default FeedbackCards;