'use client';

import React, { useState } from 'react';
import { Modal, Button, Flex, Tabs, Select } from '@/shared/ui';
import { Form, InputNumber, Divider, Table, Input } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { CreateMealPlanFormData, DayMeal, Meal, MealIngredient } from '@/types/plan';
import { useUpdateMealDemoAll } from '@/tanstack/hooks/mealdemo';
import { useSearchMealIngredients } from '@/tanstack/hooks/mealingredient';
import type { UpdateMealDemoAllPayload } from '@/types/mealdemo';
import toast from 'react-hot-toast';

const DEFAULT_MEAL_KEYS = ['breakfast', 'lunch', 'dinner'] as const;

type DefaultMealType = typeof DEFAULT_MEAL_KEYS[number];

const DEFAULT_MEAL_DISPLAY_NAMES: Record<DefaultMealType, string> = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa',
  dinner: 'Bữa tối',
};

const DEFAULT_MEAL_ICONS: Record<DefaultMealType, string> = {
  breakfast: '🌅',
  lunch: '☀️',
  dinner: '🌙',
};

interface NormalizedIngredient {
  id: string;
  name: string;
  baseWeight: number;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  url?: string;
}

const parseNumericValue = (value?: string) => {
  if (!value) return 0;
  const match = value.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
};

const parseWeightInGrams = (value?: string) => {
  if (!value) return 0;
  const match = value.match(/([\d.]+)\s*(g|gram|grams)?/i);
  return match ? parseFloat(match[1]) : 0;
};

interface MealDetailsModalProps {
  open: boolean;
  planData: CreateMealPlanFormData | null;
  mealDemoId: string | null;
  onCancel: () => void;
  onSubmit: (menus: DayMeal[]) => void;
}

interface MealTypeTab {
  key: string;
  label: React.ReactNode;
  isCustom?: boolean;
  displayName: string;
}

export const MealDetailsModal: React.FC<MealDetailsModalProps> = ({
  open,
  planData,
  mealDemoId,
  onCancel,
  onSubmit,
}) => {
  const [activeMenu, setActiveMenu] = useState<number>(1);
  const [activeMealType, setActiveMealType] = useState<string>('breakfast');
  const [menuMeals, setMenuMeals] = useState<Record<number, Record<string, MealIngredient[]>>>({});
  const [customMeals, setCustomMeals] = useState<Record<number, MealTypeTab[]>>({});
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [ingredientSearchTerm, setIngredientSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');
  const [ingredientLookup, setIngredientLookup] = useState<Record<string, NormalizedIngredient>>({});
  const [form] = Form.useForm();
  const { mutateAsync: updateMealDemoAll, isPending: isUpdating } = useUpdateMealDemoAll();
  const trimmedSearchTerm = ingredientSearchTerm.trim();

  React.useEffect(() => {
    const handle = setTimeout(() => {
      setDebouncedSearchTerm(trimmedSearchTerm);
    }, 400);

    return () => clearTimeout(handle);
  }, [trimmedSearchTerm]);

  const searchParams = React.useMemo(() => {
    if (debouncedSearchTerm.length < 2) {
      return undefined;
    }

    return {
      query: debouncedSearchTerm,
      pageNumber: 0,
      maxResults: 50,
    };
  }, [debouncedSearchTerm]);

  const baseParams = React.useMemo(
    () => ({
      pageNumber: 0,
      maxResults: 50,
    }),
    []
  );

  const {
    data: baseIngredientData,
    isFetching: isLoadingBaseIngredients,
  } = useSearchMealIngredients(baseParams, {
    enabled: open,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: ingredientSearchData,
    isFetching: isSearchingIngredients,
  } = useSearchMealIngredients(searchParams ?? baseParams, {
    enabled: open && Boolean(searchParams),
    staleTime: 60 * 1000,
  });

  React.useEffect(() => {
    if (baseIngredientData && !baseIngredientData.success) {
      // eslint-disable-next-line no-console
      console.error(
        'Tải danh sách nguyên liệu mặc định thất bại:',
        baseIngredientData.message
      );
    }
  }, [baseIngredientData]);

  React.useEffect(() => {
    if (ingredientSearchData && !ingredientSearchData.success) {
      // eslint-disable-next-line no-console
      console.error(
        'Tìm kiếm nguyên liệu thất bại:',
        ingredientSearchData.message,
        'Query:',
        searchParams?.query
      );
    }
  }, [ingredientSearchData, searchParams]);

  const baseFoods = baseIngredientData?.data?.foods ?? [];
  const searchFoods = ingredientSearchData?.data?.foods ?? [];

  const normalizedBaseFoods = React.useMemo(() => {
    return baseFoods.map((food) => ({
      id: food.food_id,
      name: food.food_name,
      baseWeight: parseWeightInGrams(food.weight) || 100,
      calories: parseNumericValue(food.calories),
      carbs: parseNumericValue(food.carbs),
      protein: parseNumericValue(food.protein),
      fat: parseNumericValue(food.fat),
      url: food.food_url,
    }));
  }, [baseFoods]);

  const normalizedSearchFoods = React.useMemo(() => {
    return searchFoods.map((food) => ({
      id: food.food_id,
      name: food.food_name,
      baseWeight: parseWeightInGrams(food.weight) || 100,
      calories: parseNumericValue(food.calories),
      carbs: parseNumericValue(food.carbs),
      protein: parseNumericValue(food.protein),
      fat: parseNumericValue(food.fat),
      url: food.food_url,
    }));
  }, [searchFoods]);

  React.useEffect(() => {
    const combinedFoods = [
      ...normalizedBaseFoods,
      ...normalizedSearchFoods,
    ];
    if (!combinedFoods.length) return;

    setIngredientLookup((prev) => {
      const updated = { ...prev };
      combinedFoods.forEach((food) => {
        updated[food.id] = food;
      });
      return updated;
    });
  }, [normalizedBaseFoods, normalizedSearchFoods]);

  // Reset when modal opens/closes
  React.useEffect(() => {
    if (open && planData) {
      setActiveMenu(1);
      setActiveMealType('breakfast');
      // Initialize empty meals for each menu
      const initialMeals: Record<number, Record<string, MealIngredient[]>> = {};
      const initialCustomMeals: Record<number, MealTypeTab[]> = {};
      for (let i = 1; i <= planData.totalMenus; i++) {
        initialMeals[i] = {
          breakfast: [],
          lunch: [],
          dinner: [],
        };
        initialCustomMeals[i] = [];
      }
      setMenuMeals(initialMeals);
      setCustomMeals(initialCustomMeals);
      setIngredientSearchTerm('');
      setDebouncedSearchTerm('');
      setIngredientLookup({});
    }
  }, [open, planData]);

  const handleAddIngredient = async () => {
    try {
      const values = await form.validateFields();
      const ingredientMeta = ingredientLookup[values.ingredientId];

      if (!ingredientMeta) {
        toast.error('Không tìm thấy dữ liệu dinh dưỡng cho nguyên liệu đã chọn.');
        return;
      }

      const baseWeight = ingredientMeta.baseWeight || 100;
      const multiplier = baseWeight > 0 ? values.weight / baseWeight : 1;
      const calories = Math.round(ingredientMeta.calories * multiplier);
      const carbs = Math.round(ingredientMeta.carbs * multiplier * 10) / 10;
      const protein = Math.round(ingredientMeta.protein * multiplier * 10) / 10;
      const fat = Math.round(ingredientMeta.fat * multiplier * 10) / 10;

      const newIngredient: MealIngredient = {
        id: `${Date.now()}-${Math.random()}`,
        ingredientId: values.ingredientId,
        weight: values.weight,
        calories: Number.isFinite(calories) ? calories : 0,
        carbs: Number.isFinite(carbs) ? carbs : 0,
        protein: Number.isFinite(protein) ? protein : 0,
        fat: Number.isFinite(fat) ? fat : 0,
      };

      setMenuMeals(prev => {
        const updatedMeals = { ...prev };
        if (!updatedMeals[activeMenu]) {
          updatedMeals[activeMenu] = {};
        }
        if (!updatedMeals[activeMenu][activeMealType]) {
          updatedMeals[activeMenu][activeMealType] = [];
        }
        updatedMeals[activeMenu][activeMealType] = [
          ...updatedMeals[activeMenu][activeMealType],
          newIngredient
        ];
        return updatedMeals;
      });

      form.resetFields();
      setIngredientSearchTerm('');
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleAddMeal = () => {
    setIsAddingMeal(true);
    setNewMealName('');
  };

  const handleConfirmAddMeal = () => {
    if (!newMealName.trim()) return;

    const currentMeals = customMeals[activeMenu] || [];
    const mealNumber = currentMeals.length + 4;
    const newMealKey = `meal${mealNumber}`;
    const displayName = newMealName.trim();
    const label = (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>🍽️</span>
        {displayName}
      </span>
    );

    setCustomMeals(prev => {
      const prevMeals = prev[activeMenu] || [];
      const updatedMeals: MealTypeTab[] = [
        ...prevMeals,
        {
          key: newMealKey,
          label,
          isCustom: true,
          displayName,
        },
      ];

      return {
        ...prev,
        [activeMenu]: updatedMeals,
      };
    });

    // Initialize empty ingredient array for this meal
    setMenuMeals(prev => {
      const prevMeals = prev[activeMenu] || {};

      return {
        ...prev,
        [activeMenu]: {
          ...prevMeals,
          [newMealKey]: [],
        },
      };
    });

    // Switch to the newly added meal
    setActiveMealType(newMealKey);
    setIsAddingMeal(false);
    setNewMealName('');
  };

  const handleCancelAddMeal = () => {
    setIsAddingMeal(false);
    setNewMealName('');
  };

  const handleRemoveMeal = (mealKey: string) => {
    // Remove from custom meals
    setCustomMeals(prev => {
      const prevMeals = prev[activeMenu] || [];
      const updatedMeals = prevMeals.filter(meal => meal.key !== mealKey);

      return {
        ...prev,
        [activeMenu]: updatedMeals,
      };
    });

    // Remove meal data
    setMenuMeals(prev => {
      const updated = { ...prev };
      if (updated[activeMenu]) {
        delete updated[activeMenu][mealKey];
      }
      return updated;
    });

    // Switch to breakfast if we're removing the active meal
    if (activeMealType === mealKey) {
      setActiveMealType('breakfast');
    }
  };

  const handleRemoveIngredient = (ingredientId: string) => {
    setMenuMeals(prev => {
      const mealMap = prev[activeMenu] || {};
      const targetMeal = mealMap[activeMealType] || [];

      return {
        ...prev,
        [activeMenu]: {
          ...mealMap,
          [activeMealType]: targetMeal.filter(ing => ing.id !== ingredientId),
        },
      };
    });
  };

  const handleSubmitAll = async () => {
    if (!planData) return;

    if (!mealDemoId) {
      toast.error('Thiếu mã kế hoạch dinh dưỡng. Vui lòng tạo kế hoạch trước.');
      return;
    }

    const menus: DayMeal[] = Object.entries(menuMeals).map(([menuNum, mealTypes]) => {
      const menuNumber = parseInt(menuNum, 10);
      const customTabs = customMeals[menuNumber] || [];
      const customNameMap = new Map(customTabs.map((tab) => [tab.key, tab.displayName]));
      const mealKeys = [...DEFAULT_MEAL_KEYS, ...customTabs.map((tab) => tab.key)];

      const meals: Meal[] = mealKeys.map((key) => {
        const mealIngredients = mealTypes[key] || [];
        const totals = mealIngredients.reduce(
          (acc, ing) => {
            acc.calories += ing.calories;
            acc.carbs += ing.carbs;
            acc.protein += ing.protein;
            acc.fat += ing.fat;
            return acc;
          },
          { calories: 0, carbs: 0, protein: 0, fat: 0 }
        );

        const roundedTotals = {
          totalCalories: totals.calories,
          totalCarbs: Math.round(totals.carbs * 10) / 10,
          totalProtein: Math.round(totals.protein * 10) / 10,
          totalFat: Math.round(totals.fat * 10) / 10,
        };

        const isDefaultKey = (DEFAULT_MEAL_KEYS as readonly string[]).includes(key);

        if (isDefaultKey) {
          const mealType = key as DefaultMealType;
          return {
            type: mealType,
            ingredients: mealIngredients,
            ...roundedTotals,
          } as Meal;
        }

        const displayName = customNameMap.get(key) ?? key;

        return {
          type: 'custom',
          customName: displayName,
          ingredients: mealIngredients,
          ...roundedTotals,
        } satisfies Meal;
      });

      return {
        menuNumber,
        meals,
      };
    });

    const payload: UpdateMealDemoAllPayload = menus
      .map((menu) => ({
        menuNumber: menu.menuNumber,
        sessions: menu.meals
          .filter((meal) => meal.ingredients.length > 0)
          .map((meal) => {
            const sessionName = meal.type === 'custom'
              ? meal.customName || 'Bữa ăn'
              : DEFAULT_MEAL_DISPLAY_NAMES[meal.type];

            const ingredientsPayload = meal.ingredients.map((ingredient) => {
              const meta = ingredientLookup[ingredient.ingredientId];

              return {
                name: meta?.name || ingredient.ingredientId || 'Nguyên liệu',
                weight: ingredient.weight,
                calories: ingredient.calories,
                carbs: ingredient.carbs,
                protein: ingredient.protein,
                fat: ingredient.fat,
                foodId: ingredient.ingredientId || ingredient.id,
              };
            });

            return {
              sessionName,
              ingredients: ingredientsPayload,
            };
          }),
      }))
      .filter((menu) => menu.sessions.length > 0);

    if (payload.length === 0) {
      toast.error('Vui lòng thêm ít nhất một nguyên liệu trước khi lưu.');
      return;
    }

    try {
      const response = await updateMealDemoAll({ mealDemoId, payload });

      if (!response.success) {
        toast.error(response.message || 'Không thể lưu kế hoạch dinh dưỡng.');
        return;
      }

      onSubmit(menus);
    } catch (error) {
      console.error('Update meal demo failed:', error);
      toast.error('Đã xảy ra lỗi khi lưu kế hoạch. Vui lòng thử lại.');
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setMenuMeals({});
    setCustomMeals({});
    setIsAddingMeal(false);
    setNewMealName('');
    setIngredientSearchTerm('');
    setDebouncedSearchTerm('');
    onCancel();
  };

  if (!planData) return null;

  // Generate tabs for each menu
  const menuTabs = Array.from({ length: planData.totalMenus }, (_, i) => ({
    key: String(i + 1),
    label: `Menu ${i + 1}`,
  }));

  // Meal type tabs - only 3 default meals
  const mealTypeTabs: MealTypeTab[] = DEFAULT_MEAL_KEYS.map((key) => ({
    key,
    displayName: DEFAULT_MEAL_DISPLAY_NAMES[key],
    label: (
      <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <span>{DEFAULT_MEAL_ICONS[key]}</span>
        {DEFAULT_MEAL_DISPLAY_NAMES[key]}
      </span>
    ),
  }));

  // Add custom meals for this menu
  const currentMenuCustomMeals = customMeals[activeMenu] || [];
  const allMealTabs = [...mealTypeTabs, ...currentMenuCustomMeals];

  // Ingredient options
  const shouldShowSearchResults = Boolean(
    debouncedSearchTerm && debouncedSearchTerm.length >= 2
  );

  const displayFoods = shouldShowSearchResults
    ? normalizedSearchFoods
    : normalizedBaseFoods;

  const isLoadingIngredients = shouldShowSearchResults
    ? isSearchingIngredients
    : isLoadingBaseIngredients;

  const ingredientOptions = displayFoods.map((food) => ({
    label: `${food.name} (${food.baseWeight}g)`,
    value: food.id,
  }));

  // Current meal's ingredients
  const currentMealIngredients = menuMeals[activeMenu]?.[activeMealType] || [];

  // Calculate totals
  const totals = {
    calories: currentMealIngredients.reduce((sum, ing) => sum + ing.calories, 0),
    carbs: Math.round(currentMealIngredients.reduce((sum, ing) => sum + ing.carbs, 0) * 10) / 10,
    protein: Math.round(currentMealIngredients.reduce((sum, ing) => sum + ing.protein, 0) * 10) / 10,
    fat: Math.round(currentMealIngredients.reduce((sum, ing) => sum + ing.fat, 0) * 10) / 10,
  };

  // Table columns
  const columns = [
    {
      title: 'Nguyên liệu',
      dataIndex: 'ingredientId',
      key: 'ingredientId',
      render: (id: string) => ingredientLookup[id]?.name || id,
    },
    {
      title: 'Trọng lượng (g)',
      dataIndex: 'weight',
      key: 'weight',
      align: 'center' as const,
    },
    {
      title: 'Calories (kcal)',
      dataIndex: 'calories',
      key: 'calories',
      align: 'center' as const,
    },
    {
      title: 'Carbs (g)',
      dataIndex: 'carbs',
      key: 'carbs',
      align: 'center' as const,
    },
    {
      title: 'Protein (g)',
      dataIndex: 'protein',
      key: 'protein',
      align: 'center' as const,
    },
    {
      title: 'Fat (g)',
      dataIndex: 'fat',
      key: 'fat',
      align: 'center' as const,
    },
    {
      title: '',
      key: 'action',
      width: 60,
      render: (_: any, record: MealIngredient) => (
        <Button
          variant="ghost"
          size="sm"
          danger
          onClick={() => handleRemoveIngredient(record.id)}
        >
          <Icon name="mdi:delete-outline" size={18} />
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={`Chi tiết thực đơn: ${planData.planName}`}
      isOpen={open}
      onClose={handleCancel}
      size="xl"
    >
      {/* Menu Tabs */}
      <div style={{ marginBottom: 16 }}>
        <Tabs
          activeKey={String(activeMenu)}
          items={menuTabs}
          onChange={(key) => setActiveMenu(parseInt(key))}
          size="large"
        />
      </div>

      {/* Meal Type Tabs */}
      <div style={{ 
        marginBottom: 24,
        padding: '16px',
        backgroundColor: 'var(--bg-secondary)',
        borderRadius: 12,
        border: '1px solid var(--border-color)',
      }}>
        {!isAddingMeal ? (
          <Flex justify="space-between" align="flex-start" gap={16}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Tabs
                activeKey={activeMealType}
                items={allMealTabs}
                onChange={(key) => setActiveMealType(key)}
                size="large"
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddMeal}
              style={{
                width: 40,
                height: 40,
                padding: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Icon name="mdi:plus" size={24} />
            </Button>
          </Flex>
        ) : (
          <Flex gap={12} align="center">
            <div style={{ flex: 1 }}>
              <Input
                placeholder="Nhập tên bữa ăn (VD: Bữa phụ buổi sáng, Bữa xế...)"
                value={newMealName}
                onChange={(e) => setNewMealName(e.target.value)}
                onPressEnter={handleConfirmAddMeal}
                size="large"
                maxLength={30}
                autoFocus
                prefix={<span style={{ fontSize: 18 }}>🍽️</span>}
                style={{ 
                  fontSize: 16,
                }}
              />
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={handleConfirmAddMeal}
              disabled={!newMealName.trim()}
              icon={<Icon name="mdi:check" size={20} />}
              style={{ minWidth: 100 }}
            >
              Xác nhận
            </Button>
            <Button
              variant="ghost"
              size="md"
              onClick={handleCancelAddMeal}
              icon={<Icon name="mdi:close" size={20} />}
            >
              Hủy
            </Button>
          </Flex>
        )}
        
        {/* Show remove button for custom meals */}
        {!isAddingMeal && currentMenuCustomMeals.find(m => m.key === activeMealType) && (
          <div style={{ 
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px dashed var(--border-color)',
          }}>
            <Flex gap={8}>
              <Button
                variant="ghost"
                size="sm"
                danger
                onClick={() => handleRemoveMeal(activeMealType)}
                icon={<Icon name="mdi:delete-outline" size={16} />}
              >
                Xóa bữa này
              </Button>
            </Flex>
          </div>
        )}
      </div>

      {/* Add Ingredient Form */}
      <div style={{ marginBottom: 24, padding: 16, backgroundColor: 'var(--bg-secondary)', borderRadius: 8 }}>
        <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 600 }}>
          Thêm nguyên liệu
        </h4>

        <Form form={form} layout="inline" style={{ gap: 12, flexWrap: 'wrap' }}>
          <Form.Item
            name="ingredientId"
            rules={[{ required: true, message: 'Chọn nguyên liệu' }]}
            style={{ flex: '1 1 300px', minWidth: 200 }}
          >
            <Select
              placeholder="Chọn nguyên liệu"
              size="large"
              showSearch
              filterOption={false}
              options={ingredientOptions}
              onSearch={setIngredientSearchTerm}
              loading={isLoadingIngredients}
              notFoundContent={
                trimmedSearchTerm.length > 0 && trimmedSearchTerm.length < 2
                  ? 'Nhập ít nhất 2 ký tự để tìm kiếm nguyên liệu'
                  : isLoadingIngredients
                  ? 'Đang tải nguyên liệu...'
                  : 'Không tìm thấy nguyên liệu phù hợp'
              }
              allowClear
              onClear={() => setIngredientSearchTerm('')}
            />
          </Form.Item>

          <Form.Item
            name="weight"
            rules={[
              { required: true, message: 'Nhập trọng lượng' },
              { type: 'number', min: 1, max: 2000, message: '1-2000g' },
            ]}
            style={{ flex: '0 1 200px' }}
          >
            <InputNumber
              placeholder="Trọng lượng"
              size="large"
              style={{ width: '100%' }}
              min={1}
              max={2000}
              addonAfter="g"
            />
          </Form.Item>

          <Form.Item style={{ flex: '0 0 auto' }}>
            <Button
              variant="primary"
              size="md"
              onClick={handleAddIngredient}
              icon={<Icon name="mdi:plus" size={18} />}
            >
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </div>

      {/* Ingredients Table */}
      <div style={{ marginBottom: 24 }}>
        <Table
          columns={columns}
          dataSource={currentMealIngredients}
          rowKey="id"
          pagination={false}
          locale={{ emptyText: 'Chưa có nguyên liệu nào' }}
          size="small"
          scroll={{ x: 800 }}
        />

        {/* Totals */}
        {currentMealIngredients.length > 0 && (
          <div style={{ 
            marginTop: 16, 
            padding: 16, 
            backgroundColor: 'var(--primay-extralight)', 
            borderRadius: 8,
            border: '2px solid var(--primary)',
          }}>
            <Flex justify="space-between" align="center">
              <span style={{ fontSize: 16, fontWeight: 600 }}>Tổng cộng:</span>
              <Flex gap={24}>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Calories: </span>
                  <strong style={{ color: 'var(--primary)', fontSize: 18 }}>{totals.calories} kcal</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Carbs: </span>
                  <strong>{totals.carbs}g</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Protein: </span>
                  <strong>{totals.protein}g</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-secondary)' }}>Fat: </span>
                  <strong>{totals.fat}g</strong>
                </div>
              </Flex>
            </Flex>
          </div>
        )}
      </div>

      <Divider />

      {/* Footer buttons */}
      <Flex gap={12} justify="flex-end">
        <Button variant="secondary" size="md" onClick={handleCancel}>
          Hủy
        </Button>
        <Button
          variant="primary"
          size="md"
          onClick={handleSubmitAll}
          loading={isUpdating}
          disabled={isUpdating}
        >
          Hoàn thành và lưu kế hoạch
        </Button>
      </Flex>
    </Modal>
  );
};

export default MealDetailsModal;
 