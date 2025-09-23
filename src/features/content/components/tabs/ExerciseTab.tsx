// ===== 1. FILE: components/tabs/ExerciseTab.tsx =====
"use client";

import React, { useState } from 'react';
import TabsHeader from '../TabsHeader';
import ExerciseCards from '../ExerciseCards';

const ExerciseTab = () => {
    return (
        <div className="space-y-6">
            <TabsHeader
                addButtonText="Thêm bài tập"
                searchPlaceholder="Tìm kiếm bài tập..."
                onAddNew={() => console.log('Add new exercise')}
                onSearch={(value) => console.log('Search:', value)}
                onEdit={() => console.log('Edit exercises')}
            />
            {/* <ExerciseCards /> */}
            <ExerciseCards/>
        </div>
    );
};

export default ExerciseTab;