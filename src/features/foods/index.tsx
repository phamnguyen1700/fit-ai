'use client';

import React, { useMemo, useState } from 'react';
import { App } from 'antd';
import { Card } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';
import { Icon } from '@/shared/ui/icon';
import { FoodTable } from './components/FoodTable';
import { FoodSearchModal } from './components/FoodSearchModal';
import type { FoodLibraryItem, FoodLibraryPagedItem } from '@/types/foodlibrary';
import type { FoodCategory } from '@/types/foodcategory';
import { FoodFormModal } from './components/FoodFormModal';
import { useCreateFoodLibraryItem, useDeleteFoodLibraryItem, useGetFoodLibraryPaged } from '@/tanstack/hooks/foodlibrary';

export interface FoodItem {
  id: string;
  name: string;
  // Tên category trong thư viện (VD: Protein, Carb, Fat...)
  categoryName?: string;
  categoryId?: string;
  fatSecretFoodId?: string;
  // Giữ brand/unit cũ cho compatibility (không hiển thị cột)
  brand?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  // Khối lượng (gram)
  weight?: number;
  unit?: string;
  createdBy?: string;
  lastCreate?: string;
  lastUpdate?: string;
  isActive?: boolean;
}

export const FoodManagementPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openModal, setOpenModal] = useState(false);
  const [editingFood, setEditingFood] = useState<FoodItem | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const { modal } = App.useApp();
  const createFoodMutation = useCreateFoodLibraryItem();
  const deleteFoodMutation = useDeleteFoodLibraryItem();
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const { data: pagedFoodsResponse, isLoading: isFoodsLoading } = useGetFoodLibraryPaged({
    pageNumber,
    pageSize,
  });

  const apiFoods: FoodItem[] = useMemo(() => {
    const items: FoodLibraryPagedItem[] = pagedFoodsResponse?.data?.data || [];
    return items.map((item) => ({
      id: item.id,
      name: item.name,
      categoryName: item.categoryName,
      categoryId: item.categoryId,
      fatSecretFoodId: item.fatSecretFoodId,
      calories: item.nutrition.calories,
      protein: item.nutrition.protein,
      carbs: item.nutrition.carbs,
      fat: item.nutrition.fat,
      weight: item.nutrition.weight,
      unit: `${item.nutrition.weight} g`,
      createdBy: item.createdBy,
      lastCreate: item.lastCreate,
      lastUpdate: item.lastUpdate,
      isActive: true,
    }));
  }, [pagedFoodsResponse]);

  const combinedFoods = useMemo(() => {
    // API foods + local created foods
    return [...apiFoods, ...foods];
  }, [apiFoods, foods]);

  const filteredFoods = useMemo(() => {
    if (!search.trim()) return combinedFoods;
    const keyword = search.toLowerCase();
    return combinedFoods.filter(
      (f) =>
        f.name.toLowerCase().includes(keyword) ||
        (f.brand && f.brand.toLowerCase().includes(keyword)),
    );
  }, [combinedFoods, search]);

  const handleCreateClick = () => {
    setEditingFood(null);
    setOpenModal(true);
  };

  const handleEdit = (food: FoodItem) => {
    setEditingFood(food);
    setOpenModal(true);
  };

  const handleToggleActive = (id: string) => {
    setFoods((prev) =>
      prev.map((f) => (f.id === id ? { ...f, isActive: !f.isActive } : f)),
    );
  };

  const handleSubmit = (data: Omit<FoodItem, 'id'> & { id?: string }) => {
    setFoods((prev) => {
      if (data.id) {
        // update
        return prev.map((f) => (f.id === data.id ? { ...f, ...data } as FoodItem : f));
      }
      // create
      const newFood: FoodItem = {
        ...(data as Omit<FoodItem, 'id'>),
        id: (prev.length + 1).toString(),
      };
      return [newFood, ...prev];
    });
    setOpenModal(false);
    setEditingFood(null);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setEditingFood(null);
  };

  const handleOpenSearchModal = () => {
    if (!search.trim()) return;
    setIsSearchModalOpen(true);
  };

  const handleCloseSearchModal = () => {
    setIsSearchModalOpen(false);
  };

  const handleDelete = (id: string) => {
    const food = combinedFoods.find((f) => f.id === id);

    modal.confirm({
      title: 'Xác nhận xoá thực phẩm',
      content: food
        ? `Bạn có chắc chắn muốn xoá \"${food.name}\" khỏi thư viện?`
        : 'Bạn có chắc chắn muốn xoá thực phẩm này khỏi thư viện?',
      okText: 'Xoá',
      cancelText: 'Huỷ',
      okButtonProps: {
        danger: true,
        style: {
          backgroundColor: 'var(--error)',
          borderColor: 'var(--error)',
          color: '#fff',
        },
      },
      onOk: () =>
        new Promise<void>((resolve, reject) => {
          deleteFoodMutation.mutate(id, {
            onSuccess: () => resolve(),
            onError: () => reject(),
          });
        }),
      centered: true,
    });
  };

  const handleAddFromLibrary = (item: FoodLibraryItem, category: FoodCategory) => {
    const toNumber = (raw: string) => {
      const parsed = parseFloat(raw.replace(/[^\d.]/g, ''));
      return Number.isNaN(parsed) ? 0 : parsed;
    };

    // Gọi API lưu vào /api/foodlibrary với category người dùng đã chọn.
    // Sau khi thành công, danh sách bảng sẽ tự reload nhờ invalidateQueries trong hook
    // và modal tìm kiếm sẽ được đóng ở đây.
    createFoodMutation.mutate(
      {
        name: item.vietnamese_name || item.food_name,
        categoryId: category.id,
        fatSecretFoodId: item.food_id,
        nutrition: {
          calories: toNumber(item.calories),
          protein: toNumber(item.protein),
          carbs: toNumber(item.carbs),
          fat: toNumber(item.fat),
          weight: toNumber(item.weight),
        },
      },
      {
        onSuccess: () => {
          setIsSearchModalOpen(false);
        },
      },
    );
  };

  return (
    <div className="w-full">
      <Card
        className="mt-4"
        title={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 w-full pt-2 pb-1">
            <div>
              <h1
                className="text-xl sm:text-2xl font-semibold m-0"
                style={{ color: 'var(--text)' }}
              >
                Quản lý thực phẩm
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <input
                className="border rounded-md px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-primary min-w-[200px]"
                placeholder="Tìm theo tên hoặc thương hiệu..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                variant="secondary"
                size="md"
                className="flex items-center gap-2"
                onClick={handleOpenSearchModal}
              >
                <Icon name="mdi:magnify" size={18} />
                <span>Tìm trong thư viện</span>
              </Button>
              <Button
                variant="primary"
                size="md"
                className="flex items-center gap-2"
                onClick={handleCreateClick}
              >
                <Icon name="mdi:plus-circle-outline" size={18} />
                <span>Thêm thực phẩm</span>
              </Button>
            </div>
          </div>
        }
      >
        <FoodTable
          foods={filteredFoods}
          onDelete={handleDelete}
          loading={isFoodsLoading}
          page={pageNumber}
          pageSize={pageSize}
          total={pagedFoodsResponse?.data?.totalCount || filteredFoods.length}
          onChangePage={(page, size) => {
            setPageNumber(page);
            setPageSize(size || pageSize);
          }}
        />
      </Card>

      <FoodFormModal
        open={openModal}
        food={editingFood}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
      />

      <FoodSearchModal
        open={isSearchModalOpen}
        query={search}
        onClose={handleCloseSearchModal}
        onAdd={handleAddFromLibrary}
      />
    </div>
  );
};

export default FoodManagementPage;

