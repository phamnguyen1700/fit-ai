'use client';

import React, { useMemo, useState } from 'react';
import { Breadcrumb } from '@/shared/ui/core/Breadcrumb';
import { Tabs } from '@/shared/ui/core/Tabs';
import { Icon } from '@/shared/ui/icon';
import type { CustomerDetail as CustomerDetailModel, CustomerProfileResponse } from '@/types/advisordashboard';
import { useParams } from 'next/navigation';
import { useCustomerProfile } from '@/tanstack/hooks/advisordashboard';
import { CustomerInfoTab } from './CustomerInfoTab';
import { PlanTabContent } from './PlanTabContent';
import { normalizeCustomerProfile } from '../utils/normalizeCustomerProfile';

export interface CustomerDetailProps {
  customer?: CustomerDetailModel; // Optional để có thể fetch trực tiếp
}

export const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer: customerProp }) => {
  const params = useParams();
  const userId = params?.id as string;
  const [activeTab, setActiveTab] = useState('info');

  // Fetch từ API profile endpoint nếu không có customer prop (backward compatible)
  const { data: apiData, isLoading, error } = useCustomerProfile(customerProp ? undefined : userId);

  const customer = useMemo(() => {
    // Nếu có customer prop, dùng prop (backward compatible)
    if (customerProp) {
      return customerProp;
    }

    // Nếu không có prop, fetch từ API profile
    if (!apiData?.data) {
      return null;
    }

    console.log('📊 [CustomerDetail] Raw profile data:', apiData.data);
    const normalized = normalizeCustomerProfile(apiData.data);
    console.log('✅ [CustomerDetail] Normalized customer:', normalized);
    return normalized;
  }, [customerProp, apiData]);

  // Loading state
  if (!customerProp && isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-[var(--text-secondary)]">Đang tải thông tin khách hàng...</div>
      </div>
    );
  }

  // Error state
  if (!customerProp && (error || !customer)) {
    return (
      <div className="flex flex-col items-center justify-center gap-2 p-8">
        <div className="text-sm font-medium text-red-600">
          {error ? 'Không thể tải thông tin khách hàng' : 'Không tìm thấy khách hàng'}
        </div>
        <div className="text-xs text-[var(--text-secondary)]">
          {error instanceof Error ? error.message : 'Vui lòng thử lại sau'}
        </div>
      </div>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <Breadcrumb
        items={[
          { title: 'Trang chủ', href: '/advisor' },
          { title: 'Quản lý khách hàng', href: '/advisor/customers' },
          { title: 'Thông tin khách hàng' },
        ]}
        className="text-sm text-[var(--text-secondary)]"
      />
      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        items={[
          {
            key: 'info',
            label: (
              <span className="flex items-center gap-2">
                <Icon name="mdi:account-outline" size={16} />
                Thông tin
              </span>
            ),
            children: <CustomerInfoTab customer={customer} />,
          },
          {
            key: 'plan',
            label: (
              <span className="flex items-center gap-2">
                <Icon name="mdi:clipboard-text-outline" size={16} />
                Kế hoạch
              </span>
            ),
            children: <PlanTabContent userId={userId || customer.id || ''} />,
          },
        ]}
      />
    </div>
  );
};

export default CustomerDetail;
