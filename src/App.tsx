import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  Compass,
  Globe,
  Layers,
  Lock,
  Menu,
  Shield,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import {
  ConnectionState,
  EdgeScenario,
  ServerNode,
  SplitTunnelRule,
  ThroughputPoint,
  VpnProtocol,
  WorkspaceTab,
} from './types/vpn';
import {
  computeSmartScore,
  INITIAL_SERVERS,
  INITIAL_SPLIT_RULES,
} from './data/vpnData';
import { TunnelOverview } from './components/TunnelOverview';
import { ServerDirectory } from './components/ServerDirectory';
import { SecurityControls } from './components/SecurityControls';
import { ArchitectureBlueprint } from './components/ArchitectureBlueprint';
import { UxStatesExplorer } from './components/UxStatesExplorer';
import { ScenarioBanner } from './components/ScenarioBanner';

const INITIAL_THROUGHPUT: ThroughputPoint[] = Array.from({ length: 24 }, (_, idx) => ({
  timestamp: idx,
  downloadMbps: 0,
  uploadMbps: 0,
}));

export default function App() {
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('overview');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Server & Favorite State
  const [servers, setServers] = useState<ServerNode[]>(INITIAL_SERVERS);
  const [selectedServerId, setSelectedServerId] = useState<string>('us-nyc-01');
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('meridian_favorites');
      return saved ? JSON.parse(saved) : ['us-nyc-01', 'ch-zrh-01', 'jp-tyo-01'];
    } catch {
      return ['us-nyc-01', 'ch-zrh-01', 'jp-tyo-01'];
    }
  });

  // Tunnel & Security State
  const [connectionState, setConnectionState] = useState<ConnectionState>('connected');
  const [protocol, setProtocol] = useState<VpnProtocol>('wireguard');
  const [killSwitchEnabled, setKillSwitchEnabled] = useState(true);
  const [strictKillSwitch, setStrictKillSwitch] = useState(false);
  const [dnsLeakProtection, setDnsLeakProtection] = useState(true);
  const [ipv6LeakProtection, setIpv6LeakProtection] = useState(true);
  const [autoReconnect, setAutoReconnect] = useState(true);
  const [splitTunnelEnabled, setSplitTunnelEnabled] = useState(true);
  const [splitRules, setSplitRules] = useState<SplitTunnelRule[]>(() => {
    try {
      const saved = localStorage.getItem('meridian_split_rules');
      return saved ? JSON.parse(saved) : INITIAL_SPLIT_RULES;
    } catch {
      return INITIAL_SPLIT_RULES;
    }
  });

  // Telemetry & Usage State
  const [sessionSeconds, setSessionSeconds] = useState(142);
  const [sessionDownMb, setSessionDownMb] = useState(318.4);
  const [sessionUpMb, setSessionUpMb] = useState(46.2);
  const [monthlyUsedGb, setMonthlyUsedGb] = useState(184.6);
  const [monthlyCapGb, setMonthlyCapGb] = useState(500);
  const [usageAlertPct, setUsageAlertPct] = useState(80);
  const [throughputHistory, setThroughputHistory] = useState<ThroughputPoint[]>(() =>
    Array.from({ length: 24 }, (_, idx) => ({
      timestamp: idx,
      downloadMbps: 145 + Math.sin(idx * 0.6) * 28 + (idx % 3) * 6,
      uploadMbps: 42 + Math.cos(idx * 0.5) * 9,
    }))
  );

  // Network & Edge-State Simulator
  const [networkMedium, setNetworkMedium] = useState<'Wi-Fi (5 GHz)' | '5G Cellular'>('Wi-Fi (5 GHz)');
  const [activeScenario, setActiveScenario] = useState<EdgeScenario>('none');
  const [permissionGranted, setPermissionGranted] = useState(true);

  const connectTimerRef = useRef<number | null>(null);

  const selectedServer = useMemo(
    () => servers.find((s) => s.id === selectedServerId) ?? servers[0],
    [servers, selectedServerId]
  );

  const recommendedNeighbor = useMemo(() => {
    const healthy = servers
      .filter((s) => s.id !== selectedServer.id && s.health !== 'unreachable')
      .sort((a, b) => computeSmartScore(b) - computeSmartScore(a));
    return healthy[0] ?? servers[0];
  }, [servers, selectedServer.id]);

  // Persist favorites & split rules
  useEffect(() => {
    try {
      localStorage.setItem('meridian_favorites', JSON.stringify(favoriteIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [favoriteIds]);

  useEffect(() => {
    try {
      localStorage.setItem('meridian_split_rules', JSON.stringify(splitRules));
    } catch {
      // Ignore storage quota errors
    }
  }, [splitRules]);

  // Live 1s tunnel telemetry loop
  useEffect(() => {
    if (connectionState !== 'connected') {
      return;
    }

    const interval = window.setInterval(() => {
      setSessionSeconds((s) => s + 1);

      const loadFactor = Math.max(0.45, 1 - selectedServer.loadPct / 150);
      const downMbps = Number((110 * loadFactor + Math.random() * 85).toFixed(1));
      const upMbps = Number((28 * loadFactor + Math.random() * 24).toFixed(1));

      const downDeltaMb = downMbps / 8;
      const upDeltaMb = upMbps / 8;

      setSessionDownMb((prev) => prev + downDeltaMb);
      setSessionUpMb((prev) => prev + upDeltaMb);
      setMonthlyUsedGb((prev) => prev + (downDeltaMb + upDeltaMb) / 1024);

      setThroughputHistory((prev) => [
        ...prev.slice(1),
        {
          timestamp: Date.now(),
          downloadMbps: downMbps,
          uploadMbps: upMbps,
        },
      ]);
    }, 1000);

    return () => window.clearInterval(interval);
  }, [connectionState, selectedServer.loadPct]);

  const clearPendingTimer = () => {
    if (connectTimerRef.current !== null) {
      window.clearTimeout(connectTimerRef.current);
      connectTimerRef.current = null;
    }
  };

  const initiateConnect = (targetServer?: ServerNode) => {
    clearPendingTimer();
    const node = targetServer ?? selectedServer;

    if (node.health === 'unreachable') {
      setConnectionState('error');
      setActiveScenario('server_overloaded');
      return;
    }

    if (!permissionGranted) {
      setActiveScenario('permission_required');
      return;
    }

    setConnectionState('connecting');
    setActiveScenario('none');

    const handshakeDelay = protocol === 'wireguard' ? 450 : 750;
    connectTimerRef.current = window.setTimeout(() => {
      setSessionSeconds(0);
      setSessionDownMb(0);
      setSessionUpMb(0);
      setConnectionState('connected');
    }, handshakeDelay);
  };

  const handleToggleConnection = () => {
    if (connectionState === 'connected' || connectionState === 'connecting' || connectionState === 'reconnecting') {
      clearPendingTimer();
      setConnectionState(strictKillSwitch && killSwitchEnabled ? 'killswitch_blocked' : 'disconnected');
      setThroughputHistory(INITIAL_THROUGHPUT);
      return;
    }
    initiateConnect();
  };

  const handleSelectServer = (server: ServerNode) => {
    if (server.health === 'unreachable') {
      setSelectedServerId(server.id);
      setConnectionState('error');
      setActiveScenario('server_overloaded');
      return;
    }
    setSelectedServerId(server.id);
    if (connectionState === 'connected' || connectionState === 'killswitch_blocked' || connectionState === 'error') {
      initiateConnect(server);
    }
  };

  const handleConnectFastest = () => {
    const fastest = [...servers]
      .filter((s) => s.health !== 'unreachable')
      .sort((a, b) => computeSmartScore(b) - computeSmartScore(a))[0];
    if (fastest) {
      setSelectedServerId(fastest.id);
      initiateConnect(fastest);
    }
  };

  const handleToggleFavorite = (id: string) => {
    setFavoriteIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleRefreshHealth = () => {
    setServers((prev) =>
      prev.map((s) => {
        if (s.health === 'unreachable') {
          return {
            ...s,
            health: 'nominal',
            loadPct: 28,
            latencyMs: Math.max(14, s.latencyMs - 10),
          };
        }
        const deltaLatency = Math.round((Math.random() - 0.5) * 12);
        const deltaLoad = Math.round((Math.random() - 0.5) * 14);
        const nextLoad = Math.min(92, Math.max(12, s.loadPct + deltaLoad));
        return {
          ...s,
          latencyMs: Math.max(12, s.latencyMs + deltaLatency),
          loadPct: nextLoad,
          health: nextLoad >= 78 ? 'elevated' : 'nominal',
        };
      })
    );
  };

  const handleSimulateOutage = () => {
    setServers((prev) =>
      prev.map((s) =>
        s.id === selectedServer.id
          ? { ...s, loadPct: 98, health: 'unreachable' }
          : s
      )
    );
    setConnectionState('error');
    setActiveScenario('server_overloaded');
  };

  const handleSimulateDrop = () => {
    clearPendingTimer();
    if (killSwitchEnabled) {
      setConnectionState('killswitch_blocked');
      setActiveScenario('kill_switch_triggered');
    } else {
      setConnectionState('disconnected');
    }
    setThroughputHistory(INITIAL_THROUGHPUT);
  };

  const handleSimulateHandoff = () => {
    clearPendingTimer();
    setNetworkMedium((prev) =>
      prev === 'Wi-Fi (5 GHz)' ? '5G Cellular' : 'Wi-Fi (5 GHz)'
    );
    if (connectionState === 'connected' || connectionState === 'disconnected') {
      setConnectionState('reconnecting');
      connectTimerRef.current = window.setTimeout(() => {
        setConnectionState('connected');
        setActiveScenario('network_handoff');
      }, 650);
    } else {
      setActiveScenario('network_handoff');
    }
  };

  const handleTriggerScenario = (scenario: EdgeScenario) => {
    setActiveScenario(scenario);
    if (scenario === 'permission_required') {
      setPermissionGranted(false);
      setConnectionState('disconnected');
    } else if (scenario === 'timeout_fallback') {
      setConnectionState('error');
    } else if (scenario === 'server_overloaded') {
      setConnectionState('error');
    } else if (scenario === 'network_handoff') {
      handleSimulateHandoff();
    } else if (scenario === 'kill_switch_triggered') {
      setKillSwitchEnabled(true);
      setConnectionState('killswitch_blocked');
    }
    setActiveTab('overview');
  };

  const navItems: { id: WorkspaceTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Tunnel Overview', icon: <Shield className="h-4 w-4" /> },
    { id: 'servers', label: 'Server Directory', icon: <Globe className="h-4 w-4" /> },
    { id: 'security', label: 'Security & Split Tunnel', icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: 'architecture', label: 'System Architecture', icon: <Layers className="h-4 w-4" /> },
    { id: 'ux_states', label: 'UX Flows & Edge States', icon: <Compass className="h-4 w-4" /> },
  ];

  const activeNavLabel = navItems.find((n) => n.id === activeTab)?.label ?? 'Tunnel Overview';

  return (
    <div className="flex min-h-screen bg-[#090D16] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800/90 bg-[#0B111E] lg:flex">
        <div className="flex h-16 items-center border-b border-slate-800/80 px-5">
          <span className="font-display text-lg font-bold tracking-tight text-slate-50 whitespace-nowrap">
            Meridian VPN
          </span>
        </div>

        <nav className="flex-1 space-y-1 p-3" aria-label="Primary Workspace">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-slate-800/90 text-slate-50'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                }`}
              >
                <span className={active ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="border-t border-slate-800/80 p-4 text-xs text-slate-400">
          <div className="font-medium text-slate-300">Active Profile</div>
          <div className="mt-1 truncate">Workstation Pro · macOS</div>
          <div className="mt-1 font-mono-tabular text-[11px] text-slate-500">
            4 / 6 device keys registered
          </div>
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileNavOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="fixed inset-0 bg-black/70"
            onClick={() => setMobileNavOpen(false)}
          />
          <aside className="relative z-10 flex w-64 flex-col border-r border-slate-800 bg-[#0B111E]">
            <div className="flex h-16 items-center justify-between border-b border-slate-800 px-5">
              <span className="font-display text-lg font-bold text-slate-50">Meridian VPN</span>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                className="rounded p-1.5 text-slate-400 hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1 p-3">
              {navItems.map((item) => {
                const active = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileNavOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium whitespace-nowrap ${
                      active
                        ? 'bg-slate-800 text-slate-50'
                        : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
                    }`}
                  >
                    <span className={active ? 'text-blue-400' : 'text-slate-500'}>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Bar Contract: Breadcrumb on left, 1 primary action button on right */}
        <header className="flex h-16 items-center justify-between gap-4 border-b border-slate-800/90 bg-[#0B111E]/80 px-4 sm:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open navigation menu"
              className="rounded-md p-2 text-slate-400 hover:bg-slate-800 hover:text-slate-100 lg:hidden cursor-pointer"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-2 truncate text-sm">
              <span className="text-slate-400 lg:hidden font-display font-bold">Meridian VPN</span>
              <span className="text-slate-600 lg:hidden">/</span>
              <span className="font-medium text-slate-200 truncate">{activeNavLabel}</span>
              <span aria-hidden="true" className="hidden text-slate-600 sm:inline">/</span>
              <span className="hidden font-mono-tabular text-xs text-slate-400 sm:inline">
                {selectedServer.city} ({selectedServer.countryCode})
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleToggleConnection}
              className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                connectionState === 'connected'
                  ? 'border border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700'
                  : connectionState === 'killswitch_blocked'
                  ? 'bg-rose-600 text-white hover:bg-rose-500'
                  : 'bg-blue-600 text-white hover:bg-blue-500'
              }`}
            >
              <Lock className="h-3.5 w-3.5" />
              {connectionState === 'connected'
                ? 'Disconnect Tunnel'
                : connectionState === 'connecting'
                ? 'Handshaking...'
                : connectionState === 'killswitch_blocked'
                ? 'Restore Tunnel'
                : 'Quick Connect'}
            </button>
          </div>
        </header>

        <main className="mx-auto w-full max-w-[1280px] flex-1 p-4 sm:p-6">
          <ScenarioBanner
            scenario={activeScenario}
            selectedServer={selectedServer}
            recommendedNeighbor={recommendedNeighbor}
            onDismiss={() => setActiveScenario('none')}
            onGrantPermission={() => {
              setPermissionGranted(true);
              setActiveScenario('none');
              initiateConnect();
            }}
            onSwitchToStealthTcp={() => {
              setProtocol('openvpn_tcp');
              setActiveScenario('none');
              initiateConnect();
            }}
            onFailoverNeighbor={(neighbor) => {
              setSelectedServerId(neighbor.id);
              setActiveScenario('none');
              initiateConnect(neighbor);
            }}
            onReconnectNow={() => {
              setActiveScenario('none');
              initiateConnect();
            }}
          />

          {activeTab === 'overview' && (
            <TunnelOverview
              servers={servers}
              selectedServer={selectedServer}
              connectionState={connectionState}
              protocol={protocol}
              killSwitchEnabled={killSwitchEnabled}
              dnsLeakProtection={dnsLeakProtection}
              splitTunnelEnabled={splitTunnelEnabled}
              sessionSeconds={sessionSeconds}
              sessionDownMb={sessionDownMb}
              sessionUpMb={sessionUpMb}
              monthlyUsedGb={monthlyUsedGb}
              monthlyCapGb={monthlyCapGb}
              usageAlertPct={usageAlertPct}
              throughputHistory={throughputHistory}
              favoriteIds={favoriteIds}
              originIp="24.118.64.19"
              networkMedium={networkMedium}
              onToggleConnection={handleToggleConnection}
              onConnectFastest={handleConnectFastest}
              onSelectServer={handleSelectServer}
              onToggleFavorite={handleToggleFavorite}
              onSimulateDrop={handleSimulateDrop}
              onSimulateHandoff={handleSimulateHandoff}
              onOpenServers={() => setActiveTab('servers')}
            />
          )}

          {activeTab === 'servers' && (
            <ServerDirectory
              servers={servers}
              selectedServer={selectedServer}
              connectionState={connectionState}
              favoriteIds={favoriteIds}
              onSelectServer={handleSelectServer}
              onToggleFavorite={handleToggleFavorite}
              onRefreshHealth={handleRefreshHealth}
              onSimulateOutage={handleSimulateOutage}
              onConnectFastest={handleConnectFastest}
            />
          )}

          {activeTab === 'security' && (
            <SecurityControls
              protocol={protocol}
              killSwitchEnabled={killSwitchEnabled}
              strictKillSwitch={strictKillSwitch}
              dnsLeakProtection={dnsLeakProtection}
              ipv6LeakProtection={ipv6LeakProtection}
              autoReconnect={autoReconnect}
              splitTunnelEnabled={splitTunnelEnabled}
              splitRules={splitRules}
              onChangeProtocol={setProtocol}
              onToggleKillSwitch={() => setKillSwitchEnabled((v) => !v)}
              onToggleStrictKillSwitch={() => setStrictKillSwitch((v) => !v)}
              onToggleDnsProtection={() => setDnsLeakProtection((v) => !v)}
              onToggleIpv6Protection={() => setIpv6LeakProtection((v) => !v)}
              onToggleAutoReconnect={() => setAutoReconnect((v) => !v)}
              onToggleSplitTunnel={() => setSplitTunnelEnabled((v) => !v)}
              onToggleRule={(id) =>
                setSplitRules((prev) =>
                  prev.map((r) => (r.id === id ? { ...r, enabled: !r.enabled } : r))
                )
              }
              onDeleteRule={(id) =>
                setSplitRules((prev) => prev.filter((r) => r.id !== id))
              }
              onAddRule={(rule) =>
                setSplitRules((prev) => [
                  ...prev,
                  { ...rule, id: `rule-${Date.now()}` },
                ])
              }
              onSimulateDrop={handleSimulateDrop}
              onSimulateHandoff={handleSimulateHandoff}
            />
          )}

          {activeTab === 'architecture' && (
            <ArchitectureBlueprint
              monthlyCapGb={monthlyCapGb}
              usageAlertPct={usageAlertPct}
              onChangeMonthlyCap={setMonthlyCapGb}
              onChangeUsageAlert={setUsageAlertPct}
            />
          )}

          {activeTab === 'ux_states' && (
            <UxStatesExplorer
              activeScenario={activeScenario}
              onTriggerScenario={handleTriggerScenario}
            />
          )}
        </main>
      </div>
    </div>
  );
}
