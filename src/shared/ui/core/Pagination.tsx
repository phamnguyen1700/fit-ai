"use client";
import React from 'react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevious?: () => void;
  onNext?: () => void;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
  showPageNumbers = true,
  maxVisiblePages = 5,
  className,
}) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPrevious?.();
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onNext?.();
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  // Calculate visible page numbers
  const getVisiblePages = () => {
    const pages: number[] = [];
    const half = Math.floor(maxVisiblePages / 2);
    
    let start = Math.max(1, currentPage - half);
    const end = Math.min(totalPages, start + maxVisiblePages - 1);
    
    // Adjust start if we're near the end
    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(1, end - maxVisiblePages + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const visiblePages = getVisiblePages();

  // Alternative: use simple text arrows
  // const ChevronLeft = () => <span>‹</span>;
  // const ChevronRight = () => <span>›</span>;
  
  // Arrow SVG components
  const ChevronLeft = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="15,18 9,12 15,6"></polyline>
    </svg>
  );

  const ChevronRight = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="9,18 15,12 9,6"></polyline>
    </svg>
  );

  return (
    <div className={`pagination-container ${className || ''}`}>
      {/* Previous Button */}
      <button
        className={`pagination-button pagination-arrow ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={handlePrevious}
        disabled={currentPage === 1}
        aria-label="Previous page"
      >
        <ChevronLeft />
      </button>

      {/* Page Numbers */}
      {showPageNumbers && (
        <div className="pagination-numbers">
          {visiblePages.map((page) => (
            <button
              key={page}
              className={`pagination-button pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => handlePageClick(page)}
              aria-label={`Go to page ${page}`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Next Button */}
      <button
        className={`pagination-button pagination-arrow ${currentPage === totalPages ? 'disabled' : ''}`}
        onClick={handleNext}
        disabled={currentPage === totalPages}
        aria-label="Next page"
      >
        <ChevronRight />
      </button>
    </div>
  );
};

export default Pagination;