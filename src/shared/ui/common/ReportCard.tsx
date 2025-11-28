import React from 'react';
import { Card } from '@/shared/ui';

export interface ReportCardItem {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
}

export interface ReportCardProps {
  items: ReportCardItem[];
  className?: string;
}

export const ReportCard: React.FC<ReportCardProps> = ({ items, className }) => {
  return (
    <div className={`p-4 rounded-2xl bg-[var(--primay-extralight)] ${className || ''}`}> {/* Outer box */}
      <div className="grid grid-cols-2 gap-6">
        {items.map((item, idx) => (
          <Card key={idx} className="rounded-xl flex flex-col justify-between min-h-[120px]">
            <div className="flex items-center gap-2 mb-2">
              {item.icon && <span>{item.icon}</span>}
              <span className="text-secondary text-base font-medium">{item.label}</span>
            </div>
            <div className="text-2xl font-semibold text-primary">
              {item.value}
              {item.unit && <span className="text-base font-normal ml-1">{item.unit}</span>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReportCard;
