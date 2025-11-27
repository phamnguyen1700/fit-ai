import React from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler,
  ChartOptions,
  ChartData,
  ChartDataset,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler);

export type AreaSeriesItem = {
  name: string;
  color: string;
  data: number[];
  fillOpacity?: number; // 0..1
};

export interface AreaChartProps {
  series: AreaSeriesItem[];
  labels?: string[];
  height?: number;
  className?: string;
  options?: ChartOptions<'line'>;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  series,
  labels,
  height = 260,
  className,
  options: optionsOverride,
}) => {
  const maxLen = Math.max(...series.map(s => s.data.length));
  const effectiveLabels = labels && labels.length >= maxLen
    ? labels.slice(0, maxLen)
    : Array.from({ length: maxLen }, (_, i) => String(i + 1));

  const chartData: ChartData<'line'> = {
    labels: effectiveLabels,
    datasets: series.map((s, idx) => {
      const color = s.color;
      const fillOpacity = s.fillOpacity ?? 0.2;
      return {
        label: s.name,
        data: s.data,
        borderColor: color,
        backgroundColor: (ctx: any) => {
          const gradient = ctx.chart.ctx.createLinearGradient(0, 0, 0, ctx.chart.height);
          gradient.addColorStop(0, color + (fillOpacity < 1 ? Math.floor(fillOpacity * 255).toString(16).padStart(2, '0') : ''));
          gradient.addColorStop(1, color + '00');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointHoverRadius: 7,
        pointHoverBackgroundColor: color,
        pointHoverBorderColor: '#22223b',
        segment: {
          borderDash: undefined,
        },
      } as ChartDataset<'line'>;
    }),
  };

  const defaultOptions: ChartOptions<'line'> = {
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        backgroundColor: '#23233b',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#fff',
        borderWidth: 0,
        padding: 12,
        caretSize: 8,
        displayColors: false,
        callbacks: {
          label: (ctx) => ctx.formattedValue,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: '#8A8A8A',
          font: { weight: 600, size: 14 },
        },
      },
      y: {
        grid: {
          color: '#E5E7EB',
          tickBorderDash: [2, 6],
        },
        ticks: {
          color: '#8A8A8A',
          font: { weight: 600, size: 14 },
        },
        beginAtZero: true,
      },
    },
    elements: {
      line: {
        fill: true,
      },
    },
    interaction: {
      mode: 'index',
      intersect: false,
    },
  };

  const mergedOptions: ChartOptions<'line'> = {
    ...defaultOptions,
    ...(optionsOverride ?? {}),
    plugins: {
      ...(defaultOptions.plugins ?? {}),
      ...(optionsOverride?.plugins ?? {}),
    },
    scales: {
      ...(defaultOptions.scales ?? {}),
      ...(optionsOverride?.scales ?? {}),
    },
  };

  return (
    <div className={className} style={{ width: '100%', height }}>
      <Line data={chartData} options={mergedOptions} />
    </div>
  );
};

export default AreaChart;
