import React from 'react';
import ReportCard, { ReportCardItem } from '@/shared/ui/common/ReportCard';
import Select from '@/shared/ui/core/Select';

const reportItems: ReportCardItem[] = [
  {
    label: 'Doanh thu',
    value: '20.000.000',
    unit: 'đ',
    // icon: <YourIconComponent />
  },
  {
    label: 'Người dùng hiện tại',
    value: 27,
    unit: 'người',
  },
  {
    label: 'Số bài tập',
    value: 10,
    unit: 'bài',
  },
  {
    label: 'Feedback mới',
    value: 5,
    unit: 'feedback',
  },
  {
    label: 'Số thực đơn',
    value: 10,
    unit: 'thực đơn',
  },
  {
    label: 'Số gói đã tạo',
    value: 2,
    unit: 'gói',
  },
];

const ReportTable: React.FC = () => {
  return (
    <div className="w-full p-6 rounded-2xl bg [bg-[var(--bg)]] shadow">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-xl font-semibold text">Tổng quan thống kê</h2>
        <div className="flex gap-2 flex-wrap">
          <Select
            className="min-w-[90px] themed-select !text !font-semibold"
            defaultValue="Loại"
            options={[{ value: 'Loại', label: 'Loại' }]}
          />
          <Select
            className="min-w-[110px] themed-select !text"
            defaultValue="Thời gian"
            options={[{ value: 'Thời gian', label: 'Thời gian' }]}
          />
        </div>
      </div>      
      <ReportCard items={reportItems} />
    </div>
  );
};

export default ReportTable;
