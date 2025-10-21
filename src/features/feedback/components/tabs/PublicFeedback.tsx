"use client";
import React from 'react';

interface PublicFeedbackProps {
  className?: string;
}

const PublicFeedback: React.FC<PublicFeedbackProps> = ({
  className = ""
}) => {
  return (
    <div className={`public-feedback-container ${className}`}>
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Phản hồi công khai</h2>
        <p className="text-gray-500">Chức năng này đang được phát triển</p>
      </div>
    </div>
  );
};

export default PublicFeedback;
