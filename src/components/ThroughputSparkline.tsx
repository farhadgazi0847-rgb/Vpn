import React from 'react';
import { ThroughputPoint } from '../types/vpn';

interface ThroughputSparklineProps {
  data: ThroughputPoint[];
  connected: boolean;
}

export const ThroughputSparkline: React.FC<ThroughputSparklineProps> = ({ data, connected }) => {
  const width = 560;
  const height = 116;
  const padX = 6;
  const padY = 10;

  const maxSpeed = Math.max(
    120,
    ...data.map((d) => Math.max(d.downloadMbps, d.uploadMbps))
  );

  const buildPath = (accessor: (p: ThroughputPoint) => number) => {
    if (data.length < 2) return '';
    return data
      .map((point, idx) => {
        const x = padX + (idx / (data.length - 1)) * (width - padX * 2);
        const y = height - padY - (accessor(point) / maxSpeed) * (height - padY * 2);
        return `${idx === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
      })
      .join(' ');
  };

  const buildArea = (accessor: (p: ThroughputPoint) => number) => {
    const line = buildPath(accessor);
    if (!line) return '';
    const lastX = width - padX;
    return `${line} L ${lastX} ${height - padY} L ${padX} ${height - padY} Z`;
  };

  const downPath = buildPath((d) => d.downloadMbps);
  const downArea = buildArea((d) => d.downloadMbps);
  const upPath = buildPath((d) => d.uploadMbps);

  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-200">
            <span className="inline-block h-1.5 w-3 bg-blue-500" />
            Download Mbps
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <span className="inline-block h-1.5 w-3 bg-emerald-500" />
            Upload Mbps
          </span>
        </div>
        <span className="font-mono-tabular text-slate-500">
          Peak scale {Math.round(maxSpeed)} Mbps
        </span>
      </div>

      <div className="relative h-[116px] w-full overflow-hidden rounded-md border border-slate-800/80 bg-[#090D16]">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="downGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.01" />
            </linearGradient>
          </defs>

          {/* Horizontal reference rules */}
          {[0.25, 0.5, 0.75].map((ratio) => {
            const y = padY + ratio * (height - padY * 2);
            return (
              <line
                key={ratio}
                x1={padX}
                y1={y}
                x2={width - padX}
                y2={y}
                stroke="#1E293B"
                strokeWidth="1"
                strokeDasharray="3 3"
              />
            );
          })}

          {connected && downArea && <path d={downArea} fill="url(#downGrad)" />}
          {downPath && (
            <path
              d={downPath}
              fill="none"
              stroke={connected ? '#3b82f6' : '#334155'}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          )}
          {upPath && (
            <path
              d={upPath}
              fill="none"
              stroke={connected ? '#10b981' : '#1e293b'}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
          )}
        </svg>

        {!connected && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-slate-500">
            Tunnel inactive — connect to observe live encrypted throughput
          </div>
        )}
      </div>
    </div>
  );
};
