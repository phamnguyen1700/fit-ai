"use client";
import React, { useState } from "react";
import PriceManaTable from "../PriceManaTable";
import { DiscountTemplate } from "@/types/discount";
import { useGetDiscountTemplates } from "@/tanstack/hooks/discount";

interface PriceManaProps {
  className?: string;
}

const PriceMana: React.FC<PriceManaProps> = ({ className = "" }) => {
  const [isActiveFilter, setIsActiveFilter] = useState<boolean | null>(null);
  
  // Fetch discount templates
  const { data, isLoading, error } = useGetDiscountTemplates({
    isActive: isActiveFilter,
  });

  // Handle discount management actions
  const handleEdit = (discount: DiscountTemplate) => {
    console.log("Edit discount:", discount);
    // TODO: Implement edit functionality
  };

  const handleDelete = (discount: DiscountTemplate) => {
    console.log("Delete discount:", discount);
    // TODO: Implement delete functionality
  };

  const discountTemplates = data?.data || [];

  return (
    <div className={`price-mana-container ${className}`}>
      <PriceManaTable
        priceData={discountTemplates}
        loading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="w-full"
      />
    </div>
  );
};

export default PriceMana;
