'use client';

import React from 'react';
import { CardTable } from '@/shared/ui/core/CardTable';
import type { MonthlyCustomer } from '@/types/advisordashboard';
import { MonthlyCustomerCard } from './MonthlyCustomerCard';

export interface MonthlyCustomerTableProps {
  customers: MonthlyCustomer[];
  onAction?: (action: string, customer: MonthlyCustomer) => void;
  pageSize?: number;
}

export const MonthlyCustomerTable: React.FC<MonthlyCustomerTableProps> = ({
  customers,
  onAction,
  pageSize = 6,
}) => {
  return (
    <CardTable
      items={customers}
      pageSize={pageSize}
      renderItem={(item) => (
        <MonthlyCustomerCard
          key={item.id}
          customer={item}
          onAction={onAction}
        />
      )}
    />
  );
};

export default MonthlyCustomerTable;
