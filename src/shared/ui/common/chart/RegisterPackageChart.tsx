import React from 'react';
import MultiCircleChart from '@/shared/ui/core/MultiCircleChart';

const chartData = [0.75, 0.5, 0.35];
const chartColors = [
  '#7C3AED', // Under review
  '#A5B4FC', // Pending
  '#2563EB', // Approved
];

const legend = [
  { color: '#2563EB', label: 'Approved', value: 410 },
  { color: '#A5B4FC', label: 'Pending', value: 142 },
  { color: '#7C3AED', label: 'Under review', value: 340 },
  { color: '#E5E7EB', label: 'Rejected', value: 590 },
];

const RegisterPackageChart: React.FC = () => {
  return (
    <div className="bg-[var(--primay-extralight)] rounded-xl p-6">
      <div className="mb-2 text-xl font-semibold text border-b border-[var(--primary)] pb-2">Gói đăng ký</div>
      <div className="flex flex-col items-center">
        <MultiCircleChart values={chartData} colors={chartColors} size={280} strokeWidth={14} />
        <div className="mt-8 w-full flex flex-col items-center">
          {legend.map((item, idx) => (
            <div key={item.label} className="flex items-center gap-3 mb-2 w-56 justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block w-4 h-4 rounded-full" style={{ background: item.color }}></span>
                <span className="text text-base">{item.label}</span>
              </div>
              <span className="text text-base font-medium">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RegisterPackageChart;
