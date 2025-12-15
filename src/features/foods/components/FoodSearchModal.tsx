"use client";

import React, { useState, useEffect } from 'react';
import { Modal, Table, Typography, Spin, Alert, Select, ConfigProvider } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useSearchFoodLibrary } from '@/tanstack/hooks/foodlibrary';
import type { FoodLibraryItem } from '@/types/foodlibrary';
import type { FoodCategory } from '@/types/foodcategory';
import { useGetFoodCategories } from '@/tanstack/hooks/foodcategory';
import { Button } from '@/shared/ui/core/Button';

const { Text } = Typography;

interface FoodSearchModalProps {
  open: boolean;
  query: string;
  onClose: () => void;
  onAdd: (item: FoodLibraryItem, category: FoodCategory) => void;
}

export const FoodSearchModal: React.FC<FoodSearchModalProps> = ({
  open,
  query,
  onClose,
  onAdd,
}) => {
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<FoodLibraryItem | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>();

  const { data, isLoading, isError, error } = useSearchFoodLibrary(
    {
      query,
      pageNumber: 0,
      maxResults: 20,
    },
    {
      enabled: open && !!query,
    },
  );

  const foods: FoodLibraryItem[] = data?.data?.foods || [];

  const {
    data: categoriesResponse,
    isLoading: isCategoriesLoading,
  } = useGetFoodCategories(categoryModalOpen);

  const categories: FoodCategory[] = categoriesResponse?.data || [];

  // Nếu modal ngoài đóng thì luôn đóng modal chọn category
  useEffect(() => {
    if (!open) {
      setCategoryModalOpen(false);
      setSelectedItem(null);
      setSelectedCategoryId(undefined);
    }
  }, [open]);

  const handleClickAdd = (item: FoodLibraryItem) => {
    setSelectedItem(item);
    setCategoryModalOpen(true);
  };

  const handleConfirmCategory = () => {
    if (!selectedItem || !selectedCategoryId) return;
    const category = categories.find((c) => c.id === selectedCategoryId);
    if (!category) return;
    onAdd(selectedItem, category);
    setCategoryModalOpen(false);
    setSelectedItem(null);
    setSelectedCategoryId(undefined);
  };

  const columns: ColumnsType<FoodLibraryItem> = [
    {
      title: 'Tên (VI)',
      dataIndex: 'vietnamese_name',
      key: 'vietnamese_name',
      render: (text, record) => (
        <div className="flex flex-col">
          <span className="font-medium">{text}</span>
          <span className="text-xs text-gray-500">
            {record.food_name}
          </span>
        </div>
      ),
    },
    {
      title: 'Khối lượng',
      dataIndex: 'weight',
      key: 'weight',
    },
    {
      title: 'Calories',
      dataIndex: 'calories',
      key: 'calories',
    },
    {
      title: 'Protein',
      dataIndex: 'protein',
      key: 'protein',
    },
    {
      title: 'Carb',
      dataIndex: 'carbs',
      key: 'carbs',
    },
    {
      title: 'Fat',
      dataIndex: 'fat',
      key: 'fat',
    },
    {
      title: 'Fiber',
      dataIndex: 'fiber',
      key: 'fiber',
    },
    {
      title: 'Sugar',
      dataIndex: 'sugar',
      key: 'sugar',
    },
    {
      title: '',
      key: 'actions',
      render: (_, record) => (
        <Button
          variant="ghost"
          size="sm"
          className="text-primary border-none shadow-none px-0 hover:text-primary hover:underline"
          onClick={() => handleClickAdd(record)}
        >
          Thêm vào danh sách
        </Button>
      ),
    },
  ];

  return (
    <Modal
      title={`Kết quả tìm kiếm: "${query}"`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
    >
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Spin />
        </div>
      )}

      {isError && (
        <Alert
          type="error"
          message="Không thể tải dữ liệu thực phẩm"
          description={(error as Error)?.message}
          showIcon
          className="mb-4"
        />
      )}

      {!isLoading && !isError && (
        <>
          <Text type="secondary" className="block mb-2">
            Tìm thấy {foods.length} thực phẩm phù hợp.
          </Text>
          <Table
            rowKey="food_id"
            dataSource={foods}
            columns={columns}
            pagination={false}
            size="small"
          />
        </>
      )}

      <Modal
        title={
          <span className="font-semibold">
            Chọn nhóm chất cho thực phẩm
          </span>
        }
        open={categoryModalOpen}
        onCancel={() => {
          setCategoryModalOpen(false);
          setSelectedItem(null);
          setSelectedCategoryId(undefined);
        }}
        onOk={handleConfirmCategory}
        okButtonProps={{
          disabled: !selectedCategoryId,
          style: {
            backgroundColor: 'var(--primary)',
            borderColor: 'var(--primary)',
          },
        }}
        cancelButtonProps={{
          style: {
            borderColor: 'var(--primary)',
            color: 'var(--primary)',
          },
        }}
        centered
      >
        {isCategoriesLoading ? (
          <div className="flex items-center justify-center py-4">
            <Spin />
          </div>
        ) : (
          <ConfigProvider
            theme={{
              token: {
                colorPrimary: 'var(--primary)',
                colorPrimaryHover: 'var(--primary)',
              },
              components: {
                Select: {
                  optionActiveBg: 'rgba(255, 122, 26, 0.08)',
                },
              },
            }}
          >
            <Select
              className="w-full"
              placeholder="Chọn nhóm chất (Protein, Carb, Fat, ...)"
              value={selectedCategoryId}
              onChange={(value) => setSelectedCategoryId(value)}
              options={categories.map((cat) => ({
                label: cat.name,
                value: cat.id,
              }))}
            />
          </ConfigProvider>
        )}
      </Modal>
    </Modal>
  );
};

