'use client';

import React, { useState } from 'react';
import { Layout } from 'antd';
import { usePathname } from 'next/navigation';
import { Sider } from '@/shared/ui/layout/admin/Sider';
import { HeaderBanner, SearchInput } from '@/shared/ui';
import { AdminLayoutProvider } from '@/shared/contexts/AdminLayoutContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  
  // Danh sách các trang không cần thanh search
  const pagesWithoutSearch = ['/admin/content'];
  const shouldShowSearch = !pagesWithoutSearch.includes(pathname);

  return (
    <AdminLayoutProvider>
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
          {shouldShowSearch && <SearchInput />}
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
    </AdminLayoutProvider>
  );
}
