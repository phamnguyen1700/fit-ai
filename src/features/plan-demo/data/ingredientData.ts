import type { Ingredient } from '@/types/plan';

export const ingredients: Ingredient[] = [
  // Protein sources
  {
    id: 'chicken-breast',
    name: 'Ức gà',
    caloriesPer100g: 165,
    carbsPer100g: 0,
    proteinPer100g: 31,
    fatPer100g: 3.6,
  },
  {
    id: 'beef',
    name: 'Thịt bò',
    caloriesPer100g: 250,
    carbsPer100g: 0,
    proteinPer100g: 26,
    fatPer100g: 15,
  },
  {
    id: 'pork',
    name: 'Thịt heo',
    caloriesPer100g: 242,
    carbsPer100g: 0,
    proteinPer100g: 27,
    fatPer100g: 14,
  },
  {
    id: 'salmon',
    name: 'Cá hồi',
    caloriesPer100g: 208,
    carbsPer100g: 0,
    proteinPer100g: 20,
    fatPer100g: 13,
  },
  {
    id: 'tuna',
    name: 'Cá ngừ',
    caloriesPer100g: 144,
    carbsPer100g: 0,
    proteinPer100g: 30,
    fatPer100g: 1,
  },
  {
    id: 'eggs',
    name: 'Trứng gà',
    caloriesPer100g: 155,
    carbsPer100g: 1.1,
    proteinPer100g: 13,
    fatPer100g: 11,
  },
  {
    id: 'tofu',
    name: 'Đậu hũ',
    caloriesPer100g: 76,
    carbsPer100g: 1.9,
    proteinPer100g: 8,
    fatPer100g: 4.8,
  },
  
  // Carbs sources
  {
    id: 'white-rice',
    name: 'Cơm trắng',
    caloriesPer100g: 130,
    carbsPer100g: 28,
    proteinPer100g: 2.7,
    fatPer100g: 0.3,
  },
  {
    id: 'brown-rice',
    name: 'Cơm gạo lứt',
    caloriesPer100g: 111,
    carbsPer100g: 23,
    proteinPer100g: 2.6,
    fatPer100g: 0.9,
  },
  {
    id: 'sweet-potato',
    name: 'Khoai lang',
    caloriesPer100g: 86,
    carbsPer100g: 20,
    proteinPer100g: 1.6,
    fatPer100g: 0.1,
  },
  {
    id: 'oats',
    name: 'Yến mạch',
    caloriesPer100g: 389,
    carbsPer100g: 66,
    proteinPer100g: 17,
    fatPer100g: 7,
  },
  {
    id: 'bread',
    name: 'Bánh mì',
    caloriesPer100g: 265,
    carbsPer100g: 49,
    proteinPer100g: 9,
    fatPer100g: 3.2,
  },
  {
    id: 'pasta',
    name: 'Mì Ý',
    caloriesPer100g: 131,
    carbsPer100g: 25,
    proteinPer100g: 5,
    fatPer100g: 1.1,
  },
  
  // Vegetables
  {
    id: 'broccoli',
    name: 'Bông cải xanh',
    caloriesPer100g: 34,
    carbsPer100g: 7,
    proteinPer100g: 2.8,
    fatPer100g: 0.4,
  },
  {
    id: 'spinach',
    name: 'Rau bina',
    caloriesPer100g: 23,
    carbsPer100g: 3.6,
    proteinPer100g: 2.9,
    fatPer100g: 0.4,
  },
  {
    id: 'tomato',
    name: 'Cà chua',
    caloriesPer100g: 18,
    carbsPer100g: 3.9,
    proteinPer100g: 0.9,
    fatPer100g: 0.2,
  },
  {
    id: 'carrot',
    name: 'Cà rốt',
    caloriesPer100g: 41,
    carbsPer100g: 10,
    proteinPer100g: 0.9,
    fatPer100g: 0.2,
  },
  {
    id: 'cucumber',
    name: 'Dưa chuột',
    caloriesPer100g: 16,
    carbsPer100g: 3.6,
    proteinPer100g: 0.7,
    fatPer100g: 0.1,
  },
  
  // Fruits
  {
    id: 'banana',
    name: 'Chuối',
    caloriesPer100g: 89,
    carbsPer100g: 23,
    proteinPer100g: 1.1,
    fatPer100g: 0.3,
  },
  {
    id: 'apple',
    name: 'Táo',
    caloriesPer100g: 52,
    carbsPer100g: 14,
    proteinPer100g: 0.3,
    fatPer100g: 0.2,
  },
  {
    id: 'orange',
    name: 'Cam',
    caloriesPer100g: 47,
    carbsPer100g: 12,
    proteinPer100g: 0.9,
    fatPer100g: 0.1,
  },
  
  // Fats/Oils
  {
    id: 'olive-oil',
    name: 'Dầu olive',
    caloriesPer100g: 884,
    carbsPer100g: 0,
    proteinPer100g: 0,
    fatPer100g: 100,
  },
  {
    id: 'avocado',
    name: 'Bơ',
    caloriesPer100g: 160,
    carbsPer100g: 9,
    proteinPer100g: 2,
    fatPer100g: 15,
  },
  {
    id: 'almonds',
    name: 'Hạnh nhân',
    caloriesPer100g: 579,
    carbsPer100g: 22,
    proteinPer100g: 21,
    fatPer100g: 50,
  },
  
  // Dairy
  {
    id: 'milk',
    name: 'Sữa tươi',
    caloriesPer100g: 42,
    carbsPer100g: 5,
    proteinPer100g: 3.4,
    fatPer100g: 1,
  },
  {
    id: 'yogurt',
    name: 'Sữa chua',
    caloriesPer100g: 59,
    carbsPer100g: 3.6,
    proteinPer100g: 10,
    fatPer100g: 0.4,
  },
  {
    id: 'cheese',
    name: 'Phô mai',
    caloriesPer100g: 402,
    carbsPer100g: 1.3,
    proteinPer100g: 25,
    fatPer100g: 33,
  },
];

// Helper function to get ingredient by id
export const getIngredientById = (ingredientId: string): Ingredient | undefined => {
  return ingredients.find(ing => ing.id === ingredientId);
};

// Helper function to calculate nutrition for a given weight
export const calculateNutrition = (ingredientId: string, weight: number) => {
  const ingredient = getIngredientById(ingredientId);
  if (!ingredient) return null;
  
  const multiplier = weight / 100;
  return {
    calories: Math.round(ingredient.caloriesPer100g * multiplier),
    carbs: Math.round(ingredient.carbsPer100g * multiplier * 10) / 10,
    protein: Math.round(ingredient.proteinPer100g * multiplier * 10) / 10,
    fat: Math.round(ingredient.fatPer100g * multiplier * 10) / 10,
  };
};
