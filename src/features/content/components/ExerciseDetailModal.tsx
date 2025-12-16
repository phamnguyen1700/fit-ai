"use client";

import React from "react";
import { Modal } from "@/shared/ui";
import { Icon } from "@/shared/ui/icon";
import { FormValidationRule, KeypointId, KEYPOINT_LABELS } from "@/types/exercise";

export interface ExerciseDetailData {
  id: string;
  categoryId: string;
  title: string;
  videoThumbnail: string;
  muscleGroup: string;
  difficulty: string;
  description?: string;
  cameraAngle?: string;
  lastCreate?: string;
  lastUpdate?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  formValidationRules?: FormValidationRule[];
}

interface ExerciseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: ExerciseDetailData | null;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  isOpen,
  onClose,
  exercise,
}) => {
  if (!exercise) return null;

  const {
    id,
    categoryId,
    title,
    muscleGroup,
    difficulty,
    description,
    cameraAngle,
    lastCreate,
    lastUpdate,
    videoUrl,
    thumbnailUrl,
    formValidationRules,
  } = exercise;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Chi tiết bài tập"
      size="xl"
    >
      <div className="space-y-4 max-h-[70vh] overflow-y-auto">
        {/* Basic Information Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Không hiển thị ID bài tập theo yêu cầu */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Tên bài tập</p>
            <p className="text-sm font-semibold text-gray-900">{title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Nhóm cơ</p>
            <p className="text-sm text-gray-800">{muscleGroup}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Mức độ</p>
            <p className="text-sm text-gray-800">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-semibold ${
                  difficulty === "Beginner"
                    ? "bg-green-100 text-green-800"
                    : difficulty === "Intermediate"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {difficulty}
              </span>
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Góc quay</p>
            <p className="text-sm text-gray-800">{cameraAngle || "-"}</p>
          </div>
          {/* Không hiển thị Category ID, chỉ dùng categoryName (muscleGroup) phía trên */}
          {/* Bỏ hiển thị thời gian tạo / cập nhật theo yêu cầu */}
        </div>

        {/* Description */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Mô tả</p>
          {description ? (
            <p className="text-sm whitespace-pre-line text-gray-800 bg-gray-50 p-3 rounded">
              {description}
            </p>
          ) : (
            <p className="text-sm text-gray-400 bg-gray-50 p-3 rounded">
              Không có
            </p>
          )}
        </div>

        {/* Video preview */}
        <div>
          <p className="text-xs text-gray-500 mb-1">Video</p>
          {videoUrl ? (
            <div className="bg-black rounded-lg overflow-hidden">
              <video
                src={videoUrl}
                controls
                className="w-full max-h-[320px] bg-black"
              >
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            </div>
          ) : (
            <p className="text-sm text-gray-400 bg-gray-50 p-3 rounded">
              Không có video
            </p>
          )}
        </div>

        {/* Form Validation Rules */}
        <div>
          <p className="text-xs text-gray-500 mb-2 font-semibold">
            Luật kiểm tra động tác (Form Validation Rules)
          </p>
          {formValidationRules && formValidationRules.length > 0 ? (
            <div className="space-y-3">
              {formValidationRules.map((rule, idx) => (
                <div
                  key={`${rule.ruleName}-${idx}`}
                  className="border border-gray-200 rounded-lg px-4 py-3 bg-gray-50"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Icon
                      name="mdi:ruler"
                      size={18}
                      className="text-primary"
                    />
                    <p className="text-sm font-semibold text-gray-900">
                      {rule.ruleName}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-500 mb-1">Góc tối thiểu</p>
                      <p className="text-gray-800 font-medium">
                        {rule.minAngle}°
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Góc tối đa</p>
                      <p className="text-gray-800 font-medium">
                        {rule.maxAngle}°
                      </p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">Các điểm khớp (Keypoints)</p>
                      {rule.keypointIds && rule.keypointIds.length > 0 ? (
                        <ul className="text-gray-800 bg-white px-3 py-2 rounded text-xs space-y-1">
                          {rule.keypointIds.map((id) => {
                            const viLabel = KEYPOINT_LABELS[id as KeypointId];
                            return (
                              <li key={id}>
                                <span className="font-mono font-semibold mr-1">
                                  {id}
                                </span>
                                - <span>{viLabel || `Điểm ${id}`}</span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-400 bg-white px-2 py-1 rounded">
                          Không có keypoint
                        </p>
                      )}
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 mb-1">Thông báo lỗi</p>
                      <p className="text-red-600 bg-red-50 px-2 py-1 rounded">
                        {rule.errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 bg-gray-50 p-3 rounded">
              Không có
            </p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ExerciseDetailModal;


