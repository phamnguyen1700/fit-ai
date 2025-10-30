'use client';

import React, { useState } from 'react';
import { Layout, App } from 'antd';
import { Sider } from '@/shared/ui/layout/advisor/Sider';
import { HeaderBanner, SearchInput } from '@/shared/ui';
import NotificationBell from '@/shared/ui/layout/advisor/components/NotificationBell';

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <App>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={230}
          collapsedWidth={80}
        />

        <Layout style={{ padding: '20px', flex: 'column', gap: '10px' }}>
          {/* Header */}
          <HeaderBanner
            title="Quản lý khách hàng và kế hoạch tập luyện"
            ctaText="Tạo mới"
            onCtaClick={() => {/* ... */ }}
            onEditClick={() => {/* ... */ }}
            imageUrl="/img/caonguyen.png"
          />
          <div className="flex gap-3 items-center">
            <div className="flex-1">
              <SearchInput />
            </div>
            <NotificationBell />
          </div>
          {/* Main Content */}
          <main
            className="flex-1"
            style={{
              background: 'var(--bg-secondary)',
              minHeight: 'calc(100vh - 64px)'
            }}
          >
            {children}
          </main>
        </Layout>
      </Layout>
    </App>
  );
}
