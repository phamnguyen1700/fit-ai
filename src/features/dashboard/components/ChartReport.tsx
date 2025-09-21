import React from 'react';
import LineChart, { SeriesItem } from '@/shared/ui/core/LineChart';
import PieChart from '@/shared/ui/core/PieChart';
import MultiCircleChart from '@/shared/ui/core/MultiCircleChart';
import AreaChart, { AreaSeriesItem } from '@/shared/ui/core/AreaChart';

const lineSeries: SeriesItem[] = [
  {
    name: '18-20',
    color: '#7C3AED',
    data: [10, 30, 60, 90, 60, 30, 10],
  },
  {
    name: '20-25',
    color: '#FBBF24',
    data: [20, 50, 80, 40, 30, 60, 20],
  },
  {
    name: '>30',
    color: '#60A5FA',
    data: [5, 20, 40, 60, 40, 20, 5],
  },
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
  {
    name: 'Doanh thu',
    color: '#2563EB',
    data: [0, 10, 25, 55, 80, 120, 150],
    fillOpacity: 0.25,
  },
  {
    name: 'Dự đoán',
    color: '#A5B4FC',
    data: [0, 15, 35, 60, 100, 160, 200],
    fillOpacity: 0.15,
  },
  {
    name: 'Kỳ vọng',
    color: '#7C3AED',
    data: [0, 20, 40, 80, 130, 180, 250],
    fillOpacity: 0.10,
  },
];

const areaLabels = [
  '1 - 10 Aug',
  '11 - 20 Aug',
  '21 - 30 Aug',
  '1 - 10 Nov',
  '11 - 20 Nov',
  '21 - 30 Nov',
  '1 - 10 Dec',
];

const ChartReport: React.FC = () => {
  return (
    <div className="w-full bg-white border border-[var(--primary)] rounded-xl p-4">
      {/* Phân tích + LineChart */}
      <div className="mb-4">
        <div className="text-xl font-semibold text mb-2">Phân tích</div>
        <div className="bg-white rounded-xl p-4 mt-2">
          <div className="mb-4">
            <div className="bg-[var(--primay-extralight)] w-full ">
              <div className="text text-base sm:text-lg font-semibold inline-block px-3 py-1 rounded-t-md">Tỷ lệ tăng trưởng user</div>
              <div className="h-[2px] w-full bg-[var(--primary)] mt-1" />
            </div>
          </div>
          <div className="flex items-center justify-end gap-4 mb-4">
            <span className="flex items-center gap-1 text-sm"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#7C3AED'}}></span>18-20</span>
            <span className="flex items-center gap-1 text-sm"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#FBBF24'}}></span>20-25</span>
            <span className="flex items-center gap-1 text-sm"><span className="inline-block w-3 h-3 rounded-full" style={{background:'#60A5FA'}}></span>&gt;30</span>
          </div>
          <div className="mt-4">
            <LineChart series={lineSeries} height={220} dashed className="bg-transparent" />
          </div>
        </div>
      </div>
      {/* PieChart + MultiCircleChart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {/* PieChart */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-center mt-2">
          <div className="bg-[var(--primay-extralight)] w-full flex flex-col items-start">
            <div className="text text-base sm:text-lg font-semibold inline-block px-3 py-1 rounded-t-md">Người dùng hiện tại</div>
            <div className="h-[2px] w-full bg-[var(--primary)] mt-1" />
          </div>
          <PieChart data={pieData} size={220} innerRadius={70} className="mt-5"/>
          <div className="mt-6 w-full flex flex-col items-center">
            {pieData.map((item) => (
              <div key={item.label} className="flex items-center gap-3 mb-2 w-56 justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{ background: item.color }}></span>
                  <span className="text-secondary text-base">{item.label}</span>
                </div>
                <span className="text-secondary text-base font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
        {/* MultiCircleChart */}
        <div className="bg-white rounded-xl p-6 flex flex-col items-center mt-2">
          <div className="bg-[var(--primay-extralight)] w-full flex flex-col items-start">
            <div className="text text-base sm:text-lg font-semibold inline-block px-3 py-1 rounded-t-md">Gói đăng ký</div>
            <div className="h-[2px] w-full bg-[var(--primary)] mt-1" />
          </div>
          <div className="mt-5">
          <MultiCircleChart values={multiCircleData} colors={multiCircleColors} size={220} strokeWidth={14} />
          </div>
          <div className="mt-6 w-full flex flex-col items-center">
            {multiCircleLegend.map((item) => (
              <div key={item.label} className="flex items-center gap-3 mb-2 w-56 justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{ background: item.color }}></span>
                  <span className="text-secondary text-base">{item.label}</span>
                </div>
                <span className="text-secondary text-base font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* AreaChart */}
      <div className="mt-10">
        <div className="bg-[var(--primay-extralight)] w-full ">
              <div className="text text-base sm:text-lg font-semibold inline-block px-3 py-1 rounded-t-md">Tỷ lệ doanh thu theo thời gian</div>
              <div className="h-[2px] w-full bg-[var(--primary)] mt-1" />
            </div>
        <div className="bg-white rounded-xl p-6 mt-2">
          <div className="text-[2.5rem] font-extrabold text-[#23233b] mb-[-2.5rem]">75%</div>
          <div className="flex items-center justify-end gap-2 mb-4">
            <button className="px-3 py-1 rounded bg-[#f5f5f5] text-[#23233b] font-semibold text-sm">Ngày</button>
            <button className="px-3 py-1 rounded bg-[#f5f5f5] text-[#23233b] font-semibold text-sm">Tháng</button>
            <button className="px-3 py-1 rounded bg-[#f5f5f5] text-[#23233b] font-semibold text-sm">Năm</button>
          </div>
          <div className="mt-4">
            <AreaChart series={areaSeries} labels={areaLabels} height={260} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartReport;
