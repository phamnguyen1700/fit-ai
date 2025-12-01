'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Layout } from 'antd';
import toast from 'react-hot-toast';
import { AdvisorSider } from '@/shared/ui/layout/advisor/Sider';

export default function AdvisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Kiểm tra authentication
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      
      if (!token) {
        // Nếu chưa đăng nhập, redirect về home và hiện toast
        toast.error('Vui lòng đăng nhập để có quyền truy cập Advisor');
        router.push('/home');
        return;
      }
      
      setIsAuthenticated(true);
      setIsChecking(false);
    };

    checkAuth();
  }, [router, pathname]);

  // Hiển thị loading trong khi kiểm tra auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Nếu chưa authenticated, không render gì (đang redirect)
  if (!isAuthenticated) {
    return null;
  }

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
