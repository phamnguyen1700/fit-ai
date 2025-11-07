import type { Meal, MealIngredient, MealPlanDetail } from '@/types/plan';

interface MealConfig {
  key: string;
  ingredientId: string;
  weight: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
}

const createIngredient = ({ key, ingredientId, weight, calories, carbs, protein, fat }: MealConfig): MealIngredient => ({
  id: key,
  ingredientId,
  weight,
  calories,
  carbs,
  protein,
  fat,
});

const buildMeal = (
  type: Meal['type'],
  name: string,
  items: MealConfig[],
  isCustom = false,
): Meal => {
  const ingredients = items.map(createIngredient);
  const totals = ingredients.reduce(
    (acc, item) => ({
      calories: acc.calories + item.calories,
      carbs: acc.carbs + item.carbs,
      protein: acc.protein + item.protein,
      fat: acc.fat + item.fat,
    }),
    { calories: 0, carbs: 0, protein: 0, fat: 0 },
  );

  return {
    type: isCustom ? 'custom' : type,
    customName: isCustom ? name : undefined,
    ingredients,
    totalCalories: Math.round(totals.calories),
    totalCarbs: Math.round(totals.carbs * 10) / 10,
    totalProtein: Math.round(totals.protein * 10) / 10,
    totalFat: Math.round(totals.fat * 10) / 10,
  };
};

const plan1Menus: MealPlanDetail['menus'] = [
  {
    menuNumber: 1,
    meals: [
      buildMeal('breakfast', 'Bữa sáng', [
        { key: 'plan1-m1-bf-oats', ingredientId: 'rolled-oats', weight: 60, calories: 230, carbs: 38, protein: 8, fat: 4.5 },
        { key: 'plan1-m1-bf-banana', ingredientId: 'banana', weight: 100, calories: 95, carbs: 24, protein: 1.2, fat: 0.3 },
        { key: 'plan1-m1-bf-almond', ingredientId: 'almond', weight: 15, calories: 85, carbs: 3.2, protein: 3.2, fat: 7.4 },
      ]),
      buildMeal('lunch', 'Bữa trưa', [
        { key: 'plan1-m1-lu-chicken', ingredientId: 'chicken-breast', weight: 150, calories: 270, carbs: 0, protein: 48, fat: 6 },
        { key: 'plan1-m1-lu-quinoa', ingredientId: 'quinoa', weight: 120, calories: 190, carbs: 34, protein: 7, fat: 3.5 },
        { key: 'plan1-m1-lu-avocado', ingredientId: 'avocado', weight: 70, calories: 112, carbs: 6, protein: 1.4, fat: 10.4 },
      ]),
      buildMeal('dinner', 'Bữa tối', [
        { key: 'plan1-m1-di-salmon', ingredientId: 'salmon', weight: 130, calories: 280, carbs: 0, protein: 25, fat: 19 },
        { key: 'plan1-m1-di-sweetpotato', ingredientId: 'sweet-potato', weight: 150, calories: 135, carbs: 31, protein: 2.5, fat: 0.3 },
        { key: 'plan1-m1-di-broccoli', ingredientId: 'broccoli', weight: 90, calories: 35, carbs: 7, protein: 2.7, fat: 0.4 },
      ]),
      buildMeal('custom', 'Bữa phụ chiều', [
        { key: 'plan1-m1-sn-yogurt', ingredientId: 'greek-yogurt', weight: 120, calories: 120, carbs: 9, protein: 12, fat: 4 },
        { key: 'plan1-m1-sn-berries', ingredientId: 'blueberries', weight: 60, calories: 34, carbs: 8.7, protein: 0.4, fat: 0.2 },
      ], true),
    ],
  },
  {
    menuNumber: 2,
    meals: [
      buildMeal('breakfast', 'Bữa sáng', [
        { key: 'plan1-m2-bf-eggs', ingredientId: 'eggs', weight: 120, calories: 180, carbs: 2, protein: 15, fat: 12 },
        { key: 'plan1-m2-bf-toast', ingredientId: 'wholegrain-bread', weight: 70, calories: 190, carbs: 32, protein: 7, fat: 3 },
        { key: 'plan1-m2-bf-avocado', ingredientId: 'avocado', weight: 60, calories: 96, carbs: 5, protein: 1, fat: 9 },
      ]),
      buildMeal('lunch', 'Bữa trưa', [
        { key: 'plan1-m2-lu-turkey', ingredientId: 'turkey-breast', weight: 140, calories: 210, carbs: 0, protein: 42, fat: 3 },
        { key: 'plan1-m2-lu-brownrice', ingredientId: 'brown-rice', weight: 150, calories: 165, carbs: 35, protein: 4, fat: 1.5 },
        { key: 'plan1-m2-lu-spinach', ingredientId: 'spinach', weight: 80, calories: 40, carbs: 5, protein: 4, fat: 0.5 },
      ]),
      buildMeal('dinner', 'Bữa tối', [
        { key: 'plan1-m2-di-tofu', ingredientId: 'tofu', weight: 160, calories: 180, carbs: 6, protein: 18, fat: 10 },
        { key: 'plan1-m2-di-brownrice', ingredientId: 'brown-rice', weight: 130, calories: 143, carbs: 31, protein: 3.5, fat: 1.2 },
        { key: 'plan1-m2-di-kale', ingredientId: 'kale', weight: 70, calories: 35, carbs: 7, protein: 2.5, fat: 0.5 },
      ]),
      buildMeal('custom', 'Bữa phụ tối', [
        { key: 'plan1-m2-sn-chia', ingredientId: 'chia-pudding', weight: 100, calories: 150, carbs: 18, protein: 5, fat: 7 },
        { key: 'plan1-m2-sn-apple', ingredientId: 'apple', weight: 120, calories: 65, carbs: 17, protein: 0.3, fat: 0.2 },
      ], true),
    ],
  },
  {
    menuNumber: 3,
    meals: [
      buildMeal('breakfast', 'Bữa sáng', [
        { key: 'plan1-m3-bf-smoothie', ingredientId: 'green-smoothie', weight: 350, calories: 250, carbs: 52, protein: 6, fat: 3 },
        { key: 'plan1-m3-bf-walnut', ingredientId: 'walnut', weight: 20, calories: 130, carbs: 3, protein: 3, fat: 13 },
      ]),
      buildMeal('lunch', 'Bữa trưa', [
        { key: 'plan1-m3-lu-salmon', ingredientId: 'salmon', weight: 140, calories: 300, carbs: 0, protein: 27, fat: 20 },
        { key: 'plan1-m3-lu-quinoa', ingredientId: 'quinoa', weight: 100, calories: 160, carbs: 29, protein: 6, fat: 2.5 },
        { key: 'plan1-m3-lu-asparagus', ingredientId: 'asparagus', weight: 90, calories: 40, carbs: 5, protein: 4, fat: 0.5 },
      ]),
      buildMeal('dinner', 'Bữa tối', [
        { key: 'plan1-m3-di-chickpea', ingredientId: 'chickpea-stew', weight: 220, calories: 320, carbs: 44, protein: 14, fat: 10 },
        { key: 'plan1-m3-di-greens', ingredientId: 'mixed-greens', weight: 100, calories: 45, carbs: 9, protein: 3, fat: 0.6 },
      ]),
      buildMeal('custom', 'Bữa phụ sáng', [
        { key: 'plan1-m3-sn-orange', ingredientId: 'orange', weight: 140, calories: 70, carbs: 18, protein: 1.4, fat: 0.2 },
      ], true),
    ],
  },
];

const plan2Menus: MealPlanDetail['menus'] = [
  {
    menuNumber: 1,
    meals: [
      buildMeal('breakfast', 'Bữa sáng', [
        { key: 'plan2-m1-bf-omelette', ingredientId: 'egg-omelette', weight: 180, calories: 250, carbs: 3, protein: 18, fat: 18 },
        { key: 'plan2-m1-bf-avocado', ingredientId: 'avocado', weight: 80, calories: 128, carbs: 7, protein: 1.6, fat: 12 },
      ]),
      buildMeal('lunch', 'Bữa trưa', [
        { key: 'plan2-m1-lu-beef', ingredientId: 'lean-beef', weight: 160, calories: 320, carbs: 0, protein: 34, fat: 18 },
        { key: 'plan2-m1-lu-zoodles', ingredientId: 'zucchini-noodles', weight: 150, calories: 45, carbs: 8, protein: 3, fat: 0.5 },
        { key: 'plan2-m1-lu-pesto', ingredientId: 'pesto-sauce', weight: 40, calories: 140, carbs: 2, protein: 4, fat: 14 },
      ]),
      buildMeal('dinner', 'Bữa tối', [
        { key: 'plan2-m1-di-shrimp', ingredientId: 'shrimp', weight: 160, calories: 190, carbs: 2, protein: 36, fat: 3 },
        { key: 'plan2-m1-di-cauliflower', ingredientId: 'cauliflower-rice', weight: 180, calories: 70, carbs: 10, protein: 5, fat: 1 },
      ]),
      buildMeal('custom', 'Bữa phụ chiều', [
        { key: 'plan2-m1-sn-nuts', ingredientId: 'mixed-nuts', weight: 35, calories: 210, carbs: 8, protein: 6, fat: 18 },
      ], true),
    ],
  },
  {
    menuNumber: 2,
    meals: [
      buildMeal('breakfast', 'Bữa sáng', [
        { key: 'plan2-m2-bf-chia', ingredientId: 'chia-pudding', weight: 150, calories: 230, carbs: 18, protein: 8, fat: 12 },
        { key: 'plan2-m2-bf-berries', ingredientId: 'berries', weight: 80, calories: 45, carbs: 11, protein: 1.2, fat: 0.5 },
      ]),
      buildMeal('lunch', 'Bữa trưa', [
        { key: 'plan2-m2-lu-salmon', ingredientId: 'salmon', weight: 150, calories: 320, carbs: 0, protein: 30, fat: 22 },
        { key: 'plan2-m2-lu-salad', ingredientId: 'keto-salad', weight: 180, calories: 160, carbs: 8, protein: 6, fat: 12 },
      ]),
      buildMeal('dinner', 'Bữa tối', [
        { key: 'plan2-m2-di-chicken', ingredientId: 'chicken-thigh', weight: 170, calories: 310, carbs: 0, protein: 27, fat: 22 },
        { key: 'plan2-m2-di-broccoli', ingredientId: 'broccoli', weight: 120, calories: 45, carbs: 9, protein: 4, fat: 0.6 },
      ]),
      buildMeal('custom', 'Bữa phụ tối', [
        { key: 'plan2-m2-sn-cheese', ingredientId: 'cheddar-cheese', weight: 40, calories: 160, carbs: 1, protein: 10, fat: 13 },
        { key: 'plan2-m2-sn-celery', ingredientId: 'celery', weight: 60, calories: 12, carbs: 3, protein: 0.5, fat: 0.1 },
      ], true),
    ],
  },
];

const plan3Menus: MealPlanDetail['menus'] = [
  {
    menuNumber: 1,
    meals: [
      buildMeal('breakfast', 'Bữa sáng', [
        { key: 'plan3-m1-bf-congee', ingredientId: 'brown-rice-congee', weight: 300, calories: 210, carbs: 45, protein: 6, fat: 2 },
        { key: 'plan3-m1-bf-egg', ingredientId: 'boiled-egg', weight: 60, calories: 80, carbs: 0.6, protein: 6.5, fat: 5 },
      ]),
      buildMeal('lunch', 'Bữa trưa', [
        { key: 'plan3-m1-lu-fish', ingredientId: 'tilapia', weight: 150, calories: 200, carbs: 0, protein: 34, fat: 6 },
        { key: 'plan3-m1-lu-rice', ingredientId: 'steamed-rice', weight: 180, calories: 230, carbs: 50, protein: 4, fat: 0.6 },
        { key: 'plan3-m1-lu-veggies', ingredientId: 'steamed-veggies', weight: 150, calories: 70, carbs: 14, protein: 4, fat: 1 },
      ]),
      buildMeal('dinner', 'Bữa tối', [
        { key: 'plan3-m1-di-chicken', ingredientId: 'grilled-chicken', weight: 150, calories: 260, carbs: 2, protein: 32, fat: 12 },
        { key: 'plan3-m1-di-potato', ingredientId: 'baked-potato', weight: 170, calories: 150, carbs: 34, protein: 4, fat: 0.2 },
        { key: 'plan3-m1-di-salad', ingredientId: 'garden-salad', weight: 120, calories: 60, carbs: 12, protein: 3, fat: 2 },
      ]),
      buildMeal('custom', 'Bữa phụ sáng', [
        { key: 'plan3-m1-sn-soymilk', ingredientId: 'soy-milk', weight: 200, calories: 130, carbs: 15, protein: 9, fat: 4 },
      ], true),
      buildMeal('custom', 'Bữa phụ tối', [
        { key: 'plan3-m1-sn-yogurt', ingredientId: 'yogurt', weight: 150, calories: 140, carbs: 20, protein: 7, fat: 4 },
      ], true),
    ],
  },
  {
    menuNumber: 2,
    meals: [
      buildMeal('breakfast', 'Bữa sáng', [
        { key: 'plan3-m2-bf-noodles', ingredientId: 'wholegrain-noodles', weight: 250, calories: 260, carbs: 52, protein: 10, fat: 3 },
        { key: 'plan3-m2-bf-tofu', ingredientId: 'tofu', weight: 100, calories: 110, carbs: 3, protein: 11, fat: 6 },
      ]),
      buildMeal('lunch', 'Bữa trưa', [
        { key: 'plan3-m2-lu-pork', ingredientId: 'lean-pork', weight: 160, calories: 280, carbs: 0, protein: 32, fat: 16 },
        { key: 'plan3-m2-lu-soup', ingredientId: 'vegetable-soup', weight: 240, calories: 110, carbs: 18, protein: 6, fat: 3 },
        { key: 'plan3-m2-lu-rice', ingredientId: 'steamed-rice', weight: 160, calories: 205, carbs: 45, protein: 4, fat: 0.5 },
      ]),
      buildMeal('dinner', 'Bữa tối', [
        { key: 'plan3-m2-di-fish', ingredientId: 'mackerel', weight: 140, calories: 290, carbs: 0, protein: 28, fat: 20 },
        { key: 'plan3-m2-di-soup', ingredientId: 'miso-soup', weight: 220, calories: 110, carbs: 12, protein: 7, fat: 4 },
        { key: 'plan3-m2-di-greens', ingredientId: 'bok-choy', weight: 130, calories: 35, carbs: 5, protein: 3, fat: 0.5 },
      ]),
      buildMeal('custom', 'Bữa phụ chiều', [
        { key: 'plan3-m2-sn-fruit', ingredientId: 'seasonal-fruits', weight: 180, calories: 120, carbs: 27, protein: 2, fat: 0.5 },
      ], true),
    ],
  },
];

export const mockMealPlanDetails: MealPlanDetail[] = [
  {
    id: 'meal-plan-healthy',
    planName: 'Chế độ ăn healthy',
    goal: 'Ăn sạch, tăng cường sức khỏe',
    totalCaloriesPerDay: 1800,
    totalMenus: plan1Menus.length,
    menus: plan1Menus,
    description: 'Thực đơn dinh dưỡng cân bằng với đủ dưỡng chất cho cả tuần.',
    createdAt: '2025-10-28T08:00:00Z',
  },
  {
    id: 'meal-plan-keto',
    planName: 'Chế độ ăn kiêng Keto',
    goal: 'Giảm mỡ nhanh mà vẫn giữ cơ',
    totalCaloriesPerDay: 1600,
    totalMenus: plan2Menus.length,
    menus: plan2Menus,
    description: 'Kế hoạch ăn Keto với tỷ lệ chất béo cao và carb thấp.',
    createdAt: '2025-11-02T09:30:00Z',
  },
  {
    id: 'meal-plan-balanced',
    planName: 'Ăn uống cân bằng',
    goal: 'Duy trì cân nặng lành mạnh',
    totalCaloriesPerDay: 2000,
    totalMenus: plan3Menus.length,
    menus: plan3Menus,
    description: 'Thực đơn phong phú phù hợp với người cần nhiều năng lượng hoạt động.',
    createdAt: '2025-10-20T07:15:00Z',
  },
];
