"use client";
import React, { useState } from "react";
import { Card } from "../core/Card";
import { Icon } from "../icon";

interface ExerciseCardProps {
  // Fields từ API
  exerciseId?: string;
  title: string;           // name từ API
  videoThumbnail: string;  // videoUrl từ API (hoặc thumbnail)
  muscleGroup: string;     // categoryName từ API
  difficulty: string;      // level từ API
  description?: string;
  cameraAngle?: string;
  lastCreate?: string;
  lastUpdate?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  // Action handlers
  onPlay?: () => void;
  onEdit?: () => void;
  onView?: () => void;     // Ghim / Bỏ ghim
  onShowDetail?: () => void; // Xem chi tiết
  onDelete?: () => void;
  className?: string;
  isPinned?: boolean;      // Trạng thái ghim
}

// Helper function to get YouTube thumbnail
const getYouTubeThumbnail = (url: string): string | null => {
  try {
    const videoIdMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
    if (videoIdMatch && videoIdMatch[1]) {
      return `https://img.youtube.com/vi/${videoIdMatch[1]}/maxresdefault.jpg`;
    }
  } catch {
    return null;
  }
  return null;
}

// Helper function to check if URL is an image
const isImageUrl = (url: string): boolean => {
  return /\.(jpg|jpeg|png|gif|webp|bmp)$/i.test(url);
}

// Get appropriate thumbnail for video URL
const getVideoThumbnail = (videoUrl: string): string => {
  // Check if it's YouTube URL
  const youtubeThumbnail = getYouTubeThumbnail(videoUrl);
  if (youtubeThumbnail) return youtubeThumbnail;
  
  // Check if it's already an image URL
  if (isImageUrl(videoUrl)) return videoUrl;
  
  // Default: use data URI placeholder (1px transparent gif)
  // This prevents network requests to non-existent files
  return 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="640" height="360"%3E%3Crect fill="%231f2937" width="640" height="360"/%3E%3C/svg%3E';
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exerciseId,
  title,
  videoThumbnail,
  muscleGroup,
  difficulty,
  description,
  cameraAngle,
  lastCreate,
  lastUpdate,
  videoUrl,
  thumbnailUrl,
  onPlay,
  onEdit,
  onView,
  onShowDetail,
  onDelete,
  className,
  isPinned = false,
}) => {
  const [isContentHovered, setIsContentHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  const resolvedThumbnail = getVideoThumbnail(thumbnailUrl || videoThumbnail);

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
            {!imageError ? (
              <img
                src={resolvedThumbnail}
                alt={title}
                className="w-full h-full object-cover"
                onError={() => setImageError(true)}
              />
            ) : (
              // Fallback placeholder khi image load fail
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
                <div className="text-center">
                  <Icon name="mdi:video-off" size={48} color="rgba(255,255,255,0.3)" />
                  <p className="text-white/50 text-sm mt-2">Video Thumbnail</p>
                </div>
              </div>
            )}
            
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

              {/* Camera Angle + Created / Updated */}
              {(cameraAngle || lastCreate || lastUpdate) && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Icon name="mdi:video-3d" size={20} className="text-gray-600 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    {cameraAngle && (
                      <p className="text-sm text-gray-800">
                        <span className="text-xs text-gray-500 mr-1">Góc quay:</span>
                        <span className="font-semibold">{cameraAngle}</span>
                      </p>
                    )}
                    {lastCreate && (
                      <p className="text-xs text-gray-500">
                        Tạo: {new Date(lastCreate as string).toLocaleString()}
                      </p>
                    )}
                    {lastUpdate && (
                      <p className="text-xs text-gray-500">
                        Cập nhật: {new Date(lastUpdate as string).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Description */}
              {description && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Icon name="mdi:text" size={20} className="text-gray-600 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">Mô tả</p>
                    <p className="text-sm text-gray-800 whitespace-pre-line">
                      {description}
                    </p>
                  </div>
                </div>
              )}

              {/* Video Link */}
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <Icon name="mdi:video" size={20} className="text-gray-600 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 mb-1">Video</p>
                  <a
                    href={videoUrl || videoThumbnail}
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

                {/* View detail */}
                {onShowDetail && (
                  <button
                    type="button"
                    onClick={onShowDetail}
                    className="w-full bg-primary/10 text-gray-900 hover:bg-primary/20 px-4 py-3 rounded-lg font-semibold text-sm shadow-md transform hover:scale-105 transition-all flex items-center justify-center gap-2 border border-white/20"
                  >
                    <Icon name="mdi:eye" size={18} />
                    <span>Xem chi tiết</span>
                  </button>
                )}

                {/* Secondary Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={onView}
                    className={`flex-1 ${isPinned ? 'bg-orange-500 hover:bg-orange-600' : 'bg-white hover:bg-gray-100'} ${isPinned ? 'text-white' : 'text-gray-900'} px-4 py-3 rounded-lg font-semibold text-sm shadow-md transform hover:scale-105 transition-all flex items-center justify-center gap-2`}
                  >
                    <Icon name={isPinned ? "mdi:pin-off" : "mdi:pin"} size={18} />
                    <span>{isPinned ? 'Bỏ ghim' : 'Ghim'}</span>
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
