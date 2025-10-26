"use client";
import React from 'react';
import PublicFeedbackTable from '../PublicFeedbackTable';

interface PublicFeedbackProps {
  className?: string;
}

const PublicFeedback: React.FC<PublicFeedbackProps> = ({
  className = ""
}) => {
  return (
    <div className={`public-feedback-container ${className}`}>
      <PublicFeedbackTable />
    </div>
  );
};

export default PublicFeedback;
