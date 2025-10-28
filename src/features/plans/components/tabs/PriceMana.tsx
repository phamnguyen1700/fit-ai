"use client";
import React from "react";
import PriceManaTable, { PriceData } from "../PriceManaTable";

interface PriceManaProps {
  className?: string;
}

const PriceMana: React.FC<PriceManaProps> = ({ className = "" }) => {
  // Handle price management actions
  const handleEdit = (priceData: PriceData) => {
    console.log("Edit price:", priceData);
    // TODO: Implement edit functionality
  };

  const handleDelete = (priceData: PriceData) => {
    console.log("Delete price:", priceData);
    // TODO: Implement delete functionality
  };

  return (
    <div className={`price-mana-container ${className}`}>
      <PriceManaTable
        onEdit={handleEdit}
        onDelete={handleDelete}
        className="w-full"
      />
    </div>
  );
};

export default PriceMana;
