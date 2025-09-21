import React from 'react';
import LineChart, { SeriesItem } from '@/shared/ui/core/LineChart';
import PieChart from '@/shared/ui/core/PieChart';
import MultiCircleChart from '@/shared/ui/core/MultiCircleChart';
import AreaChart, { AreaSeriesItem } from '@/shared/ui/core/AreaChart';

// Card component for reusability
const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`bg-[var(--bg)] rounded-xl ${className}`}>
    {children}
  </div>
);

// Chart header component
const ChartHeader: React.FC<{ title: string }> = ({ title }) => (
  <div className="bg-[var(--primay-extralight)] w-full">
    <div className="text text-base sm:text-lg font-semibold inline-block px-3 py-1 rounded-t-md text-[var(--text)]">
      {title}
    </div>
    <div className="h-[2px] w-full bg-[var(--primary)] mt-1" />
  </div>
);

// Legend component for charts
const Legend: React.FC<{ items: Array<{ color: string; label: string; value?: number }> }> = ({ items }) => (
  <div className="mt-6 w-full flex flex-col items-center">
    {items.map((item) => (
      <div key={item.label} className="flex items-center gap-3 mb-2 w-56 justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 h-4 rounded-full" style={{ background: item.color }}></span>
          <span className="text-secondary text-base text-[var(--text)]">{item.label}</span>
        </div>
        {item.value && (
          <span className="text-secondary text-base font-medium text-[var(--text)]">{item.value}</span>
        )}
      </div>
    ))}
  </div>
);

// Data constants
const lineSeries: SeriesItem[] = [
  { name: '18-20', color: '#7C3AED', data: [10, 30, 60, 90, 60, 30, 10] },
  { name: '20-25', color: '#FBBF24', data: [20, 50, 80, 40, 30, 60, 20] },
  { name: '>30', color: '#60A5FA', data: [5, 20, 40, 60, 40, 20, 5] },
];

const pieData = [
  { label: 'Approved', value: 410, color: '#2563EB' },
  { label: 'Pending', value: 142, color: '#A5B4FC' },
  { label: 'Under review', value: 340, color: '#7C3AED' },
  { label: 'Rejected', value: 590, color: '#E5E7EB' },
];

const multiCircleData = [0.75, 0.5, 0.35];
const multiCircleColors = ['#7C3AED', '#A5B4FC', '#2563EB'];
const multiCircleLegend = [
  { color: '#2563EB', label: 'Approved', value: 410 },
  { color: '#A5B4FC', label: 'Pending', value: 142 },
  { color: '#7C3AED', label: 'Under review', value: 340 },
  { color: '#E5E7EB', label: 'Rejected', value: 590 },
];

const areaSeries: AreaSeriesItem[] = [
  { name: 'Doanh thu', color: '#2563EB', data: [0, 10, 25, 55, 80, 120, 150], fillOpacity: 0.25 },
  { name: 'Dự đoán', color: '#A5B4FC', data: [0, 15, 35, 60, 100, 160, 200], fillOpacity: 0.15 },
  { name: 'Kỳ vọng', color: '#7C3AED', data: [0, 20, 40, 80, 130, 180, 250], fillOpacity: 0.10 },
];

const areaLabels = [
  '1 - 10 Aug', '11 - 20 Aug', '21 - 30 Aug', '1 - 10 Nov',
  '11 - 20 Nov', '21 - 30 Nov', '1 - 10 Dec'
];

const ChartReport: React.FC = () => {
  return (
    <Card className="w-full border border-[var(--primary)] p-4">
      {/* Line Chart Section */}
      <div className="mb-4">
        <div className="text-xl font-semibold mb-2 text-[var(--text)]">Phân tích</div>
        <Card className="p-4 mt-2">
          <div className="mb-4">
            <ChartHeader title="Tỷ lệ tăng trưởng user" />
          </div>
          <div className="flex items-center justify-end gap-4 mb-4">
            {lineSeries.map(({ name, color }) => (
              <span key={name} className="flex items-center gap-1 text-sm">
                <span className="inline-block w-3 h-3 rounded-full" style={{ background: color }}></span>
                {name}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <LineChart series={lineSeries} height={220} dashed className="bg-transparent" />
          </div>
        </Card>
      </div>

      {/* Pie Chart and Multi Circle Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* Pie Chart */}
        <Card className="p-6 flex flex-col items-center mt-2">
          <ChartHeader title="Người dùng hiện tại" />
          <PieChart data={pieData} size={220} innerRadius={70} className="mt-5" />
          <Legend items={pieData} />
        </Card>

        {/* Multi Circle Chart */}
        <Card className="p-6 flex flex-col items-center mt-2">
          <ChartHeader title="Gói đăng ký" />
          <div className="mt-5">
            <MultiCircleChart 
              values={multiCircleData} 
              colors={multiCircleColors} 
              size={220} 
              strokeWidth={14} 
              legend={multiCircleLegend} 
            />
          </div>
          <Legend items={multiCircleLegend} />
        </Card>
      </div>

      {/* Area Chart */}
      <div className="mt-10">
        <ChartHeader title="Tỷ lệ doanh thu theo thời gian" />
        <Card className="p-6 mt-2">
          <div className="text-[2.5rem] font-extrabold text-[var(--text)] mb-[-2.5rem]">75%</div>
          <div className="flex items-center justify-end gap-2 mb-4">
            {['Ngày', 'Tháng', 'Năm'].map((period) => (
              <button 
                key={period}
                className="px-3 py-1 rounded bg-[var(--bg-secondary)] text-[var(--text)] font-semibold text-sm"
              >
                {period}
              </button>
            ))}
          </div>
          <div className="mt-4">
            <AreaChart series={areaSeries} labels={areaLabels} height={260} />
          </div>
        </Card>
      </div>
    </Card>
  );
};

export default ChartReport;