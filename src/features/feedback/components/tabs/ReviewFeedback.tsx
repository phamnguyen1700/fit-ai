"use client";
import React from 'react';
import ReviewFeedbackTable from '../ReviewFeedbackTable';

interface ReviewFeedbackProps {
  className?: string;
}

const ReviewFeedback: React.FC<ReviewFeedbackProps> = ({
  className = ""
}) => {
  return (
    <div className={`review-feedback-container ${className}`}>
      <ReviewFeedbackTable />
    </div>
  );
};

export default ReviewFeedback;
