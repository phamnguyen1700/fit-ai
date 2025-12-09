"use client";

import React, { useState } from "react";
import { Card } from '@/shared/ui';
import TableCategory from "../TableCategory";
import TabsHeader from "../TabsHeader";
import AddCategoryModal from "../AddCategoryModal";
import { useCreateExerciseCategory } from "@/tanstack/hooks/exercisecategory";
import { CreateExerciseCategoryRequest } from "@/types/exercisecategory";

const CategoryTab = () => {
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createCategoryMutation = useCreateExerciseCategory();

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleSearch = (value: string) => {
    setSearchValue(value);
    console.log('Search:', value);
    // Add search filtering logic here
  };

  const handleSubmitCategory = (data: CreateExerciseCategoryRequest) => {
    createCategoryMutation.mutate(data, {
      onSuccess: () => {
        setIsModalOpen(false);
      },
    });
  };

  return (
    <Card className="category-tab-container">
      <div className="p-6">
        <header className="mb-6">
          <h4 className="text-2xl font-bold text-[var(--text)]">
            Quản lý danh mục bài tập
          </h4>
        </header>
        <div className="mb-6">
          <TabsHeader
            addButtonText="Thêm danh mục"
            searchPlaceholder="Tìm kiếm danh mục..."
            onAddNew={handleAddCategory}
            onSearch={handleSearch}
            showLevelFilter={false}
          />
        </div>
        <TableCategory />

        <AddCategoryModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitCategory}
          isLoading={createCategoryMutation.isPending}
        />
      </div>
    </Card>
  );
};

export default CategoryTab;

