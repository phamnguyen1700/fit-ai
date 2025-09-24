"use client";
import React, { useState } from "react";
import { Card, Button } from "@/shared/ui";
import { Icon, icons } from "@/shared/ui/icon";
import styles from "./PopupContent.module.css";

export interface PopupContentProps {
  isVisible: boolean;
  onClose: () => void;
  exercise: {
    id: number;
    title: string;
    videoThumbnail: string;
    muscleGroup: string;
    exerciseType: string;
    difficulty: string;
    duration: string;
    equipment: string;
    calories: string;
  };
  onEdit?: (exerciseId: number) => void;
  onSave?: (exerciseId: number) => void;
  onDelete?: (exerciseId: number) => void;
  className?: string;
}

export const PopupContent: React.FC<PopupContentProps> = ({
  isVisible,
  onClose,
  exercise,
  onEdit,
  onSave,
  onDelete,
  className,
}) => {
  const [isInstructionsExpanded, setIsInstructionsExpanded] = useState(false);

  const handleEdit = () => {
    onEdit?.(exercise.id);
  };

  const handleSave = () => {
    onSave?.(exercise.id);
  };

  const handleDelete = () => {
    onDelete?.(exercise.id);
  };

  const handleExit = () => {
    onClose();
  };

  const toggleInstructions = () => {
    setIsInstructionsExpanded(!isInstructionsExpanded);
  };

  if (!isVisible) return null;

  return (
    <div className="popup-content-overlay">
      <Card className={`popup-content-card ${className || ""}`}>
        {/* Close Button */}
        {/* <button 
          className="popup-close-button"
          onClick={handleExit}
          aria-label="Close popup"
        >
          <Icon name="x" size={20} className="popup-close-icon" />
        </button> */}

        <div className="popup-content">
          {/* Main Content Grid - 2 Columns */}
          <div className="popup-main-content">
            {/* Left Column: Title + Video */}
            <div className="popup-left-column">
              {/* Header */}
              <div className="popup-header">
                <h2 className="popup-title">{exercise.title}</h2>
              </div>

              {/* Video Section */}
              <div className="popup-video-section">
                <div className="popup-video-thumbnail">
                  <img
                    src={exercise.videoThumbnail}
                    alt={exercise.title}
                    className="popup-video-image"
                  />
                  <div className="popup-video-overlay">
                    <Icon name="play" size={24} className="popup-play-icon" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Exercise Details */}
            <div className="popup-right-column">
              {/* Exercise Details Grid */}
              <div className="popup-details-grid">
                <div className="popup-detail-row">
                  <span className="popup-detail-label">Nhóm cơ</span>
                  <span className="popup-detail-value">
                    {exercise.muscleGroup}
                  </span>
                </div>

                <div className="popup-detail-row">
                  <span className="popup-detail-label">Loại bài tập</span>
                  <span className="popup-detail-value">
                    {exercise.exerciseType}
                  </span>
                </div>

                <div className="popup-detail-row">
                  <span className="popup-detail-label">Mức độ</span>
                  <span className="popup-detail-value">
                    {exercise.difficulty}
                  </span>
                </div>

                <div className="popup-detail-row">
                  <span className="popup-detail-label">Thời lượng</span>
                  <span className="popup-detail-value">
                    {exercise.duration}
                  </span>
                </div>

                <div className="popup-detail-row">
                  <span className="popup-detail-label">Thiết bị cần</span>
                  <span className="popup-detail-value">
                    {exercise.equipment}
                  </span>
                </div>

                <div className="popup-detail-row">
                  <span className="popup-detail-label">Calories</span>
                  <span className="popup-detail-value">
                    {exercise.calories}
                  </span>
                </div>
              </div>
            </div>

            {/* Instructions Section - Full Width (spans both columns) */}
            <div className="popup-instructions">
              {/* Header */}
              <div
                className="popup-instruction-header flex items-center justify-between cursor-pointer"
                onClick={toggleInstructions}
              >
                <span className="popup-instruction-label flex items-center gap-1">
                  Hướng dẫn
                </span>
                <Icon
                  name={
                    isInstructionsExpanded ? icons.chevronUp : icons.chevronDown
                  }
                  size={16}
                  className="popup-chevron-icon"
                />
              </div>

              {/* Dropdown content with animation */}
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  isInstructionsExpanded
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="popup-instruction-content p-3">
                  <div className="popup-instruction-section">
                    <h4 className="popup-instruction-subtitle">Mô tả:</h4>
                    <p className="popup-instruction-text">
                      Đứng thẳng, 2 chân rộng bằng vai, hạ người xuống như ngồi
                      ghế...
                    </p>
                  </div>

                  <div className="popup-instruction-section">
                    <h4 className="popup-instruction-subtitle">
                      Lưu ý an toàn:
                    </h4>
                    <ul className="popup-instruction-list">
                      <li>- Giữ lưng thẳng.</li>
                      <li>- Không để đầu gối vượt quá mũi chân.</li>
                    </ul>
                  </div>

                  <div className="popup-instruction-section">
                    <h4 className="popup-instruction-subtitle">Lợi ích:</h4>
                    <ul className="popup-instruction-list">
                      <li>- Tăng sức mạnh phần thân dưới.</li>
                      <li>- Cải thiện sự ổn định và cân bằng.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Full Width */}
          <div className="popup-actions">
            <Button
              className="popup-action-button popup-edit-button"
              onClick={handleEdit}
            >
              Xoá
            </Button>
            <Button
              className="popup-action-button popup-save-button"
              onClick={handleSave}
            >
              Ghim
            </Button>
            <Button
              className="popup-action-button popup-delete-button"
              onClick={handleDelete}
            >
              Chỉnh sửa
            </Button>
            <Button
              className="popup-action-button popup-exit-button"
              onClick={handleExit}
            >
              Thoát
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PopupContent;
