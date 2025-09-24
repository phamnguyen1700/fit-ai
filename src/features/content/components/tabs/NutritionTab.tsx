"use client";

import { Card } from '@/shared/ui';
import React from 'react';
import TabsHeader from '../TabsHeader';
import MealCards from '../MealCards';

const NutritionTab = () => {
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
          onEdit={() => console.log("Edit meals")}
        />
        
        {/* Meal Cards Grid */}
        <MealCards />
      </div>
    </Card>
  );};

export default NutritionTab;