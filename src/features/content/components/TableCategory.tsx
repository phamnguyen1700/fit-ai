"use client";
import React, { useState, useMemo } from 'react';
import { Table2, Pagination, Button, Modal } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { TableColumn } from '@/shared/ui/core/Table2';
import { useGetExerciseCategories, useUpdateExerciseCategory, useDeleteExerciseCategory } from '@/tanstack/hooks/exercisecategory';
import type { ExerciseCategory, UpdateExerciseCategoryRequest } from '@/types/exercisecategory';
import EditCategoryModal from './EditCategoryModal';

const TableCategory: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<ExerciseCategory | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<ExerciseCategory | null>(null);

  const updateCategoryMutation = useUpdateExerciseCategory();
  const deleteCategoryMutation = useDeleteExerciseCategory();

  // API call will automatically refetch when currentPage changes
  // because queryKey includes params: ['exerciseCategories', { page, pageSize }]
  const { data: categoriesResponse, isLoading } = useGetExerciseCategories({
    page: currentPage,
    pageSize: pageSize,
  });

  // Debug: Log response structure
  React.useEffect(() => {
    if (categoriesResponse) {
      console.log('Categories Response:', categoriesResponse);
      console.log('Categories Response.data:', categoriesResponse.data);
    }
  }, [categoriesResponse]);

  // Extract categories from response
  // API might return array directly or wrapped in object
  const categories: ExerciseCategory[] = useMemo(() => {
    if (!categoriesResponse?.data) return [];
    
    // Check if data is array directly (API returns array)
    if (Array.isArray(categoriesResponse.data)) {
      return categoriesResponse.data;
    }
    
    // Check if data is object with nested data array
    if (categoriesResponse.data && typeof categoriesResponse.data === 'object') {
      // Structure: { data: ExerciseCategory[], total, page, pageSize }
      if (categoriesResponse.data.data && Array.isArray(categoriesResponse.data.data)) {
        return categoriesResponse.data.data;
      }
    }
    
    return [];
  }, [categoriesResponse]);

  // Extract total from ExerciseCategoryListResponse
  // If API returns array directly, estimate total based on current page and items
  const total = useMemo(() => {
    if (!categoriesResponse?.data) return 0;
    
    // If data is array directly (API returns array)
    if (Array.isArray(categoriesResponse.data)) {
      const currentItemsCount = categoriesResponse.data.length;
      
      // If we have full page of items, assume there are more pages
      if (currentItemsCount === pageSize) {
        // Estimate: at least current page + 1 more page
        return (currentPage * pageSize) + 1;
      }
      
      // If we have less than pageSize, this is the last page
      return (currentPage - 1) * pageSize + currentItemsCount;
    }
    
    // If data is object with total property (correct structure)
    if (typeof categoriesResponse.data === 'object' && !Array.isArray(categoriesResponse.data)) {
      return categoriesResponse.data.total || 0;
    }
    
    return 0;
  }, [categoriesResponse, currentPage, pageSize]);

  // Calculate total pages
  // If total is 0, don't show pagination
  // If we have data, always show at least current page
  const totalPages = total > 0 ? Math.max(1, Math.ceil(total / pageSize)) : 0;
  
  // If we have full page of items, allow going to next page
  // This handles the case where API returns array directly without total
  const hasMorePages = categories.length === pageSize || currentPage < totalPages;

  // Handle edit category
  const handleEdit = (record: ExerciseCategory) => {
    setSelectedCategory(record);
    setIsEditModalOpen(true);
  };

  // Handle submit edit
  const handleSubmitEdit = (data: UpdateExerciseCategoryRequest) => {
    updateCategoryMutation.mutate(
      { id: data.id, data },
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        },
      }
    );
  };

  // Handle delete category
  const handleDelete = (record: ExerciseCategory) => {
    setCategoryToDelete(record);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (categoryToDelete) {
      deleteCategoryMutation.mutate(categoryToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setCategoryToDelete(null);
        },
      });
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setCategoryToDelete(null);
  };

  // Define columns
  const columns: TableColumn<ExerciseCategory>[] = [
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
      width: 200,
      ellipsis: true,
      sorter: (a: ExerciseCategory, b: ExerciseCategory) => 
        (a.name || '').localeCompare(b.name || ''),
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
      width: 300,
      ellipsis: true,
    },
    {
      title: 'Hành động',
      key: 'actions',
      width: 150,
      align: 'center',
      fixed: 'right',
      render: (_: unknown, record: ExerciseCategory) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(record)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
          >
            <Icon name="mdi:pencil-outline" size={16} />
            <span className="ml-1">Sửa</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(record)}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            <Icon name="mdi:delete-outline" size={16} />
            <span className="ml-1">Xóa</span>
          </Button>
        </div>
      ),
    },
  ];

  // Handle pagination change
  // When user clicks on page 2, currentPage becomes 2
  // This triggers React Query to refetch with page=2 parameter
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // React Query will automatically refetch with new page parameter
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    // Allow going to next page if:
    // 1. We haven't reached totalPages, OR
    // 2. We have full page of items (suggesting more data exists)
    if (currentPage < totalPages || hasMorePages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return (
    <div className="w-full">
      <Table2<ExerciseCategory>
        columns={columns}
        dataSource={categories}
        rowKey="id"
        bordered
        size="middle"
        loading={isLoading}
        pagination={false}
        scroll={{ x: 800 }}
        className="custom-table-category"
      />
      
      {/* Custom Pagination */}
      {/* Show pagination if we have data or if we're not on first page */}
      {(totalPages > 0 || currentPage > 1 || categories.length > 0) && (
        <div className="mt-4 flex justify-center items-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages > 0 ? totalPages : currentPage + (hasMorePages ? 1 : 0)}
            onPageChange={handlePageChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
            showPageNumbers={true}
            maxVisiblePages={5}
            className="table-pagination"
          />
        </div>
      )}

      {/* Edit Category Modal */}
      <EditCategoryModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedCategory(null);
        }}
        onSubmit={handleSubmitEdit}
        categoryData={selectedCategory}
        isLoading={updateCategoryMutation.isPending}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Xác nhận xóa danh mục"
        size="md"
        showFooter={true}
        footerContent={
          <div className="flex justify-end gap-3">
            <Button
              variant="secondary"
              onClick={handleCancelDelete}
              disabled={deleteCategoryMutation.isPending}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteCategoryMutation.isPending}
            >
              {deleteCategoryMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {/* Warning Icon and Message */}
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex-shrink-0 mt-0.5">
              <Icon 
                name="mdi:alert-circle" 
                size={20}
                className="text-red-600 dark:text-red-400"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">
                Bạn có chắc chắn muốn xóa danh mục này không?
              </p>
              {categoryToDelete && (
                <p className="mt-2 text-sm font-medium text-red-900 dark:text-red-100">
                  Danh mục: <span className="font-semibold">{categoryToDelete.name}</span>
                </p>
              )}
              <p className="mt-2 text-xs text-red-700 dark:text-red-300">
                Hành động này không thể hoàn tác!
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TableCategory;

