'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import { AdvisorSider } from '@/shared/ui/layout/advisor/Sider';

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <AdvisorSider
        collapsed={collapsed}
        onCollapse={setCollapsed}
        width={230}
        collapsedWidth={80}
      />
      <Layout
        style={{
          padding: '24px',
          gap: '16px',
          background: 'var(--bg-secondary)',
        }}
      >
        <main
          className="flex-1"
          style={{
            background: 'var(--bg-secondary)',
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          {children}
        </main>
      </Layout>
    </Layout>
  );
}
