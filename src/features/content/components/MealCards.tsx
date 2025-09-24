"use client";
import React, { useState } from 'react';
import { MealCard, Card, Pagination, PopupContent } from '@/shared/ui';
import { Row, Col } from '@/shared/ui';

interface MealCardsProps {
  className?: string;
}

const MealCards: React.FC<MealCardsProps> = ({ className }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const itemsPerPage = 8;

  // Sample data for meal cards
  const allMealData = [
    {
      id: 1,
      title: "Salad cá hồi",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn chính",
      calories: "350 kcal",
      protein: "28g",
      carbs: "20g",
      fat: "15g",
      vitamin: "A, D, E",
      goal: "Giảm cân"
    },
    {
      id: 2,
      title: "Bánh mì sandwich gà",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn sáng",
      calories: "420 kcal",
      protein: "25g",
      carbs: "35g",
      fat: "18g",
      vitamin: "B1, B6, B12",
      goal: "Tăng cân"
    },
    {
      id: 3,
      title: "Smoothie bơ chuối",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn nhẹ",
      calories: "280 kcal",
      protein: "12g",
      carbs: "45g",
      fat: "8g",
      vitamin: "C, K, B6",
      goal: "Tăng cân"
    },
    {
      id: 4,
      title: "Bún bò Huế",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn trưa",
      calories: "480 kcal",
      protein: "22g",
      carbs: "52g",
      fat: "20g",
      vitamin: "A, C, B1",
      goal: "Duy trì"
    },
    {
      id: 5,
      title: "Gỏi cuốn tôm thịt",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn nhẹ",
      calories: "200 kcal",
      protein: "15g",
      carbs: "25g",
      fat: "6g",
      vitamin: "A, C, E",
      goal: "Giảm cân"
    },
    {
      id: 6,
      title: "Cơm gà teriyaki",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn tối",
      calories: "520 kcal",
      protein: "32g",
      carbs: "48g",
      fat: "22g",
      vitamin: "B3, B6, B12",
      goal: "Tăng cân"
    },
    {
      id: 7,
      title: "Soup rau củ",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn tối",
      calories: "180 kcal",
      protein: "8g",
      carbs: "30g",
      fat: "4g",
      vitamin: "A, C, K",
      goal: "Giảm cân"
    },
    {
      id: 8,
      title: "Protein shake",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn nhẹ",
      calories: "320 kcal",
      protein: "35g",
      carbs: "12g",
      fat: "10g",
      vitamin: "D, B12, B2",
      goal: "Tăng cân"
    },
    {
      id: 9,
      title: "Phở bò tái",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn sáng",
      calories: "450 kcal",
      protein: "28g",
      carbs: "55g",
      fat: "12g",
      vitamin: "B1, B3, B12",
      goal: "Duy trì"
    },
    {
      id: 10,
      title: "Bánh mì chả cá",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn trưa",
      calories: "380 kcal",
      protein: "20g",
      carbs: "42g",
      fat: "15g",
      vitamin: "D, B6, B12",
      goal: "Duy trì"
    },
    {
      id: 11,
      title: "Greek yogurt với granola",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn sáng",
      calories: "280 kcal",
      protein: "18g",
      carbs: "32g",
      fat: "8g",
      vitamin: "D, B2, B12",
      goal: "Giảm cân"
    },
    {
      id: 12,
      title: "Cà ri gà",
      image: "https://i.pinimg.com/1200x/9a/0b/39/9a0b39c9eab47d3da0d4bc76ae5631e0.jpg",
      mealType: "Ăn tối",
      calories: "480 kcal",
      protein: "30g",
      carbs: "35g",
      fat: "25g",
      vitamin: "A, B3, B6",
      goal: "Tăng cân"
    }
  ];

  // Calculate pagination
  const totalPages = Math.ceil(allMealData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMeals = allMealData.slice(startIndex, endIndex);

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

  const handlePlay = (mealId: number) => {
    const meal = allMealData.find(m => m.id === mealId);
    if (meal) {
      const mealData = {
        id: meal.id,
        title: meal.title,
        image: meal.image,
        type: 'meal' as const,
        mealType: meal.mealType,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        goal: meal.goal,
      };
      setSelectedMeal(mealData);
      setIsPopupVisible(true);
    }
  };

  const handleEdit = (mealId: number) => {
    console.log('Edit meal:', mealId);
  };

  const handleView = (mealId: number) => {
    const meal = allMealData.find(m => m.id === mealId);
    if (meal) {
      const mealData = {
        id: meal.id,
        title: meal.title,
        image: meal.image,
        type: 'meal' as const,
        mealType: meal.mealType,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        goal: meal.goal,
      };
      setSelectedMeal(mealData);
      setIsPopupVisible(true);
    }
  };

  const handleDelete = (mealId: number) => {
    console.log('Delete meal:', mealId);
  };

  const handleClosePopup = () => {
    setIsPopupVisible(false);
    setSelectedMeal(null);
  };

  const handlePopupEdit = (mealId: number) => {
    console.log('Edit meal from popup:', mealId);
    handleClosePopup();
  };

  const handlePopupSave = (mealId: number) => {
    console.log('Save meal from popup:', mealId);
    handleClosePopup();
  };

  const handlePopupDelete = (mealId: number) => {
    console.log('Delete meal from popup:', mealId);
    handleClosePopup();
  };

  return (
    <div className={`meal-cards-container ${className || ''}`}>
      <Row gutter={[24, 24]}>
        {currentMeals.map((meal) => (
          <Col span={12} key={meal.id}>
            <MealCard
              title={meal.title}
              image={meal.image}
              mealType={meal.mealType}
              calories={meal.calories}
              protein={meal.protein}
              carbs={meal.carbs}
              fat={meal.fat}
              vitamin={meal.vitamin}
              goal={meal.goal}
              onPlay={() => handlePlay(meal.id)}
              onEdit={() => handleEdit(meal.id)}
              onView={() => handleView(meal.id)}
              onDelete={() => handleDelete(meal.id)}
            />
          </Col>
        ))}
      </Row>
      
      {/* Pagination Navigation */}
      {totalPages > 1 && (
        <div className="meal-cards-pagination">
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

      {/* Meal Details Popup */}
      {selectedMeal && (
        <PopupContent
          isVisible={isPopupVisible}
          onClose={handleClosePopup}
          data={selectedMeal}
          onEdit={handlePopupEdit}
          onSave={handlePopupSave}
          onDelete={handlePopupDelete}
        />
      )}
    </div>
  );
};

export default MealCards;
