"use client";
import React from 'react';
import { Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import { MealSection } from './MealSection';

interface MealFormProps {
  onSubmit: () => void;
}

export const MealForm: React.FC<MealFormProps> = ({ onSubmit }) => {
  return (
    <div>
      <div className="mb-4 p-3 bg-orange-50 rounded-lg border border-orange-200">
        <p className="text-sm text-orange-700">
          <strong>Hướng dẫn:</strong> Chọn ngày và thêm thực đơn cho từng bữa ăn trong ngày đó.
        </p>
      </div>

      <MealSection
        name="breakfast"
        title="Bữa sáng"
        emoji="🌅"
        bgColor="bg-yellow-50"
        borderColor="border-yellow-200"
        addButtonText="Thêm món sáng"
      />

      <MealSection
        name="lunch"
        title="Bữa trưa"
        emoji="☀️"
        bgColor="bg-green-50"
        borderColor="border-green-200"
        addButtonText="Thêm món trưa"
      />

      <MealSection
        name="dinner"
        title="Bữa tối"
        emoji="🌙"
        bgColor="bg-blue-50"
        borderColor="border-blue-200"
        addButtonText="Thêm món tối"
      />

      <Button
        className="w-full bg-orange-500 text-white hover:bg-orange-600 mt-4"
        onClick={onSubmit}
      >
        <Icon name="mdi:plus" size={16} /> Thêm ngày ăn này
      </Button>
    </div>
  );
};
