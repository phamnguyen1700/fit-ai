"use client";
import React from "react";
import TransactionTable, { TransactionData } from "../TransactionTable";

interface TransactionProps {
  className?: string;
}

const Transaction: React.FC<TransactionProps> = ({ className = "" }) => {
  // Handle transaction actions
  const handleViewDetails = (transaction: TransactionData) => {
    console.log("View transaction details:", transaction);
    // TODO: Implement view details functionality
  };

  return (
    <div className={`transaction-container ${className}`}>
      <TransactionTable
        onViewDetails={handleViewDetails}
        className="w-full"
      />
    </div>
  );
};

export default Transaction;