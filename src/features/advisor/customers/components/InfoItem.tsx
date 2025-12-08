'use client';

import React from 'react';

interface InfoItemProps {
  label: string;
  value?: React.ReactNode;
}

export const InfoItem: React.FC<InfoItemProps> = ({ label, value }) => (
  <div className="flex flex-col gap-1 rounded-lg border border-[var(--border)] p-3">
    <span className="text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{label}</span>
    <span className="text-sm font-medium text-[var(--text)]">{value ?? '--'}</span>
  </div>
);

