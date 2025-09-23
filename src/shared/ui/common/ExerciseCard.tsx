"use client";
import React, { useState } from "react";
import { Card } from "../core/Card";
import { Button } from "../core/Button";
import { Icon, icons } from "../icon";

interface ExerciseCardProps {
  title: string;
  videoThumbnail: string;
  muscleGroup: string;
  exerciseType: string;
  difficulty: string;
  duration: string;
  equipment: string;
  calories: string;
  onPlay?: () => void;
  onEdit?: () => void;
  onView?: () => void;
  onDelete?: () => void;
  className?: string;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  title,
  videoThumbnail,
  muscleGroup,
  exerciseType,
  difficulty,
  duration,
  equipment,
  calories,
  onPlay,
  onEdit,
  onView,
  onDelete,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className={`exercise-card relative ${className || ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex rounded-lg overflow-hidden h-full">
        {/* Video Thumbnail Section */}
        <div className="relative w-80 flex-shrink-0">
          {/* Header with title */}
          <div className="p-4 pb-2">
            <h3 className="text-lg font-semibold text-[var(--text)] leading-tight">
              {title}
            </h3>
          </div>
          
          {/* Video thumbnail */}
          <div className="px-4 pb-4">
            <div
              className="w-full h-48 bg-cover bg-center relative rounded-lg overflow-hidden"
              style={{
                backgroundImage: `url(${videoThumbnail})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Play Button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  onClick={onPlay}
                  className="w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-70 transition-all duration-300"
                >
                  <Icon name="mdi:play" size={32} color="white" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 flex flex-col justify-center">
          {/* Exercise Details Grid */}
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            {/* Left Column - Labels */}
            <div className="space-y-4">
              <div>
                <span className="text-[var(--text-secondary)]">Nhóm cơ</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Loại bài tập</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Mức độ</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Thời lượng</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Thiết bị cần</span>
              </div>
              <div>
                <span className="text-[var(--text-secondary)]">Calories</span>
              </div>
            </div>

            {/* Right Column - Values */}
            <div className="space-y-4 text-right">
              <div>
                <span className="text-[var(--text)] font-medium">{muscleGroup}</span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">{exerciseType}</span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">{difficulty}</span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">{duration}</span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">{equipment}</span>
              </div>
              <div>
                <span className="text-[var(--text)] font-medium">{calories}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hover Overlay with Action Buttons */}
        {isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center rounded-lg">
            <div className="flex flex-col gap-3 w-full max-w-sm px-8">
              <Button
                variant="ghost"
                size="sm"
                onClick={onView}
                className="w-full bg-white bg-opacity-90 text-gray-800 hover:bg-white hover:text-black px-6 py-3 rounded-lg font-medium"
              >
                Chi tiết bài tập
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onEdit}
                className="w-full bg-white bg-opacity-90 text-gray-800 hover:bg-white hover:text-black px-6 py-3 rounded-lg font-medium"
              >
                Chỉnh sửa bài tập
              </Button>
              <div className="flex gap-3 mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onView}
                  className="flex-1 bg-white bg-opacity-90 text-gray-800 hover:bg-white hover:text-black py-3 rounded-lg font-medium"
                >
                  Gim bài tập
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onDelete}
                  className="flex-1 bg-white bg-opacity-90 text-gray-800 hover:bg-white hover:text-black py-3 rounded-lg font-medium"
                >
                  Xoá bài tập
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExerciseCard;