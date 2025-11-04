"use client";
import React, { useState } from "react";
import { Card } from "../core/Card";
import { Button } from "../core/Button";
import { Icon, icons } from "../icon";

interface ExerciseCardProps {
  // Fields từ API
  title: string;           // name từ API
  videoThumbnail: string;  // videoUrl từ API
  muscleGroup: string;     // categoryName từ API
  difficulty: string;      // level từ API
  // Action handlers
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
  difficulty,
  onPlay,
  onEdit,
  onView,
  onDelete,
  className,
}) => {
  const [isContentHovered, setIsContentHovered] = useState(false);

  return (
    <Card
      className={`exercise-card relative ${className || ""}`}
      styles={{ body: { padding: 0 } }}
    >
      <div className="flex rounded-lg overflow-hidden h-full min-h-[280px]">
        {/* Video Thumbnail Section */}
        <div className="relative w-[50%] flex-shrink-0 bg-gradient-to-br from-gray-900 to-gray-800">
          {/* Video thumbnail with aspect ratio */}
          <div className="relative h-full flex items-center justify-center overflow-hidden">
            {/* Video thumbnail image */}
            <img
              src={videoThumbnail}
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback nếu image load fail
                e.currentTarget.src = 'https://via.placeholder.com/640x360/1f2937/ffffff?text=Video+Thumbnail';
              }}
            />
            
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
            
            {/* Title overlay at bottom */}
            <div className="absolute bottom-0 left-0 right-0 p-5 z-10">
              <h3 className="text-white font-bold text-xl leading-tight drop-shadow-2xl line-clamp-2">
                {title}
              </h3>
            </div>

            {/* Play Button */}
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <button
                onClick={onPlay}
                className="w-20 h-20 bg-white/25 backdrop-blur-md rounded-full flex items-center justify-center hover:bg-white/35 hover:scale-110 transition-all duration-300 shadow-2xl border-3 border-white/40 group"
              >
                <Icon name="mdi:play" size={40} color="white" className="ml-1" />
              </button>
            </div>

            {/* Difficulty Badge */}
            <div className="absolute top-4 left-4 z-10">
              <span className={`
                px-4 py-2 rounded-full text-xs font-bold backdrop-blur-md shadow-lg
                ${difficulty === 'Beginner' ? 'bg-green-500/90 text-white' : 
                  difficulty === 'Intermediate' ? 'bg-yellow-500/90 text-white' : 
                  'bg-red-500/90 text-white'}
              `}>
                {difficulty}
              </span>
            </div>

            {/* Video indicator badge */}
            <div className="absolute top-4 right-4 z-10">
              <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md flex items-center gap-1.5">
                <Icon name="mdi:youtube" size={16} color="red" />
                <span className="text-white text-xs font-semibold">Video</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div
          className="flex-1 p-6 flex flex-col justify-between relative bg-white"
          onMouseEnter={() => setIsContentHovered(true)}
          onMouseLeave={() => setIsContentHovered(false)}
        >
          {/* Exercise Details */}
          <div className="space-y-5">
            {/* Category Badge */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <span className="text-sm font-semibold text-primary uppercase tracking-wide">
                {muscleGroup}
              </span>
            </div>

            {/* Details Grid */}
            <div className="space-y-4">
              {/* Exercise Name with Icon */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Icon name="mdi:dumbbell" size={20} className="text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Tên bài tập</p>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">
                    {title}
                  </p>
                </div>
              </div>

              {/* Muscle Group */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Icon name="mdi:arm-flex" size={20} className="text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Nhóm cơ</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {muscleGroup}
                  </p>
                </div>
              </div>

              {/* Level */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Icon name="mdi:chart-line" size={20} className="text-gray-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-xs text-gray-500 mb-1">Mức độ</p>
                  <p className="text-sm font-semibold text-gray-800">
                    {difficulty}
                  </p>
                </div>
              </div>

              {/* Video Link */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Icon name="mdi:video" size={20} className="text-gray-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Video</p>
                  <a 
                    href={videoThumbnail} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline truncate block"
                  >
                    Xem video hướng dẫn
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Hover Overlay with Action Buttons */}
          {isContentHovered && (
            <div className="absolute inset-0 bg-gradient-to-br from-primary/95 to-primary-dark/95 backdrop-blur-sm flex items-center justify-center p-6 rounded-r-lg">
              <div className="flex flex-col gap-3 w-full">
                {/* Main Action: Chỉnh sửa bài tập */}
                <button
                  onClick={onEdit}
                  className="w-full bg-white text-gray-900 hover:bg-gray-100 px-6 py-4 rounded-lg font-bold text-base shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                >
                  <Icon name="mdi:pencil" size={20} />
                  <span>Chỉnh sửa bài tập</span>
                </button>
                
                {/* Secondary Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onView}
                    className="flex-1 bg-white text-gray-900 hover:bg-gray-100 px-4 py-3 rounded-lg font-semibold text-sm shadow-md transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Icon name="mdi:pin" size={18} />
                    <span>Ghim</span>
                  </button>
                  <button
                    onClick={onDelete}
                    className="flex-1 bg-red-500 text-white hover:bg-red-600 px-4 py-3 rounded-lg font-semibold text-sm shadow-md transform hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                    <Icon name="mdi:delete" size={18} />
                    <span>Xóa</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ExerciseCard;
