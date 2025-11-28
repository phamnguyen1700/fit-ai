import React, { useMemo } from 'react';
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData,
  ScriptableContext,
  PointStyle,
  ChartDataset,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

export type SeriesItem = {
  name: string;
  color: string;
  data: number[];
};

export interface LineChartProps {
  series: SeriesItem[];         // required
  labels?: string[];           // optional labels for x-axis (length should match data length)
  height?: number;             // px height (default 220)
  showLegend?: boolean;        // if true, Chart's legend shown (default false; you may show externally)
  dashed?: boolean;            // dashed lines (default true to match screenshot)
  className?: string;
  options?: ChartOptions<'line'>; // optional extra overrides
}

/* --- helpers (implementations match your snippet behavior) --- */
function hexToRgba(hex: string, alpha = 1) {
  const h = hex.replace('#', '');
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Use ScriptableContext<'line'> (not 'point') — Chart.js typings expect a chart type key.
 * Inside the function you can still access ctx.dataIndex / ctx.datasetIndex to get point info.
 */
function makeHalfAsOpaque(ctx: ScriptableContext<'line'>) {
  const ds = ctx.dataset as ChartDataset<'line'>;
  const c = Array.isArray(ds.backgroundColor) ? ds.backgroundColor[ctx.dataIndex ?? 0] : ds.backgroundColor;
  if (!c || typeof c !== 'string') return c;
  return hexToRgba(c, 0.45);
}

function alternatePointStyles(ctx: ScriptableContext<'line'>): PointStyle  {
  const index = ctx.dataIndex ?? 0;
  return index % 2 === 0 ? 'circle' : 'rect';
}

function adjustRadiusBasedOnData(ctx: ScriptableContext<'line'>) {
  // ctx.parsed?.y contains the parsed y value for line chart
  const v = Number(ctx.parsed?.y ?? ctx.raw ?? 0);
  if (v < 10) return 4;
  if (v < 25) return 6;
  if (v < 50) return 8;
  if (v < 75) return 10;
  return 12;
}

/* --- component --- */
export const LineChart: React.FC<LineChartProps> = ({
  series,
  labels,
  height = 220,
  showLegend = false,
  dashed = true,
  className,
  options: optionsOverride,
}) => {
  const maxLen = useMemo(() => {
    let l = 0;
    for (const s of series) if (s.data.length > l) l = s.data.length;
    return l;
  }, [series]);

  const effectiveLabels = useMemo(() => {
    if (labels && labels.length >= maxLen) return labels.slice(0, maxLen);
    return Array.from({ length: maxLen }, (_, i) => String(i + 1));
  }, [labels, maxLen]);

  const chartData: ChartData<'line'> = useMemo(() => {
    const datasets: ChartDataset<'line'>[] = series.map((s) => ({
      label: s.name,
      data: s.data.slice(0, maxLen),
      borderColor: s.color,
      backgroundColor: s.color,
      borderWidth: 2,
      tension: 0.4,
      // scriptable props use ScriptableContext<'line'>
      // pointStyle returns ChartPointStyle
      pointStyle: (ctx: ScriptableContext<'line'>) => alternatePointStyles(ctx),
      pointRadius: (ctx: ScriptableContext<'line'>) => adjustRadiusBasedOnData(ctx),
      pointBackgroundColor: (ctx: ScriptableContext<'line'>) => {
        // try to return dataset backgroundColor or fallback to series color
        const ds = ctx.dataset as ChartDataset<'line'>;
        if (ds?.backgroundColor && typeof ds.backgroundColor === 'string') return ds.backgroundColor;
        if (Array.isArray(ds?.backgroundColor)) return ds.backgroundColor[ctx.dataIndex ?? 0];
        return s.color;
      },
      pointHoverBackgroundColor: (ctx: ScriptableContext<'line'>) => makeHalfAsOpaque(ctx),
      pointHoverRadius: 14,
      fill: false,
      borderDash: dashed ? [6, 6] : undefined,
    }));
    return { labels: effectiveLabels, datasets };
  }, [series, effectiveLabels, maxLen, dashed]);

  const defaultOptions: ChartOptions<'line'> = useMemo(
    () => ({
      maintainAspectRatio: false,
      plugins: {
        legend: { display: showLegend },
        tooltip: { enabled: true, mode: 'nearest', intersect: false },
      },
      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          grid: {
            color: '#f1f5f9',
            borderDash: [2, 6],
          },
          beginAtZero: true,
        },
      },
      elements: {
        line: {
          fill: false,
          backgroundColor: (ctx: ScriptableContext<'line'>) => {
            const ds = ctx.dataset as ChartDataset<'line'>;
            return Array.isArray(ds.backgroundColor) ? ds.backgroundColor[ctx.dataIndex ?? 0] : ds.backgroundColor;
          },
        },
        point: {
          // no static overrides here; dataset-level scriptable props handle points
        },
      },
      interaction: {
        mode: 'index',
        intersect: false,
      },
    }),
    [showLegend]
  );

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

export default LineChart;
