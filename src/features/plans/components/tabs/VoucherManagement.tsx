"use client";
import React, { useState } from "react";
import PriceManaTable from "../PriceManaTable";
import { DiscountTemplate } from "@/types/discount";
import { useGetDiscountTemplates, useUpdateDiscountTemplate } from "@/tanstack/hooks/discount";

interface VoucherManagementProps {
  className?: string;
}

const VoucherManagement: React.FC<VoucherManagementProps> = ({ className = "" }) => {
  const [isActiveFilter] = useState<boolean | null>(null);
  
  // Fetch discount templates
  const { data, isLoading } = useGetDiscountTemplates({
    isActive: isActiveFilter,
  });

  // Update discount template mutation
  const updateMutation = useUpdateDiscountTemplate();

  // Handle discount management actions
  const handleEdit = (discount: DiscountTemplate) => {
    console.log("Edit discount:", discount);
    // TODO: Implement edit functionality
  };

  const handleDelete = (discount: DiscountTemplate) => {
    console.log("Delete discount:", discount);
    // TODO: Implement delete functionality
  };

  // Handle toggle status
  const handleToggleStatus = (discount: DiscountTemplate) => {
    updateMutation.mutate({
      discountId: discount.id,
      data: {
        value: discount.value,
        isActive: !discount.isActive,
      },
    });
  };

  const discountTemplates = data?.data || [];

  return (
    <div className={`voucher-management-container ${className}`}>
      <PriceManaTable
        priceData={discountTemplates}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onToggleStatus={handleToggleStatus}
        className="w-full"
      />
    </div>
  );
};

export default VoucherManagement;
