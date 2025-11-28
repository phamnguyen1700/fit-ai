"use client";
import React, { useState } from "react";
import { Card } from "../core/Card";
import { Button } from "../core/Button";
import { Icon } from "../icon";

interface MealCardProps {
  title: string;
  image: string;
  mealType: string; 
  calories: string;
  protein: string;
  carbs: string;
  fat: string;
//   vitamin: string;
  goal: string; 
  onPlay?: () => void;
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const MealCard: React.FC<MealCardProps> = ({
  title,
  image,
  mealType,
  calories,
  protein,
  carbs,
  fat,
//   vitamin,
  goal,
  onPlay,
  onEdit,
  onView,
  onDelete,
  className,
}) => {
  const [isContentHovered, setIsContentHovered] = useState(false);

  return (
    <Card
      className={`meal-card relative ${className || ""}`}
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex rounded-lg overflow-hidden h-full">
        {/* Meal Image Section */}
        <div className="relative w-80 flex-shrink-0">
          {/* Header with title */}
          <div className="p-4 pb-2">
            <h3 className="text-lg font-semibold text-[var(--text)] leading-tight">
              {title}
            </h3>
          </div>

          {/* Meal image */}
          <div className="px-4 pb-4">
            <div
              className="w-full h-48 bg-cover bg-center relative rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* View Details Button Overlay */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                <button
                  onClick={onPlay}
                  className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-300"
                >
                  <Icon name="mdi:eye" size={32} color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className="flex-1 p-4 flex flex-col justify-center relative"
          onMouseEnter={() => setIsContentHovered(true)}
          onMouseLeave={() => setIsContentHovered(false)}
        >
          {/* Meal Details Grid */}
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            {/* Left Column - Labels */}
            <div className="space-y-4">
              <div>
                <span className="text-[var(--text-secondary)]">Loại bữa</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Calories</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Protein</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Carbs</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Fat</span>
              </div>
              <div>
                {/* <span className="text-[var(--text-secondary)]">Vitamin</span> */}
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Mục tiêu</span>
              </div>
            </div>

            {/* Right Column - Values */}
            <div className="space-y-4 text-right">
              <div>
                <span className="text-[var(--text)] font-medium">
                  {mealType}
                </span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">
                  {calories}
                </span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">
                  {protein}
                </span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">
                  {carbs}
                </span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">
                  {fat}
                </span>
              </div>
              {/* <div>
                <span className="text-[var(--text)] font-medium">
                  {vitamin}
                </span>
              </div> */}
              <div>
                <span className="text-[var(--text)] font-medium">
                  {goal}
                </span>
              </div>
            </div>
          </div>

          {/* Hover Overlay with Action Buttons - Only for content section */}
          {isContentHovered && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center ">
              <div className="flex flex-col gap-4 w-full max-w-sm px-6">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onView}
                  className="w-full !bg-white !text-gray-800 hover:!bg-gray-50 hover:!text-gray-900 px-8 py-4 rounded-lg font-medium text-base shadow-lg border border-gray-100"
                >
                  Chi tiết bữa ăn
                </Button>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={onEdit}
                  className="w-full !bg-white !text-gray-800 hover:!bg-gray-50 hover:!text-gray-900 px-8 py-4 rounded-lg font-medium text-base shadow-lg border border-gray-100"
                >
                  Chỉnh sửa bữa ăn
                </Button>
                <div className="flex gap-4 mt-2">
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onView}
                    className="w-full !bg-white !text-gray-800 hover:!bg-gray-50 hover:!text-gray-900 px-8 py-4 rounded-lg font-medium text-base shadow-lg border border-gray-100"
                  >
                    Ghim bữa ăn
                  </Button>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={onDelete}
                    className="w-full !bg-white !text-gray-800 hover:!bg-gray-50 hover:!text-gray-900 px-8 py-4 rounded-lg font-medium text-base shadow-lg border border-gray-100"
                  >
                    Xoá bữa ăn
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default MealCard;
