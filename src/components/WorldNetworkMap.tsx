import React, { useState } from 'react';
import { ConnectionState, ServerNode } from '../types/vpn';
import { computeSmartScore } from '../data/vpnData';

interface WorldNetworkMapProps {
  servers: ServerNode[];
  selectedServer: ServerNode;
  connectionState: ConnectionState;
  onSelectServer: (server: ServerNode) => void;
  originCoords?: [number, number];
}

export const WorldNetworkMap: React.FC<WorldNetworkMapProps> = ({
  servers,
  selectedServer,
  connectionState,
  onSelectServer,
  originCoords = [265, 172],
}) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const hoveredServer = servers.find((s) => s.id === hoveredId) ?? null;

  const isConnected = connectionState === 'connected';
  const isConnecting = connectionState === 'connecting' || connectionState === 'reconnecting';
  const isBlocked = connectionState === 'killswitch_blocked';

  // Curved quadratic bezier path between origin and active server
  const [ox, oy] = originCoords;
  const [dx, dy] = selectedServer.coords;
  const midX = (ox + dx) / 2;
  const dist = Math.hypot(dx - ox, dy - oy);
  const arcLift = Math.min(120, Math.max(24, dist * 0.25));
  const midY = Math.min(oy, dy) - arcLift;
  const pathData = `M ${ox} ${oy} Q ${midX} ${midY} ${dx} ${dy}`;

  const strokeColor = isBlocked
    ? '#dc2626'
    : isConnected
    ? '#3b82f6'
    : isConnecting
    ? '#d97706'
    : '#475569';

  return (
    <div className="relative w-full overflow-hidden rounded-lg border border-slate-800/90 bg-[#0B111E]">
      <div className="flex items-center justify-between border-b border-slate-800/80 px-4 py-2.5 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="font-medium text-slate-200">Global Backbone Topology</span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="font-mono-tabular">{servers.filter((s) => s.health !== 'unreachable').length} of {servers.length} POPs Reachable</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-blue-500" />
            Active Exit
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-emerald-500" />
            Nominal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-amber-500" />
            Elevated Load
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-2 w-2 rounded-sm bg-rose-500" />
            Unreachable
          </span>
        </div>
      </div>

      <div className="relative aspect-[2/1] w-full min-h-[240px]">
        <svg
          viewBox="0 0 1000 500"
          className="h-full w-full select-none"
          role="img"
          aria-label="Global VPN server network map"
        >
          <defs>
            <pattern id="map-grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#131C2E" strokeWidth="1" />
            </pattern>
          </defs>

          <rect width="1000" height="500" fill="#0B111E" />
          <rect width="1000" height="500" fill="url(#map-grid)" />

          {/* Simplified, clean vector continent polygons */}
          <g fill="#141F33" stroke="#22314C" strokeWidth="1.1" strokeLinejoin="round">
            {/* North America */}
            <path d="M 76 92 L 154 68 L 245 64 L 316 86 L 334 128 L 298 164 L 265 186 L 236 218 L 218 248 L 194 242 L 166 206 L 136 184 L 112 152 L 84 126 Z" />
            {/* Greenland */}
            <path d="M 338 40 L 404 34 L 424 62 L 386 86 L 348 76 Z" />
            {/* South America */}
            <path d="M 248 264 L 308 260 L 368 296 L 382 342 L 344 398 L 308 446 L 284 440 L 274 378 L 252 318 Z" />
            {/* Europe */}
            <path d="M 454 96 L 516 74 L 584 82 L 594 126 L 566 164 L 522 174 L 478 178 L 456 154 L 464 124 Z" />
            {/* UK / Ireland */}
            <path d="M 464 114 L 478 110 L 482 138 L 464 138 Z" />
            {/* Africa */}
            <path d="M 458 196 L 538 190 L 598 228 L 620 278 L 588 346 L 552 396 L 518 392 L 498 326 L 460 276 L 444 232 Z" />
            {/* Middle East & Asia */}
            <path d="M 594 92 L 732 76 L 866 96 L 914 140 L 882 194 L 836 226 L 784 268 L 738 258 L 692 252 L 656 232 L 614 218 L 584 184 L 592 138 Z" />
            {/* Maritime SE Asia */}
            <path d="M 756 286 L 814 282 L 838 308 L 774 316 Z" />
            {/* Japan */}
            <path d="M 858 164 L 876 160 L 880 198 L 860 202 Z" />
            {/* Australia */}
            <path d="M 806 342 L 888 334 L 916 378 L 884 416 L 818 408 L 794 376 Z" />
          </g>

          {/* Origin Marker */}
          <g>
            <circle cx={ox} cy={oy} r={5} fill="#0F172A" stroke="#94A3B8" strokeWidth="1.5" />
            <text
              x={ox}
              y={oy - 11}
              textAnchor="middle"
              className="fill-slate-400 text-[10px] font-medium"
            >
              Client Origin
            </text>
          </g>

          {/* Tunnel Connection Arc */}
          {(isConnected || isConnecting || isBlocked) && (
            <g>
              <path
                d={pathData}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2"
                strokeDasharray={isConnected ? 'none' : '5 5'}
                strokeOpacity={0.9}
              />
              {isConnected && (
                <path
                  d={pathData}
                  fill="none"
                  stroke="#93c5fd"
                  strokeWidth="1"
                  strokeOpacity="0.45"
                />
              )}
            </g>
          )}

          {/* Server Nodes */}
          {servers.map((node) => {
            const [nx, ny] = node.coords;
            const isSelected = node.id === selectedServer.id;
            const isHovered = node.id === hoveredId;

            const fill =
              node.health === 'unreachable'
                ? '#f43f5e'
                : isSelected
                ? '#3b82f6'
                : node.health === 'elevated'
                ? '#f59e0b'
                : '#10b981';

            return (
              <g
                key={node.id}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredId(node.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectServer(node)}
              >
                {/* Invisible hit target for easy clicking */}
                <circle cx={nx} cy={ny} r={14} fill="transparent" />

                {isSelected && (
                  <circle
                    cx={nx}
                    cy={ny}
                    r={10}
                    fill="none"
                    stroke={isBlocked ? '#ef4444' : '#3b82f6'}
                    strokeWidth="1.5"
                    strokeOpacity="0.7"
                  />
                )}

                <circle
                  cx={nx}
                  cy={ny}
                  r={isSelected || isHovered ? 5.5 : 4}
                  fill={fill}
                  stroke="#090D16"
                  strokeWidth="1.5"
                />

                {(isSelected || isHovered) && (
                  <text
                    x={nx}
                    y={ny + 16}
                    textAnchor="middle"
                    className="fill-slate-100 text-[10px] font-semibold"
                  >
                    {node.city}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Node Tooltip Overlay */}
        {hoveredServer && (
          <div className="pointer-events-none absolute bottom-3 left-3 rounded-md border border-slate-700/80 bg-[#0F172A]/95 px-3 py-2 text-xs shadow-lg">
            <div className="flex items-center gap-2 font-medium text-slate-100">
              <span>{hoveredServer.city}, {hoveredServer.country}</span>
              <span className="text-slate-500">·</span>
              <span className="font-mono-tabular text-slate-300">{hoveredServer.latencyMs} ms</span>
            </div>
            <div className="mt-0.5 flex items-center gap-2 text-slate-400">
              <span>Load {hoveredServer.loadPct}%</span>
              <span>·</span>
              <span>Score {computeSmartScore(hoveredServer)}/100</span>
              <span>·</span>
              <span className={
                hoveredServer.health === 'nominal'
                  ? 'text-emerald-400'
                  : hoveredServer.health === 'elevated'
                  ? 'text-amber-400'
                  : 'text-rose-400'
              }>
                {hoveredServer.health === 'nominal'
                  ? 'Nominal'
                  : hoveredServer.health === 'elevated'
                  ? 'Elevated Load'
                  : 'Unreachable'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
