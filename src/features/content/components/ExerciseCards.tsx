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
  
  // Load pinned exercises from localStorage
  const [pinnedExerciseIds, setPinnedExerciseIds] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinnedExercises');
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });
  
  const itemsPerPage = 8;

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

  const handleSaveExercise = (updatedExercise: any) => {
    console.log('Save exercise:', updatedExercise);
    handleCloseEditPopup();
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
                  title={exercise.title}
                  videoThumbnail={exercise.videoThumbnail}
                  muscleGroup={exercise.muscleGroup}
                  difficulty={exercise.difficulty}
                  isPinned={isPinned}
                  onPlay={() => handlePlay(exercise.id)}
                  onEdit={() => handleEdit(exercise.id)}
                  onView={() => handleView(exercise.id)}
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
    </div>
  );
};

export default ExerciseCards;
