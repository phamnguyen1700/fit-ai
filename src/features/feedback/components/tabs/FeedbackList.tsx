"use client";
import React from 'react';
import FeedbackCards from '../FeedbackCards';

interface FeedbackListProps {
  itemsPerPage?: number;
  className?: string;
}

const FeedbackList: React.FC<FeedbackListProps> = ({
  itemsPerPage = 10,
  className = ""
}) => {
  const handleApprove = (id: string) => {
    console.log("Approve feedback from list:", id);
    // TODO: Implement approve logic
  };

  const handleReject = (id: string) => {
    console.log("Reject feedback from list:", id);
    // TODO: Implement reject logic
  };

  const handleDelete = (id: string) => {
    console.log("Delete feedback from list:", id);
    // TODO: Implement delete logic
  };

  return (
    <div className={`feedback-list-container ${className}`}>
      <FeedbackCards
        itemsPerPage={itemsPerPage}
        onApprove={handleApprove}
        onReject={handleReject}
        onDelete={handleDelete}
        className="w-full"
      />
    </div>
  );
};

export default FeedbackList;
