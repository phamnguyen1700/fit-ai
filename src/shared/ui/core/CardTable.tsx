"use client";
import React from 'react';
import { Pagination } from './Pagination';

export interface CardTableProps<T = unknown> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  pageSize?: number; 
  className?: string;
  gridClassName?: string; 
  onPageChange?: (page: number) => void;
}

export const CardTable = <T,>({
  items,
  renderItem,
  pageSize = 6,
  className,
  gridClassName,
  onPageChange,
}: CardTableProps<T>) => {
  const [currentPage, setCurrentPage] = React.useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));

  const handleChangePage = (page: number) => {
    setCurrentPage(page);
    onPageChange?.(page);
  };

  const startIndex = (currentPage - 1) * pageSize;
  const visibleItems = items.slice(startIndex, startIndex + pageSize);

  return (
    <div className={className}>
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch ${gridClassName || ''}`}>
        {visibleItems.map((item, index) => (
          <div key={startIndex + index} className="h-full">{renderItem(item, startIndex + index)}</div>
        ))}
      </div>

      {/* Only show pagination if there are 20 or more items */}
      {items.length >= 20 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        </div>
      )}
    </div>
  );
};

export default CardTable;


