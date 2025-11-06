'use client';

import React, { useState } from 'react';
import { Modal, Button, Flex, Tabs, Select } from '@/shared/ui';
import { Form, InputNumber, Divider, Table, Input } from 'antd';
import { Icon } from '@/shared/ui/icon';
import type { CreateMealPlanFormData, DayMeal, Meal, MealIngredient } from '@/types/plan';
import { ingredients, getIngredientById, calculateNutrition } from '../data/ingredientData';

interface MealDetailsModalProps {
  open: boolean;
  planData: CreateMealPlanFormData | null;
  onCancel: () => void;
  onSubmit: (menus: DayMeal[]) => void;
}

type MealType = 'breakfast' | 'lunch' | 'dinner';

interface MealTypeTab {
  key: string;
  label: React.ReactNode;
  isCustom?: boolean;
}

export const MealDetailsModal: React.FC<MealDetailsModalProps> = ({
  open,
  planData,
  onCancel,
  onSubmit,
}) => {
  const [activeMenu, setActiveMenu] = useState<number>(1);
  const [activeMealType, setActiveMealType] = useState<string>('breakfast');
  const [menuMeals, setMenuMeals] = useState<Record<number, Record<string, MealIngredient[]>>>({});
  const [customMeals, setCustomMeals] = useState<Record<number, MealTypeTab[]>>({});
  const [isAddingMeal, setIsAddingMeal] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [form] = Form.useForm();

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
    }
  }, [open, planData]);

  const handleAddIngredient = async () => {
    try {
      const values = await form.validateFields();
      
      const nutrition = calculateNutrition(values.ingredientId, values.weight);
      if (!nutrition) return;

      const newIngredient: MealIngredient = {
        id: `${Date.now()}-${Math.random()}`,
        ingredientId: values.ingredientId,
        weight: values.weight,
        ...nutrition,
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

    setCustomMeals(prev => ({
      ...prev,
      [activeMenu]: [
        ...(prev[activeMenu] || []),
        {
          key: newMealKey,
          label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🍽️</span>{newMealName.trim()}</span>,
          isCustom: true,
        }
      ]
    }));

    // Initialize empty ingredient array for this meal
    setMenuMeals(prev => ({
      ...prev,
      [activeMenu]: {
        ...prev[activeMenu],
        [newMealKey]: [],
      },
    }));

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
    setCustomMeals(prev => ({
      ...prev,
      [activeMenu]: prev[activeMenu].filter(meal => meal.key !== mealKey),
    }));

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
    setMenuMeals(prev => ({
      ...prev,
      [activeMenu]: {
        ...prev[activeMenu],
        [activeMealType]: prev[activeMenu][activeMealType].filter(ing => ing.id !== ingredientId),
      },
    }));
  };

  const handleSubmitAll = () => {
    const menus: DayMeal[] = Object.entries(menuMeals).map(([menuNum, mealTypes]) => {
      const menuNumber = parseInt(menuNum);
      const allMealTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];
      
      const meals: Meal[] = allMealTypes.map(type => {
        const mealIngredients = mealTypes[type] || [];
        const totalCalories = mealIngredients.reduce((sum, ing) => sum + ing.calories, 0);
        const totalCarbs = mealIngredients.reduce((sum, ing) => sum + ing.carbs, 0);
        const totalProtein = mealIngredients.reduce((sum, ing) => sum + ing.protein, 0);
        const totalFat = mealIngredients.reduce((sum, ing) => sum + ing.fat, 0);

        return {
          type: type,
          ingredients: mealIngredients,
          totalCalories,
          totalCarbs: Math.round(totalCarbs * 10) / 10,
          totalProtein: Math.round(totalProtein * 10) / 10,
          totalFat: Math.round(totalFat * 10) / 10,
        };
      });

      return {
        menuNumber,
        meals,
      };
    });

    onSubmit(menus);
  };

  const handleCancel = () => {
    form.resetFields();
    setMenuMeals({});
    setCustomMeals({});
    setIsAddingMeal(false);
    setNewMealName('');
    onCancel();
  };

  if (!planData) return null;

  // Generate tabs for each menu
  const menuTabs = Array.from({ length: planData.totalMenus }, (_, i) => ({
    key: String(i + 1),
    label: `Menu ${i + 1}`,
  }));

  // Meal type tabs - only 3 default meals
  const mealTypeTabs: MealTypeTab[] = [
    { key: 'breakfast', label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🌅</span>Bữa sáng</span> },
    { key: 'lunch', label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>☀️</span>Bữa trưa</span> },
    { key: 'dinner', label: <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><span>🌙</span>Bữa tối</span> },
  ];

  // Add custom meals for this menu
  const currentMenuCustomMeals = customMeals[activeMenu] || [];
  const allMealTabs = [...mealTypeTabs, ...currentMenuCustomMeals];

  // Ingredient options
  const ingredientOptions = ingredients.map(ing => ({
    label: ing.name,
    value: ing.id,
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
      render: (id: string) => getIngredientById(id)?.name || id,
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
              options={ingredientOptions}
              showSearch
              filterOption={(input, option) =>
                String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
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
        >
          Hoàn thành và lưu kế hoạch
        </Button>
      </Flex>
    </Modal>
  );
};

export default MealDetailsModal;
