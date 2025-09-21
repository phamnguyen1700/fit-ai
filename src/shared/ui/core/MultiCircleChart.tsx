import React, { useState } from 'react';

interface MultiCircleChartProps {
  values: number[]; // 0..1
  colors?: string[];
  size?: number;
  strokeWidth?: number;
  legend?: { label: string; value: number; color?: string }[];
}

const defaultColors = [
  '#7C3AED', // outer
  '#6366F1', // middle
  '#2563EB', // inner
];

export const MultiCircleChart: React.FC<MultiCircleChartProps> = ({
  values,
  colors = defaultColors,
  size = 320,
  strokeWidth = 14,
  legend,
}) => {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);
  const radii = [size / 2 - strokeWidth / 2, size / 2 - strokeWidth * 1.5, size / 2 - strokeWidth * 2.5];
  const bgColor = '#E5E7EB'; // gray-200
  const center = size / 2;

  // Tooltip content
  const tooltip =
    hoverIdx !== null && legend && legend[hoverIdx] ? (
      <div
        style={{
          position: 'absolute',
          left: `50%`,
          top: `50%`,
          transform: 'translate(-50%, -120%)',
          background: '#23233b',
          color: '#fff',
          borderRadius: 6,
          padding: '6px 12px',
          fontSize: 14,
          pointerEvents: 'none',
          zIndex: 10,
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          whiteSpace: 'nowrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 6, background: legend[hoverIdx].color || colors[hoverIdx], display: 'inline-block', marginRight: 6 }} />
          <span style={{ fontWeight: 600 }}>{legend[hoverIdx].label}</span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 2 }}>{legend[hoverIdx].value}</div>
      </div>
    ) : null;

  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size}>
        {radii.map((r, i) => {
          const circ = 2 * Math.PI * r;
          const val = values[i] ?? 0;
          return (
            <g key={i}>
              {/* Background circle */}
              <circle
                cx={center}
                cy={center}
                r={r}
                stroke={bgColor}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Value arc */}
              <circle
                cx={center}
                cy={center}
                r={r}
                stroke={colors[i] || defaultColors[i]}
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circ}
                strokeDashoffset={circ * (1 - val)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.6s', cursor: legend ? 'pointer' : undefined }}
                transform={`rotate(-90 ${center} ${center})`}
                onMouseEnter={() => setHoverIdx(i)}
                onMouseLeave={() => setHoverIdx(null)}
              />
            </g>
          );
        })}
      </svg>
      {tooltip}
    </div>
  );
};

export default MultiCircleChart;
