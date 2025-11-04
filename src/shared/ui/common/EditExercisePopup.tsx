"use client";
import React, { useState, useEffect } from "react";
import { Icon } from "../icon";
import { Button } from "../core/Button";

interface EditExercisePopupProps {
  isOpen: boolean;
  onClose: () => void;
  exercise: {
    id: string;
    title: string;
    videoThumbnail: string;
    muscleGroup: string;
    difficulty: string;
    description: string;
  } | null;
  onSave: (updatedExercise: any) => void;
}

export const EditExercisePopup: React.FC<EditExercisePopupProps> = ({
  isOpen,
  onClose,
  exercise,
  onSave,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    videoThumbnail: "",
    muscleGroup: "",
    difficulty: "Beginner" as "Beginner" | "Intermediate" | "Advanced",
    description: "",
  });

  // Load exercise data when popup opens
  useEffect(() => {
    if (exercise) {
      setFormData({
        title: exercise.title,
        videoThumbnail: exercise.videoThumbnail,
        muscleGroup: exercise.muscleGroup,
        difficulty: exercise.difficulty as "Beginner" | "Intermediate" | "Advanced",
        description: exercise.description,
      });
    }
  }, [exercise]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (exercise) {
      onSave({
        ...exercise,
        ...formData,
      });
    }
  };

  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>

      {/* Popup Content */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-lg w-full mx-4 max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary-dark px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <Icon name="mdi:pencil" size={18} color="white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Chỉnh sửa bài tập</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-all"
          >
            <Icon name="mdi:close" size={18} color="#374151" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto max-h-[calc(85vh-140px)]">
          <div className="space-y-3.5">
            {/* Exercise Name */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Tên bài tập <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:dumbbell" size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Nhập tên bài tập"
                />
              </div>
            </div>

            {/* Muscle Group */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Nhóm cơ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:arm-flex" size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  name="muscleGroup"
                  value={formData.muscleGroup}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="VD: Chest, Back, Legs..."
                />
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mức độ <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:chart-line" size={16} className="text-gray-400" />
                </div>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 pr-8 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none bg-white cursor-pointer"
                >
                  <option value="Beginner">Beginner - Người mới</option>
                  <option value="Intermediate">Intermediate - Trung bình</option>
                  <option value="Advanced">Advanced - Nâng cao</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:chevron-down" size={16} className="text-gray-400" />
                </div>
              </div>
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Video URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <Icon name="mdi:video" size={16} className="text-gray-400" />
                </div>
                <input
                  type="url"
                  name="videoThumbnail"
                  value={formData.videoThumbnail}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Mô tả bài tập
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none"
                placeholder="Nhập mô tả chi tiết về bài tập..."
              />
            </div>
          </div>
        </form>

        {/* Footer Actions */}
        <div className="border-t border-gray-200 px-4 py-3 bg-gray-50 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm font-semibold hover:bg-gray-100 transition-all"
          >
            Hủy
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold hover:bg-primary-dark transition-all shadow-lg hover:shadow-xl flex items-center gap-1.5"
          >
            <Icon name="mdi:content-save" size={16} />
            <span>Lưu thay đổi</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditExercisePopup;
