"use client";
import React, { useState } from 'react';
import { ExerciseCard, Card, Pagination } from '@/shared/ui';
import { Row, Col } from '@/shared/ui';

interface ExerciseCardsProps {
  className?: string;
}

const ExerciseCards: React.FC<ExerciseCardsProps> = ({ className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample data for exercise cards
  const allExerciseData = [
    {
      id: 1,
      title: "Bài tập Squat - cơ mông",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "15 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~100 kcal"
    },
    {
      id: 2,
      title: "Bài tập Squat - cơ mông",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "15 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~100 kcal"
    },
    {
      id: 3,
      title: "Bài tập Squat - cơ mông",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "15 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~100 kcal"
    },
    {
      id: 4,
      title: "Bài tập Squat - cơ mông",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "15 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~100 kcal"
    },
    {
      id: 5,
      title: "Bài tập Squat - cơ mông",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "15 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~100 kcal"
    },
    {
      id: 6,
      title: "Bài tập Squat - cơ mông",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "15 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~100 kcal"
    },
    {
      id: 7,
      title: "Bài tập Squat - cơ mông",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "15 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~100 kcal"
    },
    {
      id: 8,
      title: "Bài tập Squat - cơ mông",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "15 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~100 kcal"
    },
    {
      id: 9,
      title: "Bài tập Push-up - cơ ngực",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Ngực, Cánh tay",
      exerciseType: "Strength",
      difficulty: "Dễ",
      duration: "10 phút",
      equipment: "Không cần dụng cụ",
      calories: "~80 kcal"
    },
    {
      id: 10,
      title: "Bài tập Deadlift - cơ lưng",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Lưng, Chân",
      exerciseType: "Strength",
      difficulty: "Khó",
      duration: "20 phút",
      equipment: "Barbell",
      calories: "~120 kcal"
    },
    {
      id: 11,
      title: "Bài tập Plank - cơ bụng",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Bụng, Core",
      exerciseType: "Stability",
      difficulty: "Trung bình",
      duration: "8 phút",
      equipment: "Không cần dụng cụ",
      calories: "~60 kcal"
    },
    {
      id: 12,
      title: "Bài tập Lunge - cơ đùi",
      videoThumbnail: "https://i.pinimg.com/736x/0b/4f/9c/0b4f9c1e3a44a110a809aa8c27ea4a15.jpg",
      muscleGroup: "Chân, Mông",
      exerciseType: "Strength",
      difficulty: "Trung bình",
      duration: "12 phút",
      equipment: "Tạ đơn (Dumbbell)",
      calories: "~90 kcal"
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(allExerciseData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExercises = allExerciseData.slice(startIndex, endIndex);

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

  const handlePlay = (exerciseId: number) => {
    console.log('Play video for exercise:', exerciseId);
  };

  const handleEdit = (exerciseId: number) => {
    console.log('Edit exercise:', exerciseId);
  };

  const handleView = (exerciseId: number) => {
    console.log('View details for exercise:', exerciseId);
  };

  const handleDelete = (exerciseId: number) => {
    console.log('Delete exercise:', exerciseId);
  };

  return (
    <div className={`exercise-cards-container ${className || ''}`}>
      <Row gutter={[24, 24]}>
        {currentExercises.map((exercise) => (
          <Col span={12} key={exercise.id}>
            <ExerciseCard
              title={exercise.title}
              videoThumbnail={exercise.videoThumbnail}
              muscleGroup={exercise.muscleGroup}
              exerciseType={exercise.exerciseType}
              difficulty={exercise.difficulty}
              duration={exercise.duration}
              equipment={exercise.equipment}
              calories={exercise.calories}
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
    </div>
  );
};

export default ExerciseCards;
