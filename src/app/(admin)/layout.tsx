'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import { Sider } from '@/shared/ui/layout/admin/Sider';
import { HeaderBanner, SearchInput } from '@/shared/ui';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
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
          title="Create your workout goals"
          ctaText="Create"
          onCtaClick={() => {/* ... */ }}
          onEditClick={() => {/* ... */ }}
          imageUrl="https://images.unsplash.com/photo-1502904550040-7534597429ae"
        />
        <SearchInput />
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
  );
}
