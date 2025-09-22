"use client";

import React from 'react';
import { Tabs as AntTabs, TabsProps as AntTabsProps } from 'antd';
import classNames from 'classnames';

export interface TabItem {
  key: string;
  label: React.ReactNode;
  children?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps extends Omit<AntTabsProps, 'items' | 'type'> {
  items: TabItem[];
  value?: string;
  onChange?: (key: string) => void;
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({
  items,
  value,
  onChange,
  className,
  ...rest
}) => {
  return (
    <div className={classNames('custom-tabs', className)}>
      <AntTabs
        items={items}
        activeKey={value}
        onChange={onChange}
        {...rest}
        type="line"
        className="custom-tabs-inner"
        animated={{ inkBar: true, tabPane: false }}
      />
      <style jsx global>{`
        .custom-tabs {
          position: relative;
        }
        
        .custom-tabs .ant-tabs {
          overflow: visible;
        }
        
        .custom-tabs .ant-tabs-nav {
          margin-bottom: 0;
          border-bottom: none;
          position: relative;
        }
        
        .custom-tabs .ant-tabs-nav-wrap {
          border-bottom: none;
          overflow: visible;
        }
        
        .custom-tabs .ant-tabs-nav-list {
          position: relative;
        }
        
        .custom-tabs .ant-tabs-tab {
          background: none !important;
          border: none !important;
          padding: 12px 0 !important;
          margin-right: 40px !important;
          color: #333333 !important;
          font-size: 1.125rem !important;
          font-weight: 600 !important;
          transition: color 0.3s ease !important;
          position: relative;
        }
        
        .custom-tabs .ant-tabs-tab-active {
          color: var(--primary) !important;
        }
        
        .custom-tabs .ant-tabs-tab-active .ant-tabs-tab-btn {
          color: var(--primary) !important;
        }
        
        .custom-tabs .ant-tabs-tab .ant-tabs-tab-btn {
          color: inherit !important;
          transition: color 0.3s ease !important;
        }
        
        .custom-tabs .ant-tabs-ink-bar {
          background: var(--primary) !important;
          height: 3px !important;
          border-radius: 2px !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
          bottom: 0 !important;
          position: absolute !important;
          z-index: 1 !important;
        }
        
        .custom-tabs .ant-tabs-tab:hover {
          color: var(--primary) !important;
        }
        
        .custom-tabs .ant-tabs-tab:hover .ant-tabs-tab-btn {
          color: var(--primary) !important;
        }
        
        [data-theme="dark"] .custom-tabs .ant-tabs-tab {
          color: var(--text) !important;
        }
        
        [data-theme="dark"] .custom-tabs .ant-tabs-tab .ant-tabs-tab-btn {
          color: var(--text) !important;
        }
        
        /* Đảm bảo ink-bar hoạt động đúng */
        .custom-tabs .ant-tabs-nav::before {
          border-bottom: none !important;
        }
        
        .custom-tabs .ant-tabs-content-holder {
          border-top: none;
        }
      `}</style>
    </div>
  );
};

export default Tabs;