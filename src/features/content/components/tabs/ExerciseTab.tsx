// ===== 1. FILE: components/tabs/ExerciseTab.tsx =====
"use client";

import React, { useState } from "react";
import { Card } from "@/shared/ui";
import TabsHeader from "../TabsHeader";
import ExerciseCards from "../ExerciseCards";

const ExerciseTab = () => {
  return (
    <Card className="exercise-tab-container">
      <header className="mb-4">
        <h4 className="text-2xl font-bold">Quản lý bài tập</h4>
      </header>
      <div className="space-y-4">
        <TabsHeader
          addButtonText="Thêm bài tập"
          searchPlaceholder="Tìm kiếm bài tập..."
          onAddNew={() => console.log("Add new exercise")}
          onSearch={(value) => console.log("Search:", value)}
          onEdit={() => console.log("Edit exercises")}
        />
        <ExerciseCards />
      </div>
    </Card>
  );
};

export default ExerciseTab;
