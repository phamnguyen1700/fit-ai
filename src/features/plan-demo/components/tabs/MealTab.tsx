'use client';

import React, { useMemo, useState } from 'react';
import { Row, Col, Flex, Button, Pagination } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import { MealPlanCard } from '../MealPlanCard';
import { MealPlanDetailModal } from '../MealPlanDetailModal';
import MealPlanDetailUpdateModal from '../MealPlanDetailUpdateModal';
import MealPlanUpdateModal from '../MealPlanUpdateModal';
import type { MealPlanDetail, DayMeal, Meal, MealIngredient } from '@/types/plan';
import { useGetMealDemoList, useGetMealDemoDetail, useDeleteMealDemo, useHardDeleteMealDemo } from '@/tanstack/hooks/mealdemo';
import type { MealDemo, MealDemoDetailMenu, MealDemoDetailSession, UpdateMealDemoPayload } from '@/types/mealdemo';
import { App } from 'antd';

const MealTab: React.FC = () => {
  const PAGE_SIZE = 15;
  const [selectedPlan, setSelectedPlan] = useState<MealPlanDetail | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPlanUpdateModalOpen, setIsPlanUpdateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [activeMealDemoId, setActiveMealDemoId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const { modal } = App.useApp();
  const { mutateAsync: deleteMealDemo, isPending: isDeleting } = useDeleteMealDemo();
  const { mutateAsync: hardDeleteMealDemo, isPending: isHardDeleting } = useHardDeleteMealDemo();

  const listParams = useMemo(
    () => ({
      pageNumber: currentPage,
      pageSize: PAGE_SIZE,
    }),
    [currentPage]
  );

  const {
    data: mealDemoResponse,
    isPending: isMealDemoLoading,
    isFetching: isMealDemoFetching,
    isError: isMealDemoError,
    refetch,
  } = useGetMealDemoList(listParams);
  const {
    data: mealDemoDetailResponse,
    isPending: isMealDemoDetailLoading,
    refetch: refetchMealDemoDetail,
  } = useGetMealDemoDetail(activeMealDemoId ?? undefined, {
    enabled: (isModalOpen || isUpdateModalOpen || isPlanUpdateModalOpen) && Boolean(activeMealDemoId),
  });

  const mealDemos: MealDemo[] = useMemo(() => {
    const raw = mealDemoResponse?.data?.data;
    if (Array.isArray(raw)) {
      return raw;
    }

    return [];
  }, [mealDemoResponse?.data?.data]);

  const apiMealPlans: MealPlanDetail[] = useMemo(
    () =>
      mealDemos.map((demo) => ({
        id: demo.id,
        planName: demo.planName,
        goal: demo.goal,
        gender: demo.gender,
        totalCaloriesPerDay: demo.maxDailyCalories,
        totalMenus: demo.totalMenus,
        menus: [],
        createdAt: demo.createdAt,
        updatedAt: demo.updatedAt,
        isDeleted: demo.isDeleted,
      })),
    [mealDemos]
  );

  const totalPlans = mealDemoResponse?.data?.totalRecords ?? apiMealPlans.length;
  const totalPages = Math.max(1, Math.ceil((totalPlans || 0) / PAGE_SIZE));
  const showPagination = totalPages > 1;

  const mapSessionToMealType = (session: MealDemoDetailSession) => {
    const normalized = session.sessionName?.toLowerCase?.().trim?.() ?? '';

    if (normalized === 'breakfast') {
      return { type: 'breakfast' as const };
    }

    if (normalized === 'lunch') {
      return { type: 'lunch' as const };
    }

    if (normalized === 'dinner') {
      return { type: 'dinner' as const };
    }

    return {
      type: 'custom' as const,
      customName: session.sessionName || 'Bữa phụ',
    };
  };

  const transformDetailMenus = (detailMenus?: MealDemoDetailMenu[]): DayMeal[] => {
    if (!detailMenus) return [];

    return detailMenus.map((menu) => {
      const meals: Meal[] = menu.sessions.map((session, sessionIndex) => {
        const mealType = mapSessionToMealType(session);

        const ingredients: MealIngredient[] = session.ingredients.map((ingredient, ingredientIndex) => {
          const calories = Number(ingredient.calories) || 0;
          const carbs = Number(ingredient.carbs) || 0;
          const protein = Number(ingredient.protein) || 0;
          const fat = Number(ingredient.fat) || 0;

          return {
            id: `${menu.menuNumber}-${sessionIndex + 1}-${ingredientIndex + 1}`,
            ingredientId: ingredient.name || `ingredient-${sessionIndex + 1}-${ingredientIndex + 1}`,
            weight: Number(ingredient.weight) || 0,
            calories,
            carbs,
            protein,
            fat,
          };
        });

        const totals = ingredients.reduce(
          (acc, item) => ({
            calories: acc.calories + item.calories,
            carbs: acc.carbs + item.carbs,
            protein: acc.protein + item.protein,
            fat: acc.fat + item.fat,
          }),
          { calories: 0, carbs: 0, protein: 0, fat: 0 }
        );

        return {
          type: mealType.type,
          customName: mealType.customName,
          ingredients,
          totalCalories: totals.calories,
          totalCarbs: totals.carbs,
          totalProtein: totals.protein,
          totalFat: totals.fat,
        };
      });

      return {
        menuNumber: menu.menuNumber,
        meals,
      };
    });
  };

  const handleViewDetails = (plan: MealPlanDetail) => {
    setSelectedPlan(plan);
    setActiveMealDemoId(plan.id);
    setIsModalOpen(true);
  };

  const handleUpdate = (plan: MealPlanDetail) => {
    setSelectedPlan(plan);
    setActiveMealDemoId(plan.id);
    setIsPlanUpdateModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPlan(null);
    setActiveMealDemoId(null);
  };

  const handleClosePlanUpdateModal = () => {
    setIsPlanUpdateModalOpen(false);
  };

  const handleCloseUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedPlan(null);
    setActiveMealDemoId(null);
  };

  const handlePlanUpdated = async (payload: UpdateMealDemoPayload) => {
    if (activeMealDemoId) {
      await refetch();
      await refetchMealDemoDetail();
    }
    setIsPlanUpdateModalOpen(false);
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSuccess = async () => {
    if (activeMealDemoId) {
      await refetchMealDemoDetail();
    }
    setIsUpdateModalOpen(false);
    setIsModalOpen(false);
  };

  const handleDeactivate = (plan: MealPlanDetail) => {
    modal.confirm({
      title: 'Vô hiệu hóa thực đơn mẫu?',
      content: `Bạn có chắc chắn muốn vô hiệu hóa thực đơn "${plan.planName}"? Thực đơn sẽ được ẩn khỏi danh sách nhưng có thể khôi phục lại sau này.`,
      okText: 'Vô hiệu hóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true, loading: isDeleting },
      centered: true,
      onOk: async () => {
        try {
          await deleteMealDemo(plan.id);
        } catch (error) {
          throw error;
        }
      },
    });
  };

  const handleDelete = (plan: MealPlanDetail) => {

    // Nếu isDeleted = true, hiển thị confirm dialog
    modal.confirm({
      title: 'Xóa vĩnh viễn thực đơn mẫu?',
      content: `Bạn có chắc chắn muốn xóa vĩnh viễn thực đơn "${plan.planName}"? Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa khỏi hệ thống.`,
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true, loading: isHardDeleting },
      centered: true,
      onOk: async () => {
        try {
          await hardDeleteMealDemo(plan.id);
        } catch (error) {
          throw error;
        }
      },
    });
  };

  const detailedMenus = useMemo(
    () => transformDetailMenus(mealDemoDetailResponse?.data),
    [mealDemoDetailResponse?.data]
  );

  const planWithDetails = useMemo(() => {
    if (!selectedPlan) return null;

    if (detailedMenus.length > 0) {
      return {
        ...selectedPlan,
        menus: detailedMenus,
      };
    }

    return selectedPlan;
  }, [detailedMenus, selectedPlan]);

  return (
    <div className="meal-tab-container">
      {isMealDemoError && (
        <Flex
          align="center"
          justify="center"
          gap={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-secondary)',
            padding: 24,
            borderRadius: 12,
            marginBottom: 24,
            color: 'var(--danger)',
          }}
        >
          <Icon name="mdi:alert-circle-outline" size={32} color="var(--danger)" />
          <div style={{ fontSize: 14 }}>Không thể tải danh sách thực đơn mẫu.</div>
          <Button variant="primary" size="sm" onClick={() => refetch()}>
            Thử lại
          </Button>
        </Flex>
      )}

      {isMealDemoLoading && apiMealPlans.length === 0 && (
        <Flex
          align="center"
          justify="center"
          gap={8}
          style={{
            padding: 24,
            borderRadius: 12,
            backgroundColor: 'var(--bg-secondary)',
            color: 'var(--text-secondary)',
            marginBottom: 24,
          }}
        >
          <Icon name="mdi:loading" size={20} color="var(--primary)" />
          <span style={{ fontSize: 14 }}>Đang tải kế hoạch dinh dưỡng...</span>
        </Flex>
      )}

      {!isMealDemoLoading && !isMealDemoError && apiMealPlans.length === 0 && (
        <Flex
          align="center"
          justify="center"
          gap={12}
          style={{
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'var(--bg-secondary)',
            padding: 24,
            borderRadius: 12,
            marginBottom: 24,
            color: 'var(--text-secondary)',
            textAlign: 'center',
          }}
        >
          <Icon name="mdi:food-apple-outline" size={32} color="var(--text-secondary)" />
          <div style={{ fontSize: 14 }}>Chưa có kế hoạch dinh dưỡng nào trong thư viện.</div>
        </Flex>
      )}

      <Row gutter={[16, 16]} className="meal-plan-card-grid">
        {apiMealPlans.map((plan) => (
          <Col xs={24} md={12} xl={8} key={plan.id}>
            <MealPlanCard
              plan={plan}
              onViewDetails={handleViewDetails}
              onUpdate={handleUpdate}
              onDeactivate={handleDeactivate}
              onDelete={handleDelete}
            />
          </Col>
        ))}
      </Row>

      {showPagination && (
        <Flex justify="center" style={{ marginTop: 24 }}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            showPageNumbers
          />
        </Flex>
      )}

      <MealPlanDetailModal
        open={isModalOpen}
        plan={planWithDetails}
        onClose={handleCloseModal}
        loading={isMealDemoDetailLoading}
      />

      <MealPlanUpdateModal
        isOpen={isPlanUpdateModalOpen}
        onClose={handleClosePlanUpdateModal}
        mealDemoId={activeMealDemoId}
        initialValues={selectedPlan ? {
          planName: selectedPlan.planName,
          gender: selectedPlan.gender || undefined,
          goal: selectedPlan.goal || undefined,
          maxDailyCalories: selectedPlan.totalCaloriesPerDay,
          totalMenus: selectedPlan.totalMenus,
        } : undefined}
        isLoading={isMealDemoDetailLoading && !mealDemoDetailResponse}
        onUpdated={handlePlanUpdated}
      />

      <MealPlanDetailUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={handleCloseUpdateModal}
        mealDemoId={activeMealDemoId}
        menus={mealDemoDetailResponse?.data ?? []}
        isLoading={isMealDemoDetailLoading}
        onUpdated={handleUpdateSuccess}
      />
    </div>
  );
};

export default MealTab;
