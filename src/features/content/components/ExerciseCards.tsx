"use client";
import React, { useState, useMemo } from 'react';
import { ExerciseCard, Card, Pagination, EditExercisePopup } from '@/shared/ui';
import { Row, Col } from '@/shared/ui';
import { useGetExercises } from '@/tanstack/hooks/exercise';
import { Exercise } from '@/types/exercise';

interface ExerciseCardsProps {
  className?: string;
  searchQuery?: string;
  levelFilter?: string;
}

/**
 * Helper function để convert API Exercise data sang UI format
 * 
 * API Exercise structure (chỉ những field có thực sự):
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   categoryId: string,
 *   categoryName: string,
 *   videoUrl: string,
 *   level: "Beginner" | "Intermediate" | "Advanced",
 *   lastCreate: string,
 *   lastUpdate: string
 * }
 * 
 * Chỉ map những field có trong API
 */
const convertExerciseToUIFormat = (exercise: Exercise) => ({
  id: exercise.id,
  title: exercise.name,
  videoThumbnail: exercise.videoUrl,
  categoryId: exercise.categoryId, // Thêm categoryId cho edit
  muscleGroup: exercise.categoryName,
  difficulty: exercise.level,
  description: exercise.description,
});

const ExerciseCards: React.FC<ExerciseCardsProps> = ({ 
  className,
  searchQuery = '',
  levelFilter = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const itemsPerPage = 8;

  // Fetch exercises from API with filters
  const { data: exercisesResponse, isLoading, error } = useGetExercises({
    level: levelFilter ? (levelFilter as "Beginner" | "Intermediate" | "Advanced") : undefined,
    search: searchQuery || undefined
  });
  
  // Get exercises array from API response and convert to UI format
  const allExerciseData = useMemo(() => {
    const exercises = (exercisesResponse?.data || []).map(convertExerciseToUIFormat);
    
    // Client-side filtering nếu API không support
    return exercises.filter(exercise => {
      // Filter by search query
      const matchesSearch = !searchQuery || 
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by level
      const matchesLevel = !levelFilter || exercise.difficulty === levelFilter;
      
      return matchesSearch && matchesLevel;
    });
  }, [exercisesResponse?.data, searchQuery, levelFilter]);

  // Calculate pagination
  const totalPages = Math.ceil(allExerciseData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExercises = allExerciseData.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, levelFilter]);

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePlay = (exerciseId: string) => {
    // Open video in new tab or play inline
    const exercise = allExerciseData.find(ex => ex.id === exerciseId);
    if (exercise && exercise.videoThumbnail) {
      window.open(exercise.videoThumbnail, '_blank');
    }
  };

  const handleEdit = (exerciseId: string) => {
    const exercise = allExerciseData.find(ex => ex.id === exerciseId);
    if (exercise) {
      setSelectedExercise(exercise);
      setIsEditPopupOpen(true);
    }
  };

  const handleCloseEditPopup = () => {
    setIsEditPopupOpen(false);
    setSelectedExercise(null);
  };

  const handleSaveExercise = (updatedExercise: any) => {
    console.log('Save exercise:', updatedExercise);
    // API call được xử lý trong EditExercisePopup component
    // Callback này chỉ để log hoặc xử lý UI nếu cần
    handleCloseEditPopup();
  };

  const handleView = (exerciseId: string) => {
    // Ghim bài tập
    console.log('Pin exercise:', exerciseId);
  };

  const handleDelete = (exerciseId: string) => {
    // TODO: Show confirm dialog then delete
    if (confirm('Bạn có chắc muốn xóa bài tập này?')) {
      console.log('Delete exercise:', exerciseId);
      // Call delete API here
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`exercise-cards-container ${className || ''}`}>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải exercises...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`exercise-cards-container ${className || ''}`}>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <p className="text-red-500 mb-4">⚠️ Không thể tải exercises</p>
            <p className="text-gray-500 text-sm">Vui lòng thử lại sau</p>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (allExerciseData.length === 0) {
    return (
      <div className={`exercise-cards-container ${className || ''}`}>
        <div className="flex justify-center items-center py-20">
          <div className="text-center">
            <p className="text-gray-500">📭 Chưa có exercises nào</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`exercise-cards-container ${className || ''}`}>
      <Row gutter={[24, 24]}>
        {currentExercises.map((exercise) => (
          <Col span={12} key={exercise.id}>
            <ExerciseCard
              title={exercise.title}
              videoThumbnail={exercise.videoThumbnail}
              muscleGroup={exercise.muscleGroup}
              difficulty={exercise.difficulty}
              onPlay={() => handlePlay(exercise.id)}
              onEdit={() => handleEdit(exercise.id)}
              onView={() => handleView(exercise.id)}
              onDelete={() => handleDelete(exercise.id)}
            />
          </Col>
        ))}
      </Row>
      
      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <div className="exercise-cards-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
            showPageNumbers={true}
            maxVisiblePages={5}
          />
        </div>
      )}

      {/* Edit Exercise Popup */}
      <EditExercisePopup
        isOpen={isEditPopupOpen}
        onClose={handleCloseEditPopup}
        exercise={selectedExercise}
        onSave={handleSaveExercise}
      />
    </div>
  );
};

export default ExerciseCards;
