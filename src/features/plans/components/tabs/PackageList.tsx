"use client";
import React from "react";
import PackageListTable, { PackageData } from "../PackageListTable";

interface PackageListProps {
  className?: string;
}

const PackageList: React.FC<PackageListProps> = ({ className = "" }) => {
  // Handle package actions
  const handleEdit = (packageData: PackageData) => {
    console.log("Edit package:", packageData);
    // TODO: Implement edit functionality
  };

  const handleDelete = (packageData: PackageData) => {
    console.log("Delete package:", packageData);
    // TODO: Implement delete functionality
  };

  const handleStatusChange = (packageData: PackageData, newStatus: string) => {
    console.log("Change status:", packageData, "to:", newStatus);
    // TODO: Implement status change functionality
  };

  return (
    <div className={`package-list-container ${className}`}>
      <PackageListTable
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        className="w-full"
      />
    </div>
  );
};

export default PackageList;
