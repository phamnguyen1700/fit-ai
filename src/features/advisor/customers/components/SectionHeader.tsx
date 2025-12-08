'use client';

import React from 'react';
import { Icon } from '@/shared/ui/icon';

interface SectionHeaderProps {
  icon: string;
  title: string;
  helper?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ icon, title, helper }) => (
  <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-3">
    <div className="flex items-center gap-3">
      <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--bg-tertiary)]">
        <Icon name={icon} size={18} className="text-[var(--primary)]" />
      </span>
      <div className="flex flex-col">
        <span className="text-base font-semibold text-[var(--text)]">{title}</span>
        {helper && <span className="text-xs font-medium text-[var(--text-secondary)]">{helper}</span>}
      </div>
    </div>
  </div>
);

