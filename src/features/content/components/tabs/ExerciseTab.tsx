// ===== 1. FILE: components/tabs/ExerciseTab.tsx =====
"use client";

import React, { useState } from "react";
import { Card } from "@/shared/ui";
import TabsHeader from "../TabsHeader";
import ExerciseCards from "../ExerciseCards";

const ExerciseTab = () => {
  const handleDropdownSelect = (option: any) => {
    console.log("Selected exercise option:", option);
    // Xử lý logic cho exercise categories
  };

  const exerciseDropdownOptions = [
    { key: "all", label: "Tất cả" },
    { key: "muscle-group", label: "Nhóm cơ" },
    { key: "exercise-type", label: "Loại bài tập" },
    { key: "difficulty", label: "Mức độ" }
  ];

  return (
    <Card className="exercise-tab-container">
      <header className="mb-4">
        <h4 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Quản lý bài tập</h4>
      </header>
      <div className="space-y-4">
        <TabsHeader
          addButtonText="Thêm bài tập"
          searchPlaceholder="Tìm kiếm bài tập..."
          onAddNew={() => console.log("Add new exercise")}
          onSearch={(value) => console.log("Search:", value)}
          onDropdownSelect={handleDropdownSelect}
          dropdownOptions={exerciseDropdownOptions}
          defaultActiveOption="muscle-group"
        />
        <ExerciseCards />
      </div>
    </Card>
  );
};

export default ExerciseTab;
