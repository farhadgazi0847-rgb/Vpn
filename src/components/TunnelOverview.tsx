import React from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Lock,
  RefreshCw,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Star,
  Wifi,
  Zap,
} from 'lucide-react';
import { ConnectionState, ServerNode, ThroughputPoint, VpnProtocol } from '../types/vpn';
import { computeSmartScore, PROTOCOL_SPECS } from '../data/vpnData';
import { WorldNetworkMap } from './WorldNetworkMap';
import { ThroughputSparkline } from './ThroughputSparkline';

interface TunnelOverviewProps {
  servers: ServerNode[];
  selectedServer: ServerNode;
  connectionState: ConnectionState;
  protocol: VpnProtocol;
  killSwitchEnabled: boolean;
  dnsLeakProtection: boolean;
  splitTunnelEnabled: boolean;
  sessionSeconds: number;
  sessionDownMb: number;
  sessionUpMb: number;
  monthlyUsedGb: number;
  monthlyCapGb: number;
  usageAlertPct: number;
  throughputHistory: ThroughputPoint[];
  favoriteIds: string[];
  originIp: string;
  networkMedium: 'Wi-Fi (5 GHz)' | '5G Cellular';
  onToggleConnection: () => void;
  onConnectFastest: () => void;
  onSelectServer: (server: ServerNode) => void;
  onToggleFavorite: (id: string) => void;
  onSimulateDrop: () => void;
  onSimulateHandoff: () => void;
  onOpenServers: () => void;
}

function formatDuration(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;
  return [hrs, mins, secs].map((v) => String(v).padStart(2, '0')).join(':');
}

export const TunnelOverview: React.FC<TunnelOverviewProps> = ({
  servers,
  selectedServer,
  connectionState,
  protocol,
  killSwitchEnabled,
  dnsLeakProtection,
  splitTunnelEnabled,
  sessionSeconds,
  sessionDownMb,
  sessionUpMb,
  monthlyUsedGb,
  monthlyCapGb,
  usageAlertPct,
  throughputHistory,
  favoriteIds,
  originIp,
  networkMedium,
  onToggleConnection,
  onConnectFastest,
  onSelectServer,
  onToggleFavorite,
  onSimulateDrop,
  onSimulateHandoff,
  onOpenServers,
}) => {
  const isConnected = connectionState === 'connected';
  const isBusy = connectionState === 'connecting' || connectionState === 'reconnecting';
  const isKillSwitchBlocked = connectionState === 'killswitch_blocked';

  const activeSpec = PROTOCOL_SPECS.find((p) => p.id === protocol) ?? PROTOCOL_SPECS[0];
  const latestPoint = throughputHistory[throughputHistory.length - 1] ?? {
    downloadMbps: 0,
    uploadMbps: 0,
  };

  const smartTopServers = [...servers]
    .filter((s) => s.health !== 'unreachable')
    .sort((a, b) => computeSmartScore(b) - computeSmartScore(a))
    .slice(0, 3);

  const pinnedServers = servers.filter((s) => favoriteIds.includes(s.id)).slice(0, 4);

  const monthlyPct = Math.min(100, Math.round((monthlyUsedGb / monthlyCapGb) * 100));
  const nearQuota = monthlyPct >= usageAlertPct;

  const statusMeta = (() => {
    switch (connectionState) {
      case 'connected':
        return {
          label: 'Protected Tunnel Active',
          color: 'text-emerald-400',
          icon: <ShieldCheck className="h-5 w-5 text-emerald-400" />,
          buttonText: 'Disconnect',
          buttonClass: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
        };
      case 'connecting':
        return {
          label: 'Exchanging Keys & Negotiating Tunnel',
          color: 'text-amber-400',
          icon: <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />,
          buttonText: 'Cancel',
          buttonClass: 'bg-amber-600/20 hover:bg-amber-600/30 text-amber-200 border border-amber-500/40',
        };
      case 'reconnecting':
        return {
          label: 'Network Roaming — Re-establishing Socket',
          color: 'text-amber-400',
          icon: <RefreshCw className="h-5 w-5 animate-spin text-amber-400" />,
          buttonText: 'Disconnect',
          buttonClass: 'bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700',
        };
      case 'killswitch_blocked':
        return {
          label: 'Kill Switch Active — Unprotected Traffic Blocked',
          color: 'text-rose-400',
          icon: <ShieldAlert className="h-5 w-5 text-rose-400" />,
          buttonText: 'Reconnect Tunnel',
          buttonClass: 'bg-rose-600 hover:bg-rose-500 text-white',
        };
      case 'error':
        return {
          label: 'Node Unreachable — Failover Ready',
          color: 'text-rose-400',
          icon: <AlertTriangle className="h-5 w-5 text-rose-400" />,
          buttonText: 'Retry Connection',
          buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white',
        };
      default:
        return {
          label: 'Unprotected — Direct ISP Route',
          color: 'text-slate-400',
          icon: <Shield className="h-5 w-5 text-slate-400" />,
          buttonText: 'Connect Tunnel',
          buttonClass: 'bg-blue-600 hover:bg-blue-500 text-white',
        };
    }
  })();

  return (
    <div className="space-y-6">
      {/* Primary Connection Focal Control + Active Network Summary */}
      <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              {statusMeta.icon}
              <span className={`text-sm font-medium ${statusMeta.color}`}>
                {statusMeta.label}
              </span>
            </div>

            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h1 className="font-display text-2xl font-semibold tracking-tight text-slate-50 sm:text-3xl">
                {selectedServer.city}, {selectedServer.country}
              </h1>
              <span className="font-mono-tabular text-sm text-slate-400">
                {selectedServer.hostname}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
              <span>{activeSpec.name} ({activeSpec.cipher.split('·')[0].trim()})</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Medium: {networkMedium}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>Kill Switch: {killSwitchEnabled ? 'Strict Armed' : 'Disabled'}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>DNS Guard: {dnsLeakProtection ? 'In-Tunnel DoH' : 'System Default'}</span>
              {splitTunnelEnabled && (
                <>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-blue-400">Split Tunneling Active</span>
                </>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onConnectFastest}
              className="inline-flex items-center gap-2 rounded-md border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800 whitespace-nowrap shrink-0 cursor-pointer"
            >
              <Zap className="h-4 w-4 text-blue-400" />
              Fastest Server
            </button>

            <button
              type="button"
              onClick={onToggleConnection}
              className={`inline-flex min-w-[164px] items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${statusMeta.buttonClass}`}
            >
              <Lock className="h-4 w-4" />
              {statusMeta.buttonText}
            </button>
          </div>
        </div>

        {/* 4-column Key Connection Metrics Strip */}
        <div className="mt-6 grid grid-cols-1 gap-4 border-t border-slate-800/90 pt-5 sm:grid-cols-2 xl:grid-cols-4">
          <div>
            <div className="text-xs text-slate-400">Active Exit IP</div>
            <div className="mt-1 font-mono-tabular text-lg font-medium text-slate-100">
              {isConnected ? selectedServer.exitIp : isKillSwitchBlocked ? '0.0.0.0 (Blocked)' : originIp}
            </div>
            <div className="mt-0.5 font-mono-tabular text-xs text-slate-500">
              {isConnected ? `Origin ${originIp} masked` : 'Direct ISP address exposed'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Session Duration</div>
            <div className="mt-1 font-mono-tabular text-lg font-medium text-slate-100">
              {formatDuration(sessionSeconds)}
            </div>
            <div className="mt-0.5 font-mono-tabular text-xs text-slate-500">
              {isConnected
                ? `RTT ${selectedServer.latencyMs} ms · Load ${selectedServer.loadPct}%`
                : isBusy
                ? 'Completing cryptographic handshake'
                : 'Timer resets on new session'}
            </div>
          </div>

          <div>
            <div className="text-xs text-slate-400">Live Throughput</div>
            <div className="mt-1 flex items-center gap-4 font-mono-tabular text-lg font-medium text-slate-100">
              <span className="inline-flex items-center gap-1">
                <ArrowDown className="h-4 w-4 text-blue-400" />
                {isConnected ? latestPoint.downloadMbps.toFixed(1) : '0.0'}
                <span className="text-xs font-normal text-slate-400">Mbps</span>
              </span>
              <span className="inline-flex items-center gap-1">
                <ArrowUp className="h-4 w-4 text-emerald-400" />
                {isConnected ? latestPoint.uploadMbps.toFixed(1) : '0.0'}
                <span className="text-xs font-normal text-slate-400">Mbps</span>
              </span>
            </div>
            <div className="mt-0.5 font-mono-tabular text-xs text-slate-500">
              Session transfer: {(sessionDownMb + sessionUpMb).toFixed(1)} MB
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Monthly Allowance</span>
              <span className={`font-mono-tabular ${nearQuota ? 'text-amber-400' : 'text-slate-300'}`}>
                {monthlyUsedGb.toFixed(1)} / {monthlyCapGb} GB
              </span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-sm bg-slate-800">
              <div
                className={`h-full transition-all duration-300 ${
                  nearQuota ? 'bg-amber-500' : 'bg-blue-500'
                }`}
                style={{ width: `${monthlyPct}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center justify-between text-xs text-slate-500">
              <span>{monthlyPct}% utilized</span>
              <span>Alert threshold {usageAlertPct}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Split: Topology Map + Live Throughput Chart */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-7">
          <WorldNetworkMap
            servers={servers}
            selectedServer={selectedServer}
            connectionState={connectionState}
            onSelectServer={onSelectServer}
          />
        </div>

        <div className="flex flex-col justify-between rounded-lg border border-slate-800 bg-[#0F1624] p-5 xl:col-span-5">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="font-display text-base font-semibold text-slate-100">
                  Throughput & Stability Monitor
                </h2>
                <p className="mt-0.5 text-xs text-slate-400">
                  Real-time encrypted payload rate and resilience controls
                </p>
              </div>
              <Activity className="h-4 w-4 text-slate-400" />
            </div>

            <ThroughputSparkline data={throughputHistory} connected={isConnected} />
          </div>

          {/* Interactive Stability Simulation Triggers */}
          <div className="mt-5 border-t border-slate-800/80 pt-4">
            <div className="mb-2.5 text-xs font-medium text-slate-300">
              Connection Stability Drills
            </div>
            <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              <button
                type="button"
                onClick={onSimulateHandoff}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700/80 bg-[#090D16] px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-slate-600 hover:bg-slate-800/70 whitespace-nowrap cursor-pointer"
              >
                <Wifi className="h-3.5 w-3.5 text-blue-400" />
                Simulate Wi-Fi → 5G Handoff
              </button>
              <button
                type="button"
                onClick={onSimulateDrop}
                className="inline-flex items-center justify-center gap-2 rounded-md border border-slate-700/80 bg-[#090D16] px-3 py-2 text-xs font-medium text-slate-200 transition-colors hover:border-rose-500/50 hover:bg-rose-950/30 whitespace-nowrap cursor-pointer"
              >
                <ShieldAlert className="h-3.5 w-3.5 text-rose-400" />
                Test Unexpected Drop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row: Smart Recommendations & Pinned Favorites */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-100">
                Smart Server Recommendations
              </h2>
              <p className="text-xs text-slate-400">
                Ranked dynamically by RTT latency, load %, and distance
              </p>
            </div>
            <button
              type="button"
              onClick={onOpenServers}
              className="text-xs font-medium text-blue-400 hover:text-blue-300 whitespace-nowrap cursor-pointer"
            >
              View all {servers.length} nodes
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {smartTopServers.map((node) => {
              const score = computeSmartScore(node);
              const active = node.id === selectedServer.id;
              return (
                <div
                  key={node.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                      <span className="truncate">{node.city}, {node.country}</span>
                      {active && (
                        <span className="text-xs font-medium text-blue-400">Selected</span>
                      )}
                    </div>
                    <div className="font-mono-tabular text-xs text-slate-400">
                      Score {score}/100 · {node.latencyMs} ms · Load {node.loadPct}%
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => onToggleFavorite(node.id)}
                      aria-label={`Toggle favorite for ${node.city}`}
                      className="rounded p-1.5 text-slate-400 hover:bg-slate-800 hover:text-amber-400 cursor-pointer"
                    >
                      <Star
                        className={`h-4 w-4 ${
                          favoriteIds.includes(node.id)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-500'
                        }`}
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => onSelectServer(node)}
                      className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${
                        active
                          ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                          : 'bg-slate-800 text-slate-200 hover:bg-slate-700'
                      }`}
                    >
                      {active && isConnected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="rounded-lg border border-slate-800 bg-[#0F1624] p-5">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <h2 className="font-display text-base font-semibold text-slate-100">
                Pinned Favorites
              </h2>
              <p className="text-xs text-slate-400">
                Quick-switch locations saved to your profile
              </p>
            </div>
            <span className="font-mono-tabular text-xs text-slate-400">
              {favoriteIds.length} pinned
            </span>
          </div>

          {pinnedServers.length === 0 ? (
            <div className="flex h-36 flex-col items-center justify-center rounded-md border border-dashed border-slate-800 text-center">
              <p className="text-sm text-slate-400">No favorite servers pinned yet.</p>
              <button
                type="button"
                onClick={onOpenServers}
                className="mt-2 text-xs font-medium text-blue-400 hover:text-blue-300 cursor-pointer"
              >
                Browse Server Directory
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80">
              {pinnedServers.map((node) => {
                const active = node.id === selectedServer.id;
                return (
                  <div
                    key={node.id}
                    className="flex items-center justify-between gap-3 py-2.5"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-100">
                        <span className="truncate">{node.city}, {node.country}</span>
                        {node.health === 'unreachable' && (
                          <span className="text-xs text-rose-400">Unreachable</span>
                        )}
                      </div>
                      <div className="font-mono-tabular text-xs text-slate-400">
                        {node.exitIp} · {node.latencyMs} ms · {node.loadPct}% load
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        type="button"
                        onClick={() => onToggleFavorite(node.id)}
                        aria-label={`Remove ${node.city} from favorites`}
                        className="rounded p-1.5 text-amber-400 hover:bg-slate-800 cursor-pointer"
                      >
                        <Star className="h-4 w-4 fill-amber-400" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectServer(node)}
                        disabled={node.health === 'unreachable'}
                        className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-200 transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40 whitespace-nowrap cursor-pointer"
                      >
                        {active && isConnected ? 'Connected' : 'Switch'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
