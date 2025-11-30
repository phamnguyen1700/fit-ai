'use client';

import React from 'react';
import { Grid, Layout, App } from 'antd';
import { Menu } from '@/shared/ui/core/Menu';
import { Icon, icons } from '@/shared/ui/icon';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/stores';
import toast from 'react-hot-toast';

const { Sider: AntSider } = Layout;

interface SiderProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  width?: number;
  collapsedWidth?: number;
}

const menuItems: { key: string; label: React.ReactNode; icon?: React.ReactNode }[] = [
  { label: 'Trang chủ', key: '/admin/home', icon: <Icon name={icons.home} /> },
  { label: 'Bảng điều khiển', key: '/admin/dashboard', icon: <Icon name={icons.dashboard} /> },
  { label: 'Quản lý người dùng', key: '/admin/users', icon: <Icon name={icons.users} /> },
  { label: 'Quản lý nội dung', key: '/admin/content', icon: <Icon name={icons.content} /> },
  { label: 'Quản lý phản hồi', key: '/admin/feedback', icon: <Icon name={icons.feedback} /> },
  { label: 'Quản lý gói', key: '/admin/plans', icon: <Icon name={icons.plans} /> },
  { label: 'Quản lý Plan Demo', key: '/admin/plan-demo', icon: <Icon name={icons.plans} /> },
  { label: 'Quản lý Advisor', key: '/admin/advisors', icon: <Icon name={icons.advisors} /> },
  { label: 'Quản lý Policy', key: '/admin/policies', icon: <Icon name={icons.policies} /> },
  { label: 'Cài đặt', key: '/admin/settings', icon: <Icon name={icons.settings} /> },
];

export const Sider: React.FC<SiderProps> = ({
  collapsed = false,
  width = 230,
  collapsedWidth = 80,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const screens = Grid.useBreakpoint();
  const { modal } = App.useApp();

  const isMobile = !screens.md; 
  // Responsive widths (lg / md / <md)
  const computedWidth = screens.lg ? 240 : screens.md ? 220 : 0;
  const computedCollapsedWidth = screens.lg ? 80 : screens.md ? 72 : 0;
  const effectiveCollapsed = isMobile ? true : collapsed;
  const resolvedWidth = computedWidth || width;
  const resolvedCollapsed = computedCollapsedWidth || collapsedWidth;
  const siderWidth = effectiveCollapsed ? resolvedCollapsed : resolvedWidth;

  const handleLogout = () => {
    // Xóa token khỏi localStorage
    localStorage.removeItem('authToken');
    // Logout từ auth store
    useAuthStore.getState().logout();
    // Hiển thị thông báo
    toast.success('Đăng xuất thành công!');
    // Redirect về trang home
    router.push('/home');
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      // Hiển thị modal confirm
      modal.confirm({
        title: 'Xác nhận đăng xuất',
        content: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
        okText: 'Đăng xuất',
        cancelText: 'Hủy',
        okButtonProps: {
          danger: true,
        },
        onOk: handleLogout,
        centered: true,
      });
      return;
    }
    router.push(key);
  };

  return (
    <AntSider
      trigger={null}
      collapsible
      collapsed={effectiveCollapsed}
      width={resolvedWidth}
      collapsedWidth={resolvedCollapsed}
      className="sidebar"
      style={{
        background: 'var(--bg)',
        borderRight: '1px solid var(--border)',
        boxShadow: '0 1px 3px var(--shadow)',
        padding: '10px',
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflow: 'auto',
        flex: `0 0 ${siderWidth}px`,
        width: siderWidth,
        minWidth: siderWidth,
        maxWidth: siderWidth
      }}
    >
      <div className="flex items-center justify-center h-16 px-4">
        {collapsed ? (
          <div className="text-2xl font-bold text-primary">F</div>
        ) : (
          <div className="text-xl font-bold">
            <span className="text-text">AI Planing</span>
            <span className="text-primary"> FIT</span>
          </div>
        )}
      </div>

      <Menu
        items={menuItems}
        selectedKeys={[pathname]}
        onItemClick={(key) => handleMenuClick({ key })}
        variant="light"
      />

      <div className="absolute left-2 right-2 bottom-2">
        <Menu
          items={[{ key: 'logout', label: 'Logout', icon: <Icon name={icons.logout} /> }]}
          selectedKeys={[]}
          onItemClick={(key) => handleMenuClick({ key })}
          variant="light"
        />
      </div>
    </AntSider>
  );
};

