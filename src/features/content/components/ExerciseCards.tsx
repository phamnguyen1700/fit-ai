"use client";
import React, { useState, useMemo } from 'react';
import { ExerciseCard, Pagination, EditExercisePopup, Modal } from '@/shared/ui';
import { Row, Col } from '@/shared/ui';
import { useGetExercises, useDeleteExerciseMutation } from '@/tanstack/hooks/exercise';
import { Exercise } from '@/types/exercise';
import { ExerciseItem } from '@/shared/ui/common/EditExercisePopup';
import ExerciseDetailModal, { ExerciseDetailData } from './ExerciseDetailModal';

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
  cameraAngle: exercise.cameraAngle,
  lastCreate: exercise.lastCreate,
  lastUpdate: exercise.lastUpdate,
  videoUrl: exercise.videoUrl,
  thumbnailUrl: exercise.thumbnailUrl,
  formValidationRules: exercise.formValidationRules,
});


const ExerciseCards: React.FC<ExerciseCardsProps> = ({ 
  className,
  searchQuery = '',
  levelFilter = ''
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isEditPopupOpen, setIsEditPopupOpen] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<ExerciseItem | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [exerciseToDelete, setExerciseToDelete] = useState<{ id: string; name: string } | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailExercise, setDetailExercise] = useState<ExerciseDetailData | null>(null);
  
  // Load pinned exercises from localStorage
  const [pinnedExerciseIds, setPinnedExerciseIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinnedExercises');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const itemsPerPage = 8;

  // Delete mutation
  const deleteMutation = useDeleteExerciseMutation();

  // Save to localStorage whenever pinnedExerciseIds changes
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinnedExercises', JSON.stringify(pinnedExerciseIds));
    }
  }, [pinnedExerciseIds]);

  // Fetch exercises from API with filters
  const { data: exercisesResponse, isLoading, error } = useGetExercises({
    level: levelFilter ? (levelFilter as "Beginner" | "Intermediate" | "Advanced") : undefined,
    search: searchQuery || undefined
  });

  // Debug: Log response structure
  React.useEffect(() => {
    console.log('=== EXERCISE RESPONSE DEBUG ===');
    console.log('Full response:', exercisesResponse);
    console.log('exercisesResponse?.data:', exercisesResponse?.data);
    console.log('Is loading:', isLoading);
    console.log('Error:', error);
  }, [exercisesResponse, isLoading, error]);
  
  // Get exercises array from API response and convert to UI format
  const allExerciseData = useMemo(() => {
    // Access data directly - API returns IApiResponse<Exercise[]> not IApiResponse<ExerciseListResponse>
    const rawExercises = exercisesResponse?.data || [];
    
    console.log('Raw exercises:', rawExercises);
    console.log('Is array?', Array.isArray(rawExercises));
    console.log('Length:', rawExercises.length);
    
    // Sort by creation date - newest first (item mới tạo sẽ hiển thị đầu tiên)
    const sortedExercises = [...rawExercises].sort((a, b) => {
      const dateA = a.lastCreate;
      const dateB = b.lastCreate;
      if (!dateA || !dateB) return 0;
      return new Date(dateB).getTime() - new Date(dateA).getTime();
    });
    
    // Convert to UI format
    const exercises = sortedExercises.map(convertExerciseToUIFormat);
    
    console.log('Converted exercises:', exercises);
    
    // Client-side filtering nếu API không support
    const filteredExercises = exercises.filter(exercise => {
      // Filter by search query
      const matchesSearch = !searchQuery || 
        exercise.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.muscleGroup.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      // Filter by level
      const matchesLevel = !levelFilter || exercise.difficulty === levelFilter;
      
      return matchesSearch && matchesLevel;
    });

    // Separate pinned and unpinned exercises
    const pinned = filteredExercises.filter(ex => pinnedExerciseIds.includes(ex.id));
    const unpinned = filteredExercises.filter(ex => !pinnedExerciseIds.includes(ex.id));
    
    // Return pinned first, then unpinned
    return [...pinned, ...unpinned];
  }, [exercisesResponse?.data, searchQuery, levelFilter, pinnedExerciseIds]);

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

  const handleSaveExercise = (updatedExercise: ExerciseItem) => {
    console.log('Save exercise:', updatedExercise);
    handleCloseEditPopup();
  };

  const handleShowDetail = (exerciseId: string) => {
    const found = allExerciseData.find((item) => item.id === exerciseId);
    if (found) {
      setDetailExercise(found as ExerciseDetailData);
      setIsDetailOpen(true);
    }
  };

  const handleView = (exerciseId: string) => {
    // Toggle pin exercise - chỉ cho phép pin tối đa 2 cards
    if (pinnedExerciseIds.includes(exerciseId)) {
      // Unpin
      setPinnedExerciseIds(prev => prev.filter(id => id !== exerciseId));
    } else {
      // Pin
      if (pinnedExerciseIds.length >= 2) {
        alert('Chỉ được ghim tối đa 2 bài tập! Vui lòng bỏ ghim bài tập khác trước.');
        return;
      }
      setPinnedExerciseIds(prev => [...prev, exerciseId]);
    }
  };

  const handleDelete = (exerciseId: string) => {
    // Find exercise to show its name in confirmation modal
    const exercise = allExerciseData.find(ex => ex.id === exerciseId);
    if (exercise) {
      setExerciseToDelete({ id: exerciseId, name: exercise.title });
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = () => {
    if (exerciseToDelete) {
      deleteMutation.mutate(exerciseToDelete.id, {
        onSuccess: () => {
          // Remove from pinned list if it was pinned
          setPinnedExerciseIds(prev => prev.filter(id => id !== exerciseToDelete.id));
          setIsDeleteModalOpen(false);
          setExerciseToDelete(null);
        }
      });
    }
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setExerciseToDelete(null);
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
        {currentExercises.map((exercise) => {
          const isPinned = pinnedExerciseIds.includes(exercise.id);
          return (
            <Col span={12} key={exercise.id}>
              <div style={{ position: 'relative' }}>
                {/* Pin badge */}
                {isPinned && (
                  <div style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    zIndex: 10,
                    backgroundColor: 'var(--primary)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 4,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                  }}>
                    📌 Đã ghim
                  </div>
                )}
                <ExerciseCard
                  exerciseId={exercise.id}
                  title={exercise.title}
                  videoThumbnail={exercise.videoThumbnail}
                  muscleGroup={exercise.muscleGroup}
                  difficulty={exercise.difficulty}
                  description={exercise.description}
                  cameraAngle={exercise.cameraAngle}
                  lastCreate={exercise.lastCreate}
                  lastUpdate={exercise.lastUpdate}
                  videoUrl={exercise.videoUrl}
                  thumbnailUrl={exercise.thumbnailUrl}
                  isPinned={isPinned}
                  onPlay={() => handlePlay(exercise.id)}
                  onEdit={() => handleEdit(exercise.id)}
                  onShowDetail={() => handleShowDetail(exercise.id)}
                  onView={() => handleView(exercise.id)}  // vẫn dùng để Ghim/Bỏ ghim
                  onDelete={() => handleDelete(exercise.id)}
                />
              </div>
            </Col>
          );
        })}
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

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Xác nhận xóa bài tập"
        width="500px"
      >
        <div className="space-y-6">
          {/* Warning Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
          </div>

          {/* Message */}
          <div className="text-center space-y-2">
            <p className="text-gray-800 font-semibold text-lg">
              Bạn có chắc chắn muốn xóa bài tập này?
            </p>
            {exerciseToDelete && (
              <p className="text-gray-600">
                <span className="font-semibold text-red-600">&quot;{exerciseToDelete.name}&quot;</span>
              </p>
            )}
            <p className="text-sm text-gray-500">
              Hành động này không thể hoàn tác!
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleCancelDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Hủy
            </button>
            <button
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {deleteMutation.isPending ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang xóa...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Xóa bài tập
                </>
              )}
            </button>
          </div>
        </div>
      </Modal>

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        exercise={detailExercise}
      />
    </div>
  );
};

export default ExerciseCards;
