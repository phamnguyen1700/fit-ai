'use client';

import ReportTable from './components/ReportTable';
import ChartReport from './components/ChartReport';

export default function Dashboard() {
  return (
    <div >
      <div className="mb-8">
        <ReportTable />
      </div>
      <ChartReport />
    </div>
  );
}