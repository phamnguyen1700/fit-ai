import React, { useMemo, useState } from 'react';
import { Modal, Card, Flex } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { MealPlanDetail } from '@/types/plan';

interface MealPlanDetailModalProps {
  open: boolean;
  plan: MealPlanDetail | null;
  onClose: () => void;
}

const MEAL_LABEL: Record<string, string> = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa',
  dinner: 'Bữa tối',
  custom: 'Bữa phụ',
};

const formatNumber = (value: number) => value.toLocaleString('vi-VN');

const formatIngredientName = (ingredientId: string) =>
  ingredientId
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

export const MealPlanDetailModal: React.FC<MealPlanDetailModalProps> = ({
  open,
  plan,
  onClose,
}) => {
  const [expandedMenus, setExpandedMenus] = useState<number[]>([]);

  const menuSummaries = useMemo(() => {
    if (!plan) return [];

    return plan.menus.map((menu) => {
      const calories = menu.meals.reduce(
        (total, meal) => total + meal.totalCalories,
        0,
      );

      const ingredientsCount = menu.meals.reduce(
        (count, meal) => count + meal.ingredients.length,
        0,
      );

      return {
        menuNumber: menu.menuNumber,
        calories: Math.round(calories),
        mealsCount: menu.meals.length,
        ingredientsCount,
      };
    });
  }, [plan]);

  const toggleMenu = (menuNumber: number) =>
    setExpandedMenus((prev) =>
      prev.includes(menuNumber)
        ? prev.filter((m) => m !== menuNumber)
        : [...prev, menuNumber]
    );

  if (!plan) {
    return null;
  }

  const MenuHeader = ({ menuNumber, mealsCount, calories, isExpanded, onClick }: any) => (
    <div onClick={onClick} style={{
      padding: '16px 20px',
      cursor: 'pointer',
      backgroundColor: isExpanded ? 'var(--primay-extralight)' : 'var(--bg)',
      borderRadius: isExpanded ? '8px 8px 0 0' : '8px',
      transition: 'all 0.2s ease',
    }}>
      <Flex justify="space-between" align="center">
        <Flex gap={10} align="center">
          <Icon name="mdi:food" size={20} color="var(--primary)" />
          <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>Menu {menuNumber}</span>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            • {mealsCount} bữa • {formatNumber(calories)} kcal
          </span>
        </Flex>
        <Icon name={isExpanded ? 'mdi:chevron-up' : 'mdi:chevron-down'} size={20} color="var(--text-secondary)" />
      </Flex>
    </div>
  );

  const MenuContent = ({ menu }: any) => (
    <div style={{ padding: '16px 20px 20px' }}>
      {menu.meals.map((meal: any, index: number) => {
        const mealTitle =
          meal.type === 'custom'
            ? meal.customName || MEAL_LABEL[meal.type]
            : MEAL_LABEL[meal.type] || `Bữa ${index + 1}`;

        return (
          <div key={`${menu.menuNumber}-${meal.type}-${index}`} style={{
            marginBottom: index === menu.meals.length - 1 ? 0 : 16,
            padding: 16,
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 8,
            border: '1px solid var(--border)',
          }}>
            {/* Meal Header */}
            <Flex gap={10} align="center" style={{ marginBottom: 12 }}>
              <Icon name="mdi:food-apple" size={18} color="var(--success)" />
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)' }}>{mealTitle}</span>
              <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                • {formatNumber(meal.totalCalories)} kcal
              </span>
            </Flex>

            {/* Ingredients Table */}
            <div style={{ overflow: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ backgroundColor: 'var(--bg)' }}>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'left',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      borderBottom: '2px solid var(--border)',
                    }}>Nguyên liệu</th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      width: 100,
                      borderBottom: '2px solid var(--border)',
                    }}>Trọng lượng</th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      width: 90,
                      borderBottom: '2px solid var(--border)',
                    }}>Calories</th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      width: 80,
                      borderBottom: '2px solid var(--border)',
                    }}>Carbs</th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      width: 80,
                      borderBottom: '2px solid var(--border)',
                    }}>Protein</th>
                    <th style={{
                      padding: '10px 12px',
                      textAlign: 'center',
                      fontWeight: 600,
                      color: 'var(--text-secondary)',
                      width: 80,
                      borderBottom: '2px solid var(--border)',
                    }}>Fat</th>
                  </tr>
                </thead>
                <tbody>
                  {meal.ingredients.map((ingredient: any, i: number) => (
                    <tr key={ingredient.id} style={{
                      borderBottom: i === meal.ingredients.length - 1 ? 'none' : '1px solid var(--border)',
                    }}>
                      <td style={{ padding: '10px 12px', color: 'var(--text)' }}>
                        {formatIngredientName(ingredient.ingredientId)}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text)' }}>
                        {formatNumber(ingredient.weight)}g
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text)' }}>
                        {formatNumber(Math.round(ingredient.calories))}
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text)' }}>
                        {formatNumber(Math.round(ingredient.carbs || 0))}g
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text)' }}>
                        {formatNumber(Math.round(ingredient.protein || 0))}g
                      </td>
                      <td style={{ padding: '10px 12px', textAlign: 'center', color: 'var(--text)' }}>
                        {formatNumber(Math.round(ingredient.fat || 0))}g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      size="xl"
      title={plan.planName}
    >
      <div style={{ padding: '4px 0' }}>
        {menuSummaries.map((menuSummary) => {
          const menu = plan.menus.find((item) => item.menuNumber === menuSummary.menuNumber);
          if (!menu) return null;

          const isExpanded = expandedMenus.includes(menuSummary.menuNumber);

          return (
            <Card key={menuSummary.menuNumber} style={{
              marginBottom: 12,
              border: '1px solid var(--border)',
              borderRadius: 8,
            }} styles={{ body: { padding: 0 } }}>
              <MenuHeader
                menuNumber={menuSummary.menuNumber}
                mealsCount={menuSummary.mealsCount}
                calories={menuSummary.calories}
                isExpanded={isExpanded}
                onClick={() => toggleMenu(menuSummary.menuNumber)}
              />
              {isExpanded && (
                <MenuContent menu={menu} />
              )}
            </Card>
          );
        })}
      </div>
    </Modal>
  );
};

export default MealPlanDetailModal;
