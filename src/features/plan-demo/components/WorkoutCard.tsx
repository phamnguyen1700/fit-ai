import React, { useMemo, useState } from 'react';
import { Card, Flex, Button } from '@/shared/ui';
import { Icon } from '@/shared/ui/icon';
import type { WorkoutDemo } from '@/types/workoutdemo';
import WorkoutDetailModal from './WorkoutDetailModal';
import { useDeleteWorkoutDemo, useGetWorkoutDemoDetail, useHardDeleteWorkoutDemo } from '@/tanstack/hooks/workoutdemo';
import { Dropdown, App } from 'antd';
import type { MenuProps } from 'antd';
import WorkoutPlanUpdateModal from './WorkoutPlanUpdateModal';
import WorkoutPlanDetailUpdateModal from './WorkoutPlanDetailUpdateModal';

interface WorkoutCardProps {
  workoutPlan: WorkoutDemo;
  onUpdate?: (workoutPlan: WorkoutDemo) => void;
  onDeactivate?: (workoutPlan: WorkoutDemo) => void;
  onDelete?: (workoutPlan: WorkoutDemo) => void;
}

export const WorkoutCard: React.FC<WorkoutCardProps> = ({
  workoutPlan,
  onUpdate,
  onDeactivate,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDetailUpdateModalOpen, setIsDetailUpdateModalOpen] = useState(false);

  const detailId = workoutPlan.workoutDemoId;
  const {
    data: detailResponse,
    isLoading: isDetailLoading,
    isFetching: isDetailFetching,
    refetch: refetchDetail,
  } = useGetWorkoutDemoDetail(detailId);
  const detail = detailResponse?.data;

  const { mutateAsync: softDeleteWorkout, isPending: isDeleting } = useDeleteWorkoutDemo();
  const { mutateAsync: hardDeleteWorkout, isPending: isHardDeleting } = useHardDeleteWorkoutDemo();
  const { modal } = App.useApp();

  const planName = detail?.planName ?? workoutPlan.planName;
  const isDeleted = detail?.isDeleted ?? workoutPlan.isDeleted;
  const days = detail?.days ?? workoutPlan.days;

  const totalExercises = days.reduce(
    (acc, day) => acc + day.exercises.length,
    0
  );

  const activeDays = days.filter((day) => day.exercises.length > 0).length;
  const totalDays = detail?.totalDays ?? workoutPlan.days.length;

  const updateInitialValues = useMemo(
    () => ({
      planName,
      gender: detail?.gender ?? undefined,
      goal: detail?.goal ?? '',
      totalDays: detail?.totalDays ?? workoutPlan.days.length,
    }),
    [planName, detail?.gender, detail?.goal, detail?.totalDays, workoutPlan.days.length]
  );

  const isPlanInfoLoading = isUpdateModalOpen && isDetailLoading && !detail;

  const isActionDisabled = isDeleting || isHardDeleting;

  const menuItems = useMemo<MenuProps['items']>(() => [
    {
      key: 'update',
      label: 'Cập nhật workout plan',
    },
    {
      key: 'deactivate',
      label: 'Vô hiệu hóa workout plan',
      disabled: isActionDisabled,
    },
    {
      key: 'delete',
      label: 'Xóa workout plan',
      danger: true,
      disabled: isActionDisabled,
    },
  ], [isActionDisabled]);

  const showDeactivateConfirm = () => {
    modal.confirm({
      title: 'Vô hiệu hóa kế hoạch luyện tập?',
      content: 'Kế hoạch sẽ được ẩn khỏi danh sách nhưng có thể khôi phục lại sau này.',
      okText: 'Vô hiệu hóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        if (onDeactivate) {
          return onDeactivate(workoutPlan);
        }

        try {
          await softDeleteWorkout(workoutPlan.workoutDemoId);
          setIsModalOpen(false);
        } catch (error) {
          throw error;
        }
      },
    });
  };

  const showDeleteConfirm = () => {
    modal.confirm({
      title: 'Xóa vĩnh viễn kế hoạch luyện tập?',
      content: 'Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa khỏi hệ thống.',
      okText: 'Xóa',
      cancelText: 'Hủy',
      okButtonProps: { danger: true },
      centered: true,
      onOk: async () => {
        if (onDelete) {
          return onDelete(workoutPlan);
        }

        try {
          await hardDeleteWorkout(workoutPlan.workoutDemoId);
          setIsModalOpen(false);
        } catch (error) {
          throw error;
        }
      },
    });
  };

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    switch (key) {
      case 'update':
        setIsUpdateModalOpen(true);
        onUpdate?.(workoutPlan);
        break;
      case 'deactivate':
        showDeactivateConfirm();
        break;
      case 'delete':
        showDeleteConfirm();
        break;
      default:
        break;
    }
  };

  const handlePlanUpdated = async () => {
    if (workoutPlan.workoutDemoId) {
      await refetchDetail();
    }
    setIsUpdateModalOpen(false);
    setIsDetailUpdateModalOpen(true);
  };

  const handleDetailUpdateSuccess = async () => {
    if (workoutPlan.workoutDemoId) {
      await refetchDetail();
    }
    setIsDetailUpdateModalOpen(false);
    setIsModalOpen(false);
  };

  return (
    <>
      <Card
        className="workout-card"
        style={{
          width: '100%',
          height: '100%',
        }}
        styles={{
          body: { padding: 24 },
        }}
      >
        <Flex justify="space-between" align="flex-start" style={{ marginBottom: 20 }}>
          <h2 style={{
            margin: 0,
            fontSize: 20,
            fontWeight: 600,
            color: 'var(--text)'
          }}>
            {planName}
          </h2>
          <Dropdown
            trigger={[ 'click' ]}
            menu={{ items: menuItems, onClick: handleMenuClick }}
          >
            <button
              type="button"
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                border: '1px solid var(--border)',
                display: 'grid',
                placeItems: 'center',
                background: 'var(--bg-secondary)',
                cursor: 'pointer',
              }}
              aria-label="Lựa chọn thao tác"
            >
              <Icon name="mdi:dots-vertical" size={18} color="var(--text-secondary)" />
            </button>
          </Dropdown>
        </Flex>

        <Flex gap={6} align="center" style={{ marginBottom: 20 }}>
          <Icon
            name={isDeleted ? 'mdi:close-circle-outline' : 'mdi:check-circle-outline'}
            size={18}
            color={isDeleted ? 'var(--danger)' : 'var(--success)'}
          />
          <span style={{
            fontSize: 13,
            fontWeight: 500,
            color: isDeleted ? 'var(--danger)' : 'var(--success)',
            backgroundColor: isDeleted ? 'rgba(255, 99, 71, 0.12)' : 'rgba(34, 197, 94, 0.12)',
            padding: '4px 10px',
            borderRadius: 999,
          }}>
            {isDeleted ? 'Không hoạt động' : 'Đang hoạt động'}
          </span>
        </Flex>

        {/* Summary Stats */}
        <Flex gap={16} style={{ marginBottom: 20 }}>
          <Flex gap={8} align="center">
            <Icon name="mdi:calendar-check" size={20} color="var(--primary)" />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {totalDays} ngày ({activeDays} ngày có bài tập)
            </span>
          </Flex>
          <Flex gap={8} align="center">
            <Icon name="mdi:dumbbell" size={20} color="var(--warning)" />
            <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              {totalExercises} bài tập
            </span>
          </Flex>
        </Flex>

        {/* View Details Button */}
        <Button
          variant="primary"
          block
          onClick={() => setIsModalOpen(true)}
          icon={<Icon name="mdi:eye" size={18} />}
        >
          Xem chi tiết
        </Button>
      </Card>

      {/* Detail Modal */}
      <WorkoutDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        planName={planName}
        workouts={days}
        goal={detail?.goal}
        gender={detail?.gender}
        totalDays={detail?.totalDays}
        isLoading={isDetailLoading}
      />

      <WorkoutPlanUpdateModal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        workoutDemoId={workoutPlan.workoutDemoId}
        initialValues={updateInitialValues}
        isLoading={isPlanInfoLoading}
        onUpdated={handlePlanUpdated}
      />

      <WorkoutPlanDetailUpdateModal
        isOpen={isDetailUpdateModalOpen}
        onClose={() => setIsDetailUpdateModalOpen(false)}
        workoutDemoId={workoutPlan.workoutDemoId}
        days={detail?.days ?? workoutPlan.days}
        totalDays={detail?.totalDays ?? workoutPlan.days.length}
        isLoading={isDetailLoading || isDetailFetching}
        onUpdated={handleDetailUpdateSuccess}
      />
    </>
  );
};

export default WorkoutCard;
