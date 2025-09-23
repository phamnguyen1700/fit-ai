"use client";
import React from 'react';
import { ExerciseCard, Card } from '@/shared/ui';
import { Row, Col } from '@/shared/ui';

interface ExerciseCardsProps {
  className?: string;
}

const ExerciseCards: React.FC<ExerciseCardsProps> = ({ className }) => {
  // Sample data for 8 exercise cards (4 rows x 2 columns)
  const exerciseData = [
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
    }
  ];

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
        {exerciseData.map((exercise) => (
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
    </div>
  );
};

export default ExerciseCards;
