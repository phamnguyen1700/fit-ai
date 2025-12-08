'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Card } from '@/shared/ui/core/Card';
import { Icon } from '@/shared/ui/icon';
import { Select } from '@/shared/ui/core/Select';
import { Button } from '@/shared/ui/core/Button';
import { Input } from '@/shared/ui/core/Input';
import { useMealDetails, useUpdateMealPlan } from '@/tanstack/hooks/advisorplan';
import { useSearchMealIngredients } from '@/tanstack/hooks/mealingredient';
import type { MealDetail, UpdateMealPlanRequest } from '@/types/advisorplan';
import type { MealIngredient } from '@/types/mealingredient';

interface MealPlanViewProps {
  userId: string;
  checkpointNumber?: number;
}

export const MealPlanView: React.FC<MealPlanViewProps> = ({ userId, checkpointNumber }) => {
  const { data: mealData, isLoading, error } = useMealDetails({
    userId,
    checkpointNumber,
  });

  const meals = mealData?.data || [];

  // Group meals by day
  const { mealsByDay, sortedDays } = useMemo(() => {
    const grouped = meals.reduce((acc, meal) => {
      if (!acc[meal.dayNumber]) {
        acc[meal.dayNumber] = [];
      }
      acc[meal.dayNumber].push(meal);
      return acc;
    }, {} as Record<number, MealDetail[]>);

    const sorted = Object.keys(grouped)
      .map(Number)
      .sort((a, b) => a - b);

    return { mealsByDay: grouped, sortedDays: sorted };
  }, [meals]);

  // State for selected day
  const [selectedDay, setSelectedDay] = useState<number | null>(
    sortedDays.length > 0 ? sortedDays[0] : null
  );

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateMealPlanRequest | null>(null);
  const [originalData, setOriginalData] = useState<MealDetail | null>(null);

  const { mutate: updateMealPlan, isPending: isUpdating } = useUpdateMealPlan();

  // State for ingredient search
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // Debounce search term
  useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchTerm(ingredientSearchTerm.trim());
    }, 400);
    return () => clearTimeout(handle);
  }, [ingredientSearchTerm]);

  // Search params
  const searchParams = useMemo(() => {
    if (debouncedSearchTerm.length < 2) {
      return undefined;
    }
    return {
      query: debouncedSearchTerm,
      pageNumber: 0,
      maxResults: 50,
    };
  }, [debouncedSearchTerm]);

  // Base params for initial load
  const baseParams = useMemo(
    () => ({
      pageNumber: 0,
      maxResults: 50,
    }),
    []
  );

  // Fetch ingredients
  const { data: baseIngredientData, isFetching: isLoadingBaseIngredients } = useSearchMealIngredients(
    baseParams,
    {
      enabled: isEditing,
      staleTime: 5 * 60 * 1000,
    }
  );

  const { data: ingredientSearchData, isFetching: isSearchingIngredients } = useSearchMealIngredients(
    searchParams || baseParams,
    {
      enabled: isEditing && Boolean(searchParams),
      staleTime: 60 * 1000,
    }
  );

  // Prepare ingredient options
  const ingredientOptions = useMemo(() => {
    const baseFoods = baseIngredientData?.data?.foods ?? [];
    const searchFoods = ingredientSearchData?.data?.foods ?? [];
    const foods = searchParams ? searchFoods : baseFoods;

    return foods.map((food: MealIngredient) => ({
      label: food.food_name,
      value: food.food_name,
      food: food,
    }));
  }, [baseIngredientData, ingredientSearchData, searchParams]);

  const isLoadingIngredients = isLoadingBaseIngredients || isSearchingIngredients;

  // Update selectedDay when sortedDays changes
  React.useEffect(() => {
    if (sortedDays.length > 0) {
      if (selectedDay === null || !sortedDays.includes(selectedDay)) {
        setSelectedDay(sortedDays[0]);
      }
    }
  }, [sortedDays]); // Removed selectedDay from deps to avoid infinite loop

  // Reset edit mode when selectedDay changes
  const prevSelectedDayRef = React.useRef<number | null>(selectedDay);
  useEffect(() => {
    if (prevSelectedDayRef.current !== null && prevSelectedDayRef.current !== selectedDay) {
      // Only reset if selectedDay actually changed (not on initial mount)
      setIsEditing(false);
      setEditData(null);
      setOriginalData(null);
    }
    prevSelectedDayRef.current = selectedDay;
  }, [selectedDay]);

  // Get stable meal detail ID for dependency tracking
  const currentMealDetailId = useMemo(() => {
    if (!selectedDay || !mealsByDay[selectedDay]?.[0]) {
      return null;
    }
    return mealsByDay[selectedDay][0].mealDetailId;
  }, [selectedDay, mealsByDay]);

  // Initialize edit data when entering edit mode
  useEffect(() => {
    if (!isEditing || !selectedDay || !currentMealDetailId || editData) {
      return;
    }

    // Access mealsByDay directly from closure
    const dayMealsArray = selectedDay ? mealsByDay[selectedDay] : null;
    const mealDetail = dayMealsArray?.[0];
    if (!mealDetail) {
      return;
    }

    setOriginalData(mealDetail);
    setEditData({
      totalCalories: mealDetail.totalCalories,
      totalProtein: mealDetail.totalProtein,
      totalCarbs: mealDetail.totalCarbs,
      totalFat: mealDetail.totalFat,
      meals: mealDetail.meals.map((meal) => ({
        type: meal.type,
        calories: meal.calories,
        nutrition: { ...meal.nutrition },
        foods: meal.foods.map((food) => ({
          name: food.name,
          quantity: food.quantity,
          note: food.note,
        })),
      })),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, selectedDay, currentMealDetailId, editData]);

  // Use editData if editing and available, otherwise use original mealDetail
  const displayData = useMemo(() => {
    if (!selectedDay || !mealsByDay[selectedDay]) {
      return null;
    }
    const dayMeals = mealsByDay[selectedDay];
    return editData || (dayMeals[0] ? {
      totalCalories: dayMeals[0].totalCalories,
      totalProtein: dayMeals[0].totalProtein,
      totalCarbs: dayMeals[0].totalCarbs,
      totalFat: dayMeals[0].totalFat,
      meals: dayMeals[0].meals,
    } : null);
  }, [editData, selectedDay, mealsByDay]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-[var(--text-secondary)]">Đang tải kế hoạch dinh dưỡng...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <div className="text-sm font-medium text-red-600">Không thể tải kế hoạch dinh dưỡng</div>
        <div className="text-xs text-[var(--text-secondary)]">
          {error instanceof Error ? error.message : 'Vui lòng thử lại sau'}
        </div>
      </div>
    );
  }

  if (meals.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-[var(--border)] p-8 text-center text-sm text-[var(--text-secondary)]">
        Chưa có kế hoạch dinh dưỡng
      </div>
    );
  }

  if (!selectedDay || !mealsByDay[selectedDay] || !displayData) {
    return null;
  }

  const dayMeals = mealsByDay[selectedDay];
  const currentIndex = sortedDays.indexOf(selectedDay);
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < sortedDays.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      setSelectedDay(sortedDays[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      setSelectedDay(sortedDays[currentIndex + 1]);
    }
  };

  const handleStartEdit = () => {
    console.log('🔄 [MealPlanView] handleStartEdit called', { selectedDay, hasMeals: !!mealsByDay[selectedDay]?.[0] });
    
    if (!selectedDay || !mealsByDay[selectedDay]?.[0]) {
      console.warn('⚠️ [MealPlanView] Cannot start edit - missing data', { selectedDay, mealsByDay });
      return;
    }
    
    const mealDetail = mealsByDay[selectedDay][0];
    console.log('✅ [MealPlanView] Setting edit data', mealDetail);
    
    setOriginalData(mealDetail);
    setEditData({
      totalCalories: mealDetail.totalCalories,
      totalProtein: mealDetail.totalProtein,
      totalCarbs: mealDetail.totalCarbs,
      totalFat: mealDetail.totalFat,
      meals: mealDetail.meals.map((meal) => ({
        type: meal.type,
        calories: meal.calories,
        nutrition: { ...meal.nutrition },
        foods: meal.foods.map((food) => ({
          name: food.name,
          quantity: food.quantity,
          note: food.note,
        })),
      })),
    });
    setIsEditing(true);
    console.log('✅ [MealPlanView] isEditing set to true');
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditData(null);
    setOriginalData(null);
  };

  const handleSave = () => {
    if (!editData || !selectedDay || !dayMeals[0]) return;

    updateMealPlan(
      {
        userId,
        dayNumber: selectedDay,
        checkpointNumber: dayMeals[0].checkpointNumber,
        data: editData,
      },
      {
        onSuccess: () => {
          setIsEditing(false);
          setEditData(null);
          setOriginalData(null);
        },
      }
    );
  };

  const handleTotalChange = (field: keyof Pick<UpdateMealPlanRequest, 'totalCalories' | 'totalProtein' | 'totalCarbs' | 'totalFat'>, value: string) => {
    if (!editData) return;
    const numValue = parseFloat(value) || 0;
    setEditData((prev) => ({
      ...prev!,
      [field]: numValue,
    }));
  };

  const handleMealChange = (mealIndex: number, field: 'type' | 'calories', value: string | number) => {
    if (!editData) return;
    setEditData((prev) => ({
      ...prev!,
      meals: prev!.meals.map((meal, idx) =>
        idx === mealIndex ? { ...meal, [field]: value } : meal
      ),
    }));
  };

  const handleNutritionChange = (mealIndex: number, field: keyof UpdateMealPlanRequest['meals'][0]['nutrition'], value: string) => {
    if (!editData) return;
    const numValue = parseFloat(value) || 0;
    setEditData((prev) => ({
      ...prev!,
      meals: prev!.meals.map((meal, idx) =>
        idx === mealIndex
          ? {
              ...meal,
              nutrition: {
                ...meal.nutrition,
                [field]: numValue,
              },
            }
          : meal
      ),
    }));
  };

  const handleFoodChange = (mealIndex: number, foodIndex: number, field: 'name' | 'quantity' | 'note', value: string) => {
    if (!editData) return;
    setEditData((prev) => ({
      ...prev!,
      meals: prev!.meals.map((meal, idx) =>
        idx === mealIndex
          ? {
              ...meal,
              foods: meal.foods.map((food, fIdx) =>
                fIdx === foodIndex ? { ...food, [field]: field === 'note' ? (value || null) : value } : food
              ),
            }
          : meal
      ),
    }));
  };

  const handleAddFood = (mealIndex: number) => {
    if (!editData) return;
    setEditData((prev) => ({
      ...prev!,
      meals: prev!.meals.map((meal, idx) =>
        idx === mealIndex
          ? {
              ...meal,
              foods: [...meal.foods, { name: '', quantity: '', note: null }],
            }
          : meal
      ),
    }));
  };

  const handleRemoveFood = (mealIndex: number, foodIndex: number) => {
    if (!editData) return;
    setEditData((prev) => ({
      ...prev!,
      meals: prev!.meals.map((meal, idx) =>
        idx === mealIndex
          ? {
              ...meal,
              foods: meal.foods.filter((_, fIdx) => fIdx !== foodIndex),
            }
          : meal
      ),
    }));
  };


  return (
    <div className="flex flex-col gap-6">
      {/* Day Selector */}
      <Card>
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[280px]">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
              <Icon name="mdi:calendar-today" size={20} className="text-[var(--primary)]" />
            </div>
            <div className="flex items-center gap-3 flex-1">
              <span className="text-sm font-medium text-[var(--text)] whitespace-nowrap">Chọn ngày:</span>
              <Select
                value={selectedDay}
                onChange={(value) => setSelectedDay(value as number)}
                className="flex-1 min-w-[140px]"
                options={sortedDays.map((day) => ({
                  label: `Ngày ${day}`,
                  value: day,
                }))}
              />
              <span className="text-sm font-medium text-[var(--text-secondary)] whitespace-nowrap">
                {currentIndex + 1}/{sortedDays.length}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevious}
              disabled={!hasPrevious}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary)]/30 transition-all"
              aria-label="Ngày trước"
            >
              <Icon name="mdi:chevron-left" size={22} className="text-[var(--text)]" />
            </button>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="flex items-center justify-center w-10 h-10 rounded-lg border border-[var(--border)] bg-[var(--bg)] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--bg-tertiary)] hover:border-[var(--primary)]/30 transition-all"
              aria-label="Ngày sau"
            >
              <Icon name="mdi:chevron-right" size={22} className="text-[var(--text)]" />
            </button>
          </div>
        </div>
      </Card>

      {/* Day Content */}
      <Card className="overflow-hidden">
        {/* Day Header */}
        <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b-2 border-[var(--border)]">
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[var(--primary)]/10">
              <Icon name="mdi:calendar-today" size={20} className="text-[var(--primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-[var(--text)]">Ngày {selectedDay}</h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                Checkpoint {dayMeals[0]?.checkpointNumber}
              </p>
            </div>
          </div>
          {!isEditing ? (
            <Button
              onClick={handleStartEdit}
              className="flex items-center gap-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
            >
              <Icon name="mdi:pencil" size={16} />
              Chỉnh sửa
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                onClick={handleCancelEdit}
                disabled={isUpdating}
                variant="secondary"
                className="flex items-center gap-2"
              >
                Hủy
              </Button>
              <Button
                onClick={handleSave}
                loading={isUpdating}
                className="flex items-center gap-2 bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90"
              >
                <Icon name="mdi:check" size={16} />
                Lưu
              </Button>
            </div>
          )}
        </div>

        <div className="mb-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="rounded-xl border-2 border-[var(--border)] bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg)] p-4 hover:border-[var(--primary)]/30 transition-colors">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2">
                Tổng Calories
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  value={String(displayData.totalCalories)}
                  onChange={(e) => handleTotalChange('totalCalories', e.target.value)}
                  className="text-2xl font-bold w-full"
                />
              ) : (
                <div className="text-2xl font-bold text-[var(--text)]">{displayData.totalCalories}</div>
              )}
              <div className="text-xs text-[var(--text-secondary)] mt-1">kcal</div>
            </div>
            <div className="rounded-xl border-2 border-[var(--border)] bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg)] p-4 hover:border-[var(--primary)]/30 transition-colors">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2">
                Protein
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  value={String(displayData.totalProtein)}
                  onChange={(e) => handleTotalChange('totalProtein', e.target.value)}
                  className="text-2xl font-bold w-full"
                />
              ) : (
                <div className="text-2xl font-bold text-[var(--text)]">{displayData.totalProtein}</div>
              )}
              <div className="text-xs text-[var(--text-secondary)] mt-1">grams</div>
            </div>
            <div className="rounded-xl border-2 border-[var(--border)] bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg)] p-4 hover:border-[var(--primary)]/30 transition-colors">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2">
                Carbs
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  value={String(displayData.totalCarbs)}
                  onChange={(e) => handleTotalChange('totalCarbs', e.target.value)}
                  className="text-2xl font-bold w-full"
                />
              ) : (
                <div className="text-2xl font-bold text-[var(--text)]">{displayData.totalCarbs}</div>
              )}
              <div className="text-xs text-[var(--text-secondary)] mt-1">grams</div>
            </div>
            <div className="rounded-xl border-2 border-[var(--border)] bg-gradient-to-br from-[var(--bg-tertiary)] to-[var(--bg)] p-4 hover:border-[var(--primary)]/30 transition-colors">
              <div className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] mb-2">
                Fat
              </div>
              {isEditing ? (
                <Input
                  type="number"
                  value={String(displayData.totalFat)}
                  onChange={(e) => handleTotalChange('totalFat', e.target.value)}
                  className="text-2xl font-bold w-full"
                />
              ) : (
                <div className="text-2xl font-bold text-[var(--text)]">{displayData.totalFat}</div>
              )}
              <div className="text-xs text-[var(--text-secondary)] mt-1">grams</div>
            </div>
          </div>

          {/* Meals List */}
          <div className="flex flex-col gap-4">
            {displayData.meals.map((meal, mealIdx) => (
              <div
                key={mealIdx}
                className="rounded-xl border-2 border-[var(--border)] bg-[var(--bg)] p-5 hover:border-[var(--primary)]/30 transition-colors"
              >
                {/* Meal Header */}
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--border)]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--primary)]/10">
                      <Icon name="mdi:food" size={18} className="text-[var(--primary)]" />
                    </div>
                    {isEditing ? (
                      <Input
                        value={meal.type}
                        onChange={(e) => handleMealChange(mealIdx, 'type', e.target.value)}
                        placeholder="Loại bữa ăn"
                        className="text-base font-semibold w-48"
                      />
                    ) : (
                      <span className="text-base font-semibold text-[var(--text)]">{meal.type}</span>
                    )}
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-[var(--primary)]/10">
                    {isEditing ? (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          value={String(meal.calories)}
                          onChange={(e) => handleMealChange(mealIdx, 'calories', parseFloat(e.target.value) || 0)}
                          className="w-20 text-right text-sm font-semibold"
                        />
                        <span className="text-sm font-semibold text-[var(--primary)]">kcal</span>
                      </div>
                    ) : (
                      <span className="text-sm font-semibold text-[var(--primary)]">{meal.calories} kcal</span>
                    )}
                  </div>
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-secondary)] mb-1">Carbs</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={String(meal.nutrition.carbs)}
                        onChange={(e) => handleNutritionChange(mealIdx, 'carbs', e.target.value)}
                        className="text-sm font-semibold w-full"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[var(--text)]">{meal.nutrition.carbs}g</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-secondary)] mb-1">Protein</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={String(meal.nutrition.protein)}
                        onChange={(e) => handleNutritionChange(mealIdx, 'protein', e.target.value)}
                        className="text-sm font-semibold w-full"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[var(--text)]">{meal.nutrition.protein}g</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-secondary)] mb-1">Fat</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={String(meal.nutrition.fat)}
                        onChange={(e) => handleNutritionChange(mealIdx, 'fat', e.target.value)}
                        className="text-sm font-semibold w-full"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[var(--text)]">{meal.nutrition.fat}g</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-secondary)] mb-1">Fiber</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={String(meal.nutrition.fiber)}
                        onChange={(e) => handleNutritionChange(mealIdx, 'fiber', e.target.value)}
                        className="text-sm font-semibold w-full"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[var(--text)]">{meal.nutrition.fiber}g</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xs text-[var(--text-secondary)] mb-1">Sugar</span>
                    {isEditing ? (
                      <Input
                        type="number"
                        value={String(meal.nutrition.sugar)}
                        onChange={(e) => handleNutritionChange(mealIdx, 'sugar', e.target.value)}
                        className="text-sm font-semibold w-full"
                      />
                    ) : (
                      <span className="text-sm font-semibold text-[var(--text)]">{meal.nutrition.sugar}g</span>
                    )}
                  </div>
                </div>

                {/* Foods List */}
                <div className="mt-4 pt-4 border-t-2 border-[var(--border)]">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Icon name="mdi:food-variant" size={16} className="text-[var(--text-secondary)]" />
                      <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">
                        Thực phẩm
                      </span>
                    </div>
                    {isEditing && (
                      <Button
                        onClick={() => handleAddFood(mealIdx)}
                        size="sm"
                        variant="secondary"
                        className="text-xs"
                      >
                        <Icon name="mdi:plus" size={14} />
                        Thêm
                      </Button>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    {meal.foods.length > 0 ? (
                      meal.foods.map((food, foodIdx) => (
                        <div
                          key={foodIdx}
                          className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-[var(--bg-tertiary)]/50 hover:bg-[var(--bg-tertiary)] transition-colors"
                        >
                          {isEditing ? (
                            <>
                              <Select
                                value={food.name || undefined}
                                onChange={(value) => {
                                  if (!value) {
                                    handleFoodChange(mealIdx, foodIdx, 'name', '');
                                    return;
                                  }
                                  const selectedOption = ingredientOptions.find((opt) => opt.value === value);
                                  if (selectedOption) {
                                    handleFoodChange(mealIdx, foodIdx, 'name', selectedOption.value);
                                    // Auto-fill quantity with base weight if available and quantity is empty
                                    if (selectedOption.food?.weight && !food.quantity) {
                                      handleFoodChange(mealIdx, foodIdx, 'quantity', selectedOption.food.weight);
                                    }
                                  } else {
                                    // Fallback: user might have typed a custom name
                                    handleFoodChange(mealIdx, foodIdx, 'name', value as string);
                                  }
                                }}
                                onSearch={setIngredientSearchTerm}
                                showSearch
                                filterOption={false}
                                placeholder="Tìm kiếm thực phẩm..."
                                className="flex-1 min-w-[200px] text-sm"
                                loading={isLoadingIngredients}
                                notFoundContent={
                                  ingredientSearchTerm.length > 0 && ingredientSearchTerm.length < 2
                                    ? 'Nhập ít nhất 2 ký tự để tìm kiếm'
                                    : isLoadingIngredients
                                    ? 'Đang tải...'
                                    : 'Không tìm thấy thực phẩm'
                                }
                                options={ingredientOptions}
                                allowClear
                              />
                              <Input
                                value={food.quantity}
                                onChange={(e) => handleFoodChange(mealIdx, foodIdx, 'quantity', e.target.value)}
                                placeholder="Số lượng"
                                className="w-24 text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => handleRemoveFood(mealIdx, foodIdx)}
                                className="flex items-center justify-center w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg)] hover:bg-red-50 hover:border-red-300 transition-colors"
                              >
                                <Icon name="mdi:delete-outline" size={18} className="text-red-500" />
                              </button>
                            </>
                          ) : (
                            <>
                              <span className="text-sm font-medium text-[var(--text)] flex-1">{food.name}</span>
                              <span className="text-sm font-semibold text-[var(--primary)]">{food.quantity}</span>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-[var(--text-secondary)] py-2 text-center">
                        {isEditing ? 'Chưa có thực phẩm. Nhấn "Thêm" để thêm mới.' : 'Chưa có thực phẩm'}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

