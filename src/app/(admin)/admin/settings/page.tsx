// # /admin/settings
'use client';

import React from 'react';
import { ThemeToggle } from '@/shared/ui';
import { SettingPage } from '@/features/setting';

export default function AdminSettingsPage() {
  return (
    <div style={{ padding: '16px' }}>
      {/* <h3 style={{ marginBottom: '12px', color: 'var(--text)' }}>Giao diện</h3>
      <ThemeToggle /> */}
      <SettingPage />
    </div>
  );
}
