'use client';

import React from 'react';
import { Grid, Layout } from 'antd';
import { Menu } from '@/shared/ui/core/Menu';
import { Icon, icons } from '@/shared/ui/icon';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '@/stores/stores';

const { Sider: AntSider } = Layout;

interface AdvisorSiderProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
  width?: number;
  collapsedWidth?: number;
}

const menuItems: { key: string; label: React.ReactNode; icon?: React.ReactNode }[] = [
  { key: '/advisor/customers', label: 'Khách hàng trong tháng', icon: <Icon name={icons.clients} /> },
  { key: '/advisor/feedback', label: 'Cần đánh giá', icon: <Icon name={icons.feedback} /> },
  { key: '/advisor/chat', label: 'Chat với khách hàng', icon: <Icon name={icons.message} /> },
];

export const AdvisorSider: React.FC<AdvisorSiderProps> = ({
  collapsed = false,
  onCollapse: _onCollapse, // unused
  width = 230,
  collapsedWidth = 80,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const screens = Grid.useBreakpoint();

  const isMobile = !screens.md;
  const computedWidth = screens.lg ? 240 : screens.md ? 220 : 0;
  const computedCollapsedWidth = screens.lg ? 80 : screens.md ? 72 : 0;
  const effectiveCollapsed = isMobile ? true : collapsed;
  const resolvedWidth = computedWidth || width;
  const resolvedCollapsed = computedCollapsedWidth || collapsedWidth;
  const siderWidth = effectiveCollapsed ? resolvedCollapsed : resolvedWidth;

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'logout') {
      useAuthStore.getState().logout();
      router.push('/');
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
        maxWidth: siderWidth,
      }}
    >
      <div className="flex items-center justify-center h-16 px-4">
        {collapsed ? (
          <div className="text-2xl font-bold text-primary">A</div>
        ) : (
          <div className="text-xl font-bold">
            <span className="text-text">Advisor</span>
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
          items={[{ key: 'logout', label: 'Đăng xuất', icon: <Icon name={icons.logout} /> }]}
          selectedKeys={[]}
          onItemClick={(key) => handleMenuClick({ key })}
          variant="light"
        />
      </div>
    </AntSider>
  );
};

export default AdvisorSider;
