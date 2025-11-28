'use client';
// src/shared/ui/core/PieChart.tsx
import React, { useMemo, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions,
  ChartData,
  Plugin,
  ChartDataset,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export type PieDatum = {
  label: string;
  value: number;
  color?: string;
};

export interface PieChartProps {
  data: PieDatum[];               // required: [{label, value, color?}, ...]
  size?: number;                  // diameter in px (default 200)
  innerRadius?: number;           // px of inner hole (default 70)
  showCenterLabel?: boolean;      // show total in center (default false)
  onSegmentClick?: (i: number, d: PieDatum) => void;
  className?: string;
  // optionally pass Chart options override
  options?: ChartOptions<'doughnut'>;
}

/**
 * PieChart component (Doughnut) compatible with Chart.js v4 + react-chartjs-2 v5.
 * Accepts colors per-datum via data[].color. Negative values are allowed (display uses absolute).
 */
export const PieChart: React.FC<PieChartProps> = ({
  data,
  size = 200,
  innerRadius = 70,
  showCenterLabel = false,
  onSegmentClick,
  className,
  options: optionsOverride,
}) => {
  const chartRef = useRef<ChartJS<'doughnut'> | null>(null);

  const labels = useMemo(() => data.map(d => d.label), [data]);
  const rawValues = useMemo(() => data.map(d => d.value), [data]);
  const absValues = useMemo(() => rawValues.map(v => Math.abs(v)), [rawValues]);
  const colors = useMemo(
    () =>
      data.map((d, i) => {
        if (d.color) return d.color;
        // fallback palette
        const fallback = ['#FFB476', '#FFD9B0', '#FFEAD1', '#FF9B3D', '#8AA6FF', '#9ED5FF'];
        return fallback[i % fallback.length];
      }),
    [data]
  );

  // center label plugin (draw total)
  const centerLabelPlugin: Plugin<'doughnut'> = useMemo(
    () => ({
      id: 'centerLabel',
      beforeDraw: (chart) => {
        if (!showCenterLabel) return;
        const { ctx, chartArea: area } = chart;
        const total = absValues.reduce((a, b) => a + b, 0);
        const txt = String(total);
        ctx.save();
        ctx.font = '600 16px Inter, sans-serif';
        ctx.fillStyle = '#111827';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const cx = (area.left + area.right) / 2;
        const cy = (area.top + area.bottom) / 2;
        ctx.fillText(txt, cx, cy);
        ctx.restore();
      },
    }),
    [absValues, showCenterLabel]
  );

  const chartData: ChartData<'doughnut'> = useMemo(
    () => ({
      labels,
      datasets: [
        {
          data: absValues,
          backgroundColor: colors,
          hoverBackgroundColor: colors,
          borderWidth: 0,
        },
      ],
    }),
    [labels, absValues.join(','), colors.join(',')]
  );

  // Chart options
  const defaultOptions: ChartOptions<'doughnut'> = useMemo(
    () => ({
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: { enabled: true },
      },
      elements: {
        arc: {
          // per-arc functions are supported — keep if you want dynamic shading
          backgroundColor: (ctx) => {
            // ctx.raw is value; use dataset backgroundColor if provided
            const ds = ctx.dataset as ChartDataset<'doughnut'>;
            const index = ctx.dataIndex;
            if (ds?.backgroundColor && Array.isArray(ds.backgroundColor)) return ds.backgroundColor[index];
            return '#ccc';
          },
        },
      },
      // 'cutout' accepts string or number in v4
      cutout: `${Math.round((innerRadius / Math.max(size, 1)) * 100)}%`,
      // click handler
      onClick: (_evt, elements) => {
        if (!elements || elements.length === 0) return;
        const el = elements[0];
        const idx = el.index ?? 0;
        onSegmentClick?.(idx, data[idx]);
      },
    }),
    [data, innerRadius, onSegmentClick, size]
  );

  // merge override options shallowly (plugins / elements will be replaced if provided)
  const mergedOptions: ChartOptions<'doughnut'> = {
    ...defaultOptions,
    ...optionsOverride,
    plugins: {
      ...(defaultOptions.plugins ?? {}),
      ...(optionsOverride?.plugins ?? {}),
    },
  };

  return (
    <div className={className} style={{ width: size, height: size }}>
      <Doughnut
        ref={chartRef}
        data={chartData}
        options={mergedOptions}
        plugins={[centerLabelPlugin]}
      />
    </div>
  );
};

export default PieChart;
