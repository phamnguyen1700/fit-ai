"use client";
import React, { useState } from "react";
import { Table2, type TableColumn } from "@/shared/ui/core/Table2";
import { Button } from "@/shared/ui/core/Button";
import { Pagination } from "@/shared/ui/core/Pagination";
import Dropdown from "@/features/content/components/Dropdown";
import { useGetActiveProducts, useUpdateSubscriptionProduct, useDeleteSubscriptionProduct } from "@/tanstack/hooks/subscription";
import { UpdateSubscriptionRequest } from "@/types/subscription";
import EditPackageModal from "./EditPackageModal";
import { Modal } from "@/shared/ui/core/Modal";
import { Icon } from "@/shared/ui/icon";

// Types
export interface PackageData {
  id: string;
  name: string;
  duration: string;
  price: number;
  status: 'active' | 'inactive' | 'suspended';
  key: string;
}

interface PackageListTableProps {
  onEdit?: (packageData: PackageData) => void;
  onDelete?: (packageData: PackageData) => void;
  onStatusChange?: (packageData: PackageData, newStatus: string) => void;
  className?: string;
}

const PackageListTable: React.FC<PackageListTableProps> = ({
  onEdit,
  onStatusChange,
  className = "",
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageData | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<PackageData | null>(null);
  
  // Fetch subscription data from API
  const { data: subscriptionData, isLoading } = useGetActiveProducts();
  
  // Update mutation
  const updateMutation = useUpdateSubscriptionProduct();
  
  // Delete mutation
  const deleteMutation = useDeleteSubscriptionProduct();

  // Debug log
  React.useEffect(() => {
    console.log('Subscription Data Full:', subscriptionData);
    console.log('Subscription Data.data:', subscriptionData?.data);
    console.log('Is Loading:', isLoading);
  }, [subscriptionData, isLoading]);

  // Transform API data to PackageData format
  const dataSource: PackageData[] = React.useMemo(() => {
    console.log('Processing data in useMemo:', subscriptionData);
    
    if (!subscriptionData?.data || !Array.isArray(subscriptionData.data)) {
      console.log('No data available or not an array');
      return [];
    }
    
    const products = subscriptionData.data;
    console.log('Products array:', products);
    
    // Map array of products to PackageData format
    const result = products.map((product: any) => ({
      id: product.id || '',
      key: product.id || '',
      name: product.name || '',
      duration: product.interval || '',
      price: product.amount || 0,
      status: product.isActive ? 'active' : 'inactive' as 'active' | 'inactive' | 'suspended'
    }));
    
    console.log('Transformed result:', result);
    return result;
  }, [subscriptionData]);

  // Pagination logic
  const totalPages = Math.ceil(dataSource.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentData = dataSource.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Format price with VND currency
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

// Get status badge color and text
const getStatusBadge = (status: string) => {
  const statusConfig = {
    active: { 
      bgColor: 'bg-green-100 dark:bg-green-900/30', 
      textColor: 'text-green-800 dark:text-green-200',
      dotColor: 'bg-green-500',
      text: 'Đang bán' 
    },
    inactive: { 
      bgColor: 'bg-gray-100 dark:bg-gray-800', 
      textColor: 'text-gray-800 dark:text-gray-200',
      dotColor: 'bg-gray-500',
      text: 'Ngưng bán' 
    },
    suspended: { 
      bgColor: 'bg-orange-100 dark:bg-orange-900/30', 
      textColor: 'text-orange-800 dark:text-orange-200',
      dotColor: 'bg-orange-500',
      text: 'Tạm dừng' 
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
  
  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bgColor}`}>
      <div className={`w-2 h-2 rounded-full ${config.dotColor}`} />
      <span className={`text-sm font-medium ${config.textColor}`}>
        {config.text}
      </span>
    </div>
  );
};

  // Handle status change from dropdown
  const handleStatusChange = (packageData: PackageData, newStatus: string) => {
    onStatusChange?.(packageData, newStatus);
  };

  // Handle edit button click
  const handleEditClick = (packageData: PackageData) => {
    setSelectedPackage(packageData);
    setIsEditModalOpen(true);
    onEdit?.(packageData);
  };

  // Handle edit modal close
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    setSelectedPackage(null);
  };

  // Handle edit form submit
  const handleEditSubmit = (id: string, data: UpdateSubscriptionRequest) => {
    updateMutation.mutate({ id, data }, {
      onSuccess: () => {
        handleEditModalClose();
      }
    });
  };

  // Handle delete button click
  const handleDelete = (packageData: PackageData) => {
    setPackageToDelete(packageData);
    setIsDeleteModalOpen(true);
  };

  // Handle confirm delete
  const handleConfirmDelete = () => {
    if (packageToDelete) {
      deleteMutation.mutate(packageToDelete.id, {
        onSuccess: () => {
          setIsDeleteModalOpen(false);
          setPackageToDelete(null);
        }
      });
    }
  };

  // Handle cancel delete
  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setPackageToDelete(null);
  };

  // Status dropdown options
  const getStatusDropdownOptions = (currentStatus: string) => [
    {
      key: 'active',
      label: 'Đang bán',
      isActive: currentStatus === 'active'
    },
    {
      key: 'inactive', 
      label: 'Ngưng bán',
      isActive: currentStatus === 'inactive'
    },
    {
      key: 'suspended',
      label: 'Tạm dừng',
      isActive: currentStatus === 'suspended'
    },
  ];

  // Table columns configuration
  const columns: TableColumn<PackageData>[] = [
    {
      title: 'Tên gói',
      dataIndex: 'name',
      key: 'name',
      align: 'left',
      render: (text: string, record: PackageData) => (
        <div className="font-medium text-left">{record.name}</div>
      ),
    },
    {
      title: 'Thời hạn',
      dataIndex: 'duration',
      key: 'duration',
      align: 'center',
      render: (text: string, record: PackageData) => (
        <div className="text-center">{record.duration}</div>
      ),
    },
    {
      title: 'Giá (VND)',
      dataIndex: 'price',
      key: 'price',
      align: 'center',
      render: (price: number) => (
        <div className="text-center font-medium">
          {formatPrice(price)}
        </div>
      ),
      sorter: (a: PackageData, b: PackageData) => a.price - b.price,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status: string, record: PackageData) => (
        <div className="flex justify-center">
          <Dropdown
            trigger={getStatusBadge(status)}
            options={getStatusDropdownOptions(status)}
            onSelect={(option) => handleStatusChange(record, option.key)}
            className="cursor-pointer"
          />
        </div>
      ),
      filters: [
        { text: 'Đang bán', value: 'active' },
        { text: 'Ngưng bán', value: 'inactive' },
        { text: 'Tạm dừng', value: 'suspended' },
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: 'Hành động',
      key: 'actions',
      align: 'center',
      render: (_, record: PackageData) => (
        <div className="flex justify-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEditClick(record)}
            className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
          >
            Sửa
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(record)}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className={`package-list-table-container ${className}`}>
      <Table2<PackageData>
        columns={columns}
        dataSource={currentData}
        loading={isLoading}
        rowKey="id"
        pagination={false}
        scroll={{ x: 800 }}
        className="package-list-table"
      />
      
      {/* Custom Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
            showPageNumbers={true}
            maxVisiblePages={5}
            className="custom-pagination"
          />
        </div>
      )}

      {/* Edit Package Modal */}
      <EditPackageModal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        onSubmit={handleEditSubmit}
        isLoading={updateMutation.isPending}
        packageData={selectedPackage}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Xác nhận xóa gói subscription"
        className="max-w-md"
      >
        <div className="space-y-4">
          {/* Warning Icon and Message */}
          <div className="flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <div className="flex-shrink-0 mt-0.5">
              <Icon 
                name="alert-triangle" 
                className="w-5 h-5 text-red-600 dark:text-red-400"
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-red-800 dark:text-red-200">
                Bạn có chắc chắn muốn xóa gói subscription này không?
              </p>
              {packageToDelete && (
                <p className="mt-2 text-sm font-medium text-red-900 dark:text-red-100">
                  Gói: <span className="font-semibold">{packageToDelete.name}</span>
                </p>
              )}
              <p className="mt-2 text-xs text-red-700 dark:text-red-300">
                Hành động này không thể hoàn tác!
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleCancelDelete}
              disabled={deleteMutation.isPending}
              className="border-gray-300 hover:bg-gray-50"
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              disabled={deleteMutation.isPending}
              className="bg-red-600 hover:bg-red-700 text-white border-red-600"
            >
              {deleteMutation.isPending ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default PackageListTable;