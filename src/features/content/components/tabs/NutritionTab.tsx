"use client";

import { Card } from '@/shared/ui';
import React from 'react';
import TabsHeader from '../TabsHeader';
import MealCards from '../MealCards';

const NutritionTab = () => {
  const handleDropdownSelect = (option: any) => {
    console.log("Selected meal option:", option);
    // Xử lý logic cho meal categories
  };

  const mealDropdownOptions = [
    { key: "all", label: "Tất cả" },
    { key: "meal-type", label: "Loại bữa ăn" },
    { key: "cuisine", label: "Ẩm thực" },
    { key: "diet-type", label: "Chế độ ăn" }
  ];

  return (
    <Card className="nutrition-tab-container">
      <header className="mb-4">
        <h4 className="text-2xl font-bold">Quản lý bữa ăn</h4>
      </header>
      <div className="space-y-4">
        <TabsHeader
          addButtonText="Thêm bữa ăn"
          searchPlaceholder="Tìm kiếm bữa ăn..."
          onAddNew={() => console.log("Add new meal")}
          onSearch={(value) => console.log("Search:", value)}
          onDropdownSelect={handleDropdownSelect}
          dropdownOptions={mealDropdownOptions}
          defaultActiveOption="all"
        />
        
        {/* Meal Cards Grid */}
        <MealCards />
      </div>
    </Card>
  );};

export default NutritionTab;